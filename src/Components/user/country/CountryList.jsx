import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCountryDetails } from "../../../Redux/Slice/countrySlice";
import CountryCard from "./CountryCard";
import { ChevronLeft, ChevronRight, Search, Filter, Globe } from "lucide-react";
import getSweetAlert from "../../../util/alert/sweetAlert";

const ITEMS_PER_PAGE = 12;

const CountryList = () => {
    const dispatch = useDispatch();
    const { isAllCountryListLoading, getAllCountryList } = useSelector((state) => state.allCountry);

    // Filter and Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContinent, setSelectedContinent] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAllCountryDetails())
            .catch(err => {
                console.error('Error fetching countries', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }, [dispatch]);

    // Continents for filtering
    const continents = ["All", "Europe", "Asia", "North America", "South America", "Oceania", "Africa"];

    // Filtered result logic
    const filteredCountries = useMemo(() => {
        if (!getAllCountryList) return [];
        
        return getAllCountryList.filter(cun => {
            // Only hide if explicitly blocked
            if (cun.is_blocked === true) return false;
            
            const matchesSearch = (cun.name || "").toLowerCase().includes(searchQuery.toLowerCase());
            
            // Map continents from country_details or direct property
            const continentsData = cun.country_details?.continents || cun.continents;
            const countryContinents = Array.isArray(continentsData) ? continentsData : continentsData ? [continentsData] : [];
            
            const matchesContinent = selectedContinent === "All" || 
                                    (countryContinents.length > 0 && countryContinents.some(c => c === selectedContinent)) ||
                                    (typeof continentsData === 'string' && continentsData.includes(selectedContinent));
            
            return matchesSearch && matchesContinent;
        });
    }, [getAllCountryList, searchQuery, selectedContinent]);

    const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
    const currentCountries = filteredCountries.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedContinent]);

    // Skeleton Loader
    const renderSkeletons = () =>
        Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/4 p-3">
                <div className="bg-white rounded-[1.5rem] border border-gray-100 h-[380px] animate-pulse">
                    <div className="h-[160px] bg-gray-100 rounded-t-[1.5rem]"></div>
                    <div className="p-6 space-y-3">
                        <div className="h-6 bg-gray-100 rounded-full w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                        <div className="h-10 bg-gray-100 rounded-xl w-full mt-4"></div>
                    </div>
                </div>
            </div>
        ));

    return (
        <div className="space-y-10">
            {/* Search and Filters - Lean Version */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between sticky top-4 z-20">
                <div className="relative w-full lg:max-w-lg group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5252] transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-3xl py-3 pl-12 pr-6 focus:ring-2 focus:ring-[#FF5252]/10 focus:border-[#FF5252]/30 focus:outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                    {continents.map((continent) => (
                        <button
                            key={continent}
                            onClick={() => setSelectedContinent(continent)}
                            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                                selectedContinent === continent 
                                ? "bg-[#FF5252] text-white" 
                                : "bg-white text-gray-500 border border-gray-100 hover:border-[#FF5252] hover:text-[#FF5252]"
                            }`}
                        >
                            {continent}
                        </button>
                    ))}
                </div>
            </div>

            {/* Country Cards Grid */}
            <div className="flex flex-wrap -m-3">
                {isAllCountryListLoading
                    ? renderSkeletons()
                    : currentCountries.length > 0 ? (
                        currentCountries.map((country) => (
                            <CountryCard
                                key={country?.id}
                                countryId={country?.id}
                                countryName={country?.name}
                                countryDescription={country?.description}
                                countryData={country}
                            />
                        ))
                    ) : (
                        <div className="w-full py-24 text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-red-50 text-[#FF5252] rounded-full mb-6">
                                <Globe size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No results matching your filter</h3>
                            <button 
                                onClick={() => {setSearchQuery(""); setSelectedContinent("All")}}
                                className="text-[#FF5252] text-sm font-bold hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    )
                }
            </div>

            {/* Pagination UI */}
            {!isAllCountryListLoading && filteredCountries.length > ITEMS_PER_PAGE && (
                <div className="flex justify-center items-center mt-12 gap-2">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`p-2.5 rounded-xl border transition-all ${
                            currentPage === 1 
                            ? "border-gray-50 text-gray-200 cursor-not-allowed" 
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1.5 text-sm font-bold">
                        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`h-10 w-10 rounded-xl transition-all ${
                                    page === currentPage
                                    ? "bg-gray-900 text-white"
                                    : "bg-white text-gray-400 border border-gray-100 hover:border-gray-300 hover:text-gray-900"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`p-2.5 rounded-xl border transition-all ${
                            currentPage === totalPages 
                            ? "border-gray-50 text-gray-200 cursor-not-allowed" 
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CountryList;
