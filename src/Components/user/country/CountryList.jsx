import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchAllCountryDetails } from "../../../Redux/Slice/countrySlice";
import CountryCard from "./CountryCard";
import { ChevronLeft, ChevronRight, Search, Filter, Globe } from "lucide-react";
import getSweetAlert from "../../../util/alert/sweetAlert";

const ITEMS_PER_PAGE = 12;

const CountryList = () => {
    const dispatch = useDispatch();
    const { isAllCountryListLoading, getAllCountryList } = useSelector((state) => state.allCountry);
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper to get initial page from URL or sessionStorage across reloads
    const getInitialPage = () => {
        const pageFromUrl = parseInt(searchParams.get("page"), 10);
        if (!isNaN(pageFromUrl) && pageFromUrl > 0) return pageFromUrl;

        try {
            const pageFromStorage = parseInt(sessionStorage.getItem("country_list_page"), 10);
            if (!isNaN(pageFromStorage) && pageFromStorage > 0) return pageFromStorage;
        } catch (e) {
            // ignore storage exception
        }

        return 1;
    };

    // Filter and Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContinent, setSelectedContinent] = useState("All");
    const [currentPage, setCurrentPage] = useState(getInitialPage);
    const isFirstRender = useRef(true);

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

    const handlePageChange = (page, shouldScroll = true) => {
        if (page >= 1 && (totalPages === 0 || page <= totalPages)) {
            setCurrentPage(page);
            try {
                sessionStorage.setItem("country_list_page", String(page));
            } catch (e) {
                // ignore
            }

            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                if (page === 1) {
                    next.delete("page");
                } else {
                    next.set("page", String(page));
                }
                return next;
            }, { replace: true });

            if (shouldScroll) {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) handlePageChange(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) handlePageChange(currentPage - 1);
    };

    // Reset pagination when filters change (skip on initial mount to preserve page across refresh)
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        handlePageChange(1, false);
    }, [searchQuery, selectedContinent]);

    // Sync page if browser back/forward buttons are pressed
    useEffect(() => {
        const pageFromUrl = parseInt(searchParams.get("page"), 10);
        if (!isNaN(pageFromUrl) && pageFromUrl > 0 && pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
            try {
                sessionStorage.setItem("country_list_page", String(pageFromUrl));
            } catch (e) {
                // ignore
            }
        }
    }, [searchParams]);

    // Clamp page if filtered items count is smaller than current page
    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            handlePageChange(totalPages, false);
        }
    }, [totalPages]);

    // Skeleton Loader matching current card structure
    const renderSkeletons = () =>
        Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-3 sm:p-3.5 flex">
                <div className="w-full h-[320px] sm:h-[350px] rounded-xl overflow-hidden relative shadow-md bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 border border-gray-100">
                    {/* Top Bar: Continent pill + Circular flag */}
                    <div className="relative z-10 flex items-center justify-between p-4">
                        <div className="h-6 w-20 bg-gray-300/80 rounded-full border border-white/40 shadow-sm"></div>
                        <div className="h-14 w-14 bg-gray-300/80 rounded-full border border-white/60 shadow-sm"></div>
                    </div>

                    {/* Subtle bottom gradient matching card */}
                    <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-gray-300/50 via-gray-200/20 to-transparent pointer-events-none" />

                    {/* Button matching current card structure */}
                    <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 right-3.5 sm:right-4 z-10">
                        <div className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-white/60 backdrop-blur-md border border-white/70 shadow-sm flex items-center justify-center gap-2">
                            <div className="h-3.5 w-24 bg-gray-300/90 rounded-md"></div>
                            <div className="h-3.5 w-3.5 bg-gray-300/90 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        ));

    return (
        <div className="space-y-10">
            {/* Search + Filter chips — unified sticky bar on mobile */}
            <div className="sticky top-16 z-40 lg:static
                            bg-white/80 lg:bg-transparent
                            backdrop-blur-md lg:backdrop-blur-none
                            border-b border-white/40 lg:border-none
                            shadow-[0_4px_24px_rgba(255,255,255,0.6)] lg:shadow-none
                            -mx-4 px-4 lg:mx-0 lg:px-0
                            py-3 lg:py-0
                            flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">

                {/* Search bar */}
                <div className="relative w-full lg:max-w-lg group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF5252] transition-colors" size={17} />
                    <input 
                        type="text" 
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/70 lg:bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-5 focus:ring-2 focus:ring-[#FF5252]/10 focus:border-[#FF5252]/40 focus:outline-none transition-all text-sm font-medium text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Filter chips */}
                <div className="flex flex-wrap items-center justify-start lg:justify-end gap-1.5">
                    {continents.map((continent) => (
                        <button
                            key={continent}
                            onClick={() => setSelectedContinent(continent)}
                            className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                                selectedContinent === continent 
                                ? "bg-[#FF5252] text-white shadow-sm" 
                                : "bg-white/70 lg:bg-gray-50 text-gray-500 border border-gray-200 hover:border-[#FF5252]/50 hover:text-[#FF5252]"
                            }`}
                        >
                            {continent}
                        </button>
                    ))}
                </div>
            </div>

            {/* Country Cards Grid */}
            <div className="flex flex-wrap -m-3.5 sm:-m-4">
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
                                onClick={() => handlePageChange(page)}
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
