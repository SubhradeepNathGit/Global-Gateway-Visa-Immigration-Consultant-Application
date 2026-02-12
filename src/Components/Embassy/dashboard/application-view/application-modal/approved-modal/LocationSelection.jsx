import React, { useEffect, useState } from 'react';
import { MapPin, CheckCircle2, Building2, Phone, Clock, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const LocationSelection = ({ selectedLocation, currentCountry, setSelectedLocation, application, visaDetails, existingLocation }) => {
    const [embassyOffices, setEmbassyOffices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // User's location (where they live)
    const userCountry = application?.application_personal_info?.country;
    const userCity = application?.application_personal_info?.city;
    const userState = application?.application_personal_info?.state;

    /**
     * Extract destination country from visaDetails first, then fallback to application
     */
    const destinationCountry =
        visaDetails?.country_name ||
        visaDetails?.country?.name ||
        visaDetails?.country ||
        application?.destinationCountry ||
        currentCountry || null;

    // useEffect(() => {
    //     console.log('=== LocationSelection Debug ===');
    //     console.log('Full Application:', application);
    //     console.log('Visa Details:', visaDetails);
    //     console.log('User Country:', userCountry);
    //     console.log('User City:', userCity);
    //     console.log('Destination Country:', destinationCountry);
    // }, [application, visaDetails, destinationCountry]);

    const fetchEmbassies = async () => {
        if (!userCountry || !destinationCountry) {
            // console.error('Missing required data:', { userCountry, destinationCountry });
            setError('Missing location information');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // console.log(`Searching for ${destinationCountry} embassies in ${userCountry}...`);

            // OPTIMIZATION 1: Start geocoding user city immediately in parallel
            const userCityGeocodePromise = userCity ? (async () => {
                try {
                    const cityGeocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(userCity + ', ' + userCountry)}&format=json&limit=1`;
                    const cityResponse = await fetch(cityGeocodeUrl, {
                        headers: { 'User-Agent': 'VisaApplicationSystem/1.0' }
                    });
                    const cityData = await cityResponse.json();
                    if (cityData && cityData.length > 0) {
                        return { lat: parseFloat(cityData[0].lat), lon: parseFloat(cityData[0].lon) };
                    }
                } catch (err) {
                    console.error('Error geocoding user city:', err);
                }
                return null;
            })() : Promise.resolve(null);

            // OPTIMIZATION 2: Reduce to 3 most effective queries
            const searchQueries = [
                `${destinationCountry} embassy ${userCountry}`,
                `${destinationCountry} consulate ${userCountry}`,
                `embassy of ${destinationCountry} ${userCountry}`,
            ];

            // OPTIMIZATION 3: Truly parallel fetch with minimal stagger (100ms)
            const fetchPromises = searchQueries.map(async (query, i) => {
                try {
                    const nominatimUrl = `https://nominatim.openstreetmap.org/search?` +
                        `q=${encodeURIComponent(query)}&` +
                        `format=json&` +
                        `addressdetails=1&` +
                        `extratags=1&` +
                        `limit=30`;

                    // Minimal stagger to respect rate limits (100ms instead of 200ms)
                    if (i > 0) {
                        await new Promise(resolve => setTimeout(resolve, i * 100));
                    }

                    const response = await fetch(nominatimUrl, {
                        headers: {
                            'User-Agent': 'VisaApplicationSystem/1.0',
                            'Accept': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        return [];
                    }

                    const results = await response.json();
                    return results || [];
                } catch (err) {
                    console.error(`Error in query ${i + 1}:`, err);
                    return [];
                }
            });

            // Wait for all queries to complete in parallel
            const allResultsArrays = await Promise.all(fetchPromises);
            const allResults = allResultsArrays.flat();

            // console.log(`Total results from all queries: ${allResults.length}`);

            if (allResults.length === 0) {
                setError(`No ${destinationCountry} embassy/consulate data found in Map for ${userCountry}.`);
                setEmbassyOffices([]);
                return;
            }

            // OPTIMIZATION 4: Streamlined filtering with minimal logging
            const destLower = destinationCountry.toLowerCase();
            const userCountryLower = userCountry.toLowerCase();

            const embassies = allResults
                .filter(place => {
                    const displayName = (place.display_name || '').toLowerCase();
                    const type = (place.type || '').toLowerCase();
                    const placeClass = (place.class || '').toLowerCase();
                    const address = place.address || {};
                    const addressCountry = (address.country || '').toLowerCase();

                    const mainName = displayName.split(',')[0].trim();

                    const nameHasDestination = mainName.includes(destLower) ||
                        mainName.includes(destLower + 'n') ||
                        mainName.includes(destLower + 'ian');

                    const nameDoesNotHaveUserCountry = !mainName.includes(userCountryLower);

                    const locationInUserCountry = displayName.includes(`, ${userCountryLower}`) ||
                        displayName.endsWith(userCountryLower) ||
                        addressCountry.includes(userCountryLower);

                    const isEmbassy = mainName.includes('embassy') ||
                        mainName.includes('consulate') ||
                        mainName.includes('high commission') ||
                        mainName.includes('diplomatic') ||
                        type === 'embassy' ||
                        placeClass === 'amenity';

                    return nameHasDestination &&
                        nameDoesNotHaveUserCountry &&
                        locationInUserCountry &&
                        isEmbassy;
                })
                .map(place => {
                    const address = place.address || {};
                    const displayName = place.display_name || '';
                    const nameParts = displayName.split(',');
                    const mainName = nameParts[0] || `${destinationCountry} Embassy`;

                    const nameLower = mainName.toLowerCase();
                    let type = 'Embassy';
                    if (nameLower.includes('consulate general')) type = 'Consulate General';
                    else if (nameLower.includes('consulate')) type = 'Consulate';
                    else if (nameLower.includes('high commission')) type = 'High Commission';

                    const fullAddress = [
                        address.house_number,
                        address.road || address.street,
                        address.suburb || address.neighbourhood,
                        address.city || address.town || address.village,
                        address.state,
                        address.postcode,
                        address.country || userCountry
                    ].filter(Boolean).join(', ');

                    return {
                        id: place.place_id,
                        name: mainName,
                        city: address.city || address.town || address.village || 'Not specified',
                        state: address.state || '',
                        address: fullAddress || displayName,
                        phone: place.extratags?.phone || place.extratags?.['contact:phone'] || 'Not available',
                        workingHours: place.extratags?.opening_hours || 'Contact embassy',
                        type,
                        coordinates: {
                            lat: parseFloat(place.lat),
                            lng: parseFloat(place.lon)
                        },
                        website: place.extratags?.website || place.extratags?.['contact:website'] || null,
                        email: place.extratags?.email || place.extratags?.['contact:email'] || null,
                        openStreetMapUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lon}#map=18/${place.lat}/${place.lon}`,
                        importance: place.importance || 0
                    };
                });

            // OPTIMIZATION 5: Efficient deduplication using Map
            const uniqueMap = new Map();
            embassies.forEach(embassy => {
                const key = `${Math.round(embassy.coordinates.lat * 1000)},${Math.round(embassy.coordinates.lng * 1000)}`;
                if (!uniqueMap.has(key)) {
                    uniqueMap.set(key, embassy);
                }
            });
            const unique = Array.from(uniqueMap.values());

            // console.log(`Processed ${unique.length} unique embassies`);

            if (unique.length === 0) {
                setError(`No ${destinationCountry} embassies found in ${userCountry}.`);
                setEmbassyOffices([]);
                return;
            }

            // OPTIMIZATION 6: Parallel distance calculation with user city geocode
            const userCoords = await userCityGeocodePromise;

            if (userCoords) {
                // console.log(`User city (${userCity}) coordinates:`, userCoords);

                // Calculate all distances at once using optimized haversine
                const R = 6371; // Earth's radius in km
                unique.forEach(embassy => {
                    const lat1 = userCoords.lat * Math.PI / 180;
                    const lat2 = embassy.coordinates.lat * Math.PI / 180;
                    const dLat = (embassy.coordinates.lat - userCoords.lat) * Math.PI / 180;
                    const dLon = (embassy.coordinates.lng - userCoords.lon) * Math.PI / 180;

                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    embassy.distanceFromUser = R * c;
                });

                unique.sort((a, b) => (a.distanceFromUser || Infinity) - (b.distanceFromUser || Infinity));
                // console.log('Sorted by distance. Nearest:', unique[0]?.name);
            } else {
                unique.sort((a, b) => b.importance - a.importance);
            }

            setEmbassyOffices(unique);
            setError(null);

            // Auto-select the nearest embassy
            if (unique.length && !selectedLocation) {
                setSelectedLocation(unique[0]);
                // console.log('Auto-selected nearest embassy:', unique[0].name);
            }
        } catch (err) {
            console.error('Embassy fetch error:', err);
            setError(`Failed to fetch embassy data: ${err.message}`);
            setEmbassyOffices([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateWorkingHours = (start, end) => {
        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        const startMinutes = sh * 60 + sm;
        const endMinutes = eh * 60 + em;

        return (endMinutes - startMinutes) / 60;
    };

    useEffect(() => {
        if (userCountry && destinationCountry) {
            fetchEmbassies();
        }
    }, [userCountry, destinationCountry]);

    if (loading) {
        return (
            <div className="rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-center gap-3 py-8">
                    <Loader2 className="text-blue-600 animate-spin" size={24} />
                    <p className="text-gray-600">Searching for {destinationCountry} embassies in {userCountry}</p>
                </div>
            </div>
        );
    }

    if (!userCountry || !destinationCountry) {
        return (
            <div className="rounded-xl p-6 border border-amber-200 bg-amber-50">
                <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="text-amber-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Location Info Required</h3>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                    {!userCountry && "• User country information is missing"}
                    {!userCountry && <br />}
                    {!destinationCountry && "• Destination country information is missing"}
                </p>
            </div>
        );
    }

    if (error && embassyOffices.length === 0) {
        return (
            <div className="rounded-xl p-6 border border-red-200 bg-red-50">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="text-red-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">Error Loading Embassies</h3>
                </div>
                <p className="text-sm text-red-700 mb-3">{error}</p>
                {/* <p className="text-xs text-gray-600">
                    OpenStreetMap may not have complete embassy data for this region. 
                    The data depends on community contributions.
                </p> */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 glass-scrollbar">
                    {existingLocation?.map(embassy => {
                        const isSelected = selectedLocation?.id === embassy?.id;

                        return (
                            <button
                                key={embassy.id}
                                onClick={() => setSelectedLocation(embassy)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {isSelected ? (
                                            <CheckCircle2 className="text-blue-500" size={24} />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`font-semibold text-base mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {embassy?.country_name} {embassy?.role?.charAt(0)?.toUpperCase() + embassy?.role?.slice(1) || 'Embassy'}
                                        </h4>
                                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 bg-purple-100 text-purple-700}`}>
                                            {embassy?.role?.charAt(0)?.toUpperCase() + embassy?.role?.slice(1) || 'Embassy'}
                                        </span>

                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                            <MapPin className="flex-shrink-0 mt-0.5" size={16} />
                                            <span>{embassy?.address}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={14} />
                                                <span>{embassy?.contact_no}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>{calculateWorkingHours(embassy?.starting_hours, embassy?.ending_hours)}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-2">
                                            {embassy?.website_url && (
                                                <a
                                                    href={embassy?.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                                                >
                                                    Website <ExternalLink size={12} />
                                                </a>
                                            )}
                                            {embassy.email && (
                                                <a
                                                    href={`mailto:${embassy.email}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    {embassy.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

            </div>
        );
    }

    return (
        <div className="rounded-xl p-6 border border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Building2 className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Select Embassy Location <span className="text-red-500">*</span>
                    </h3>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Available Embassy</span>
            </div>

            <p className="text-sm text-gray-600 mb-1">
                Choose the <strong>{destinationCountry}</strong> embassy in <strong>{userCountry}</strong> for the appointment
            </p>

            {embassyOffices.length > 0 && (
                <p className="text-xs text-blue-600 mb-4">
                    ✓ Found {embassyOffices.length} {destinationCountry} embassy location(s) in {userCountry}
                </p>
            )}

            {embassyOffices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Building2 className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-sm">No embassy data available</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {embassyOffices.map(office => {
                        const isSelected = selectedLocation?.id === office.id;

                        return (
                            <button
                                key={office.id}
                                onClick={() => setSelectedLocation(office)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {isSelected ? (
                                            <CheckCircle2 className="text-blue-500" size={24} />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h4 className={`font-semibold text-base mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {office.name}
                                        </h4>
                                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded mb-2 ${office.type === 'Embassy' ? 'bg-purple-100 text-purple-700' :
                                            office.type === 'Consulate General' ? 'bg-indigo-100 text-indigo-700' :
                                                office.type === 'Consulate' ? 'bg-green-100 text-green-700' :
                                                    office.type === 'High Commission' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {office.type}
                                        </span>

                                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                                            <MapPin className="flex-shrink-0 mt-0.5" size={16} />
                                            <span>{office.address}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <Phone size={14} />
                                                <span>{office.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>{office.workingHours}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mt-2">
                                            <a
                                                href={office.openStreetMapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                                            >
                                                View on Map <ExternalLink size={12} />
                                            </a>
                                            {office.website && (
                                                <a
                                                    href={office.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                                                >
                                                    Website <ExternalLink size={12} />
                                                </a>
                                            )}
                                            {office.email && (
                                                <a
                                                    href={`mailto:${office.email}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    {office.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {selectedLocation && (
                <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                        ✓ Selected: {selectedLocation.name}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                        {selectedLocation.city}{selectedLocation.state && `, ${selectedLocation.state}`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default LocationSelection;