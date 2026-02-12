import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCountryList } from "../../../Redux/Slice/countrySlice";
import CountryCard from "./CountryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import getSweetAlert from "../../../util/alert/sweetAlert";

const ITEMS_PER_PAGE = 6;

const CountryList = () => {
    const dispatch = useDispatch();
    const { isAllCountryListLoading, getAllCountryList, isAllCountryListError } = useSelector((state) => state.allCountry);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAllCountryList())
            .then(res => {
                // console.log('Response for fetching all country', res);
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
    }, []);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const currentCountries = getAllCountryList.slice(startIndex, endIndex);
    const totalPages = Math.ceil(getAllCountryList.length / ITEMS_PER_PAGE);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToPage = (page) => setCurrentPage(page);

    // Skeleton Loader
    const renderSkeletons = () =>
        Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
                <div className="bg-white rounded-xl shadow-md h-[320px] animate-pulse">
                    <div className="h-[180px] bg-gray-300 rounded-t-xl"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full"></div>
                        <div className="h-4 bg-gray-300 rounded w-4/5"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/3 mt-3"></div>
                    </div>
                </div>
            </div>
        ));

    return (
        <div>
            {/* Country Cards */}
            <div className="flex flex-wrap justify-center -m-4 lg:mx-8 md:mx-2">
                {isAllCountryListLoading
                    ? renderSkeletons()
                    : currentCountries?.filter(cun => cun.is_blocked == false)?.map((country) => (
                        <CountryCard
                            key={country?.id}
                            countryId={country?.id}
                            countryName={country?.name}
                            countryDescription={country?.description}
                        />
                    ))
                }
            </div>

            {/* Pagination UI */}
            {!isAllCountryListLoading && getAllCountryList.length > 0 && (
                <div className="flex justify-center mt-8 gap-2">

                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-md border text-sm border-red-500
                        ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                    >
                        <ChevronLeft className="text-red-500" />
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-3 py-1 rounded-md text-sm border cursor-pointer
                            ${page === currentPage
                                    ? "bg-red-500 text-white"
                                    : "bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-md border text-sm border-red-500
                        ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
                    >
                        <ChevronRight className="text-red-500" />
                    </button>

                </div>
            )}
        </div>
    );
};

export default CountryList;
