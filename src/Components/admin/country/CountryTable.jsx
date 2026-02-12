import React, { useEffect, useState } from 'react';
import { Globe, Loader2, Plus } from 'lucide-react';
import CountryRow from './CountryRow';
import CountryFormModal from './CountryFormModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCountryDetails, toggleCountryStatus } from '../../../Redux/Slice/countrySlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import hotToast from '../../../util/alert/hot-toast';
import ConfirmBlockUnblockAlert from '../common/alerts/ConfirmBlockUnblockAlert';
import { useEmbassyByCountryId } from '../../../tanstack/query/getEmbassyByCountryId';

const CountryTable = ({ searchQuery, isLoading, filteredCountry, countries, filterContinent, setCountries }) => {
    const [expandedCountryId, setExpandedCountryId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [blockCountryId, setBlockCountryId] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [setStatus, setSetStatus] = useState(null);
    const [currentStatus, setCurrentStatus] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(null);
    const dispatch = useDispatch();

    //   console.log('All available country', filteredCountry);

    const { data, isLoading: embassyLoading } = useEmbassyByCountryId(blockCountryId);

    const isArray = Array.isArray(data);
    const isObject = data && typeof data === 'object' && !isArray;

    let approvedEmbassies = [];

    if (Array.isArray(data)) {
        approvedEmbassies = data.filter(
            embassy => embassy?.is_approved === "fulfilled"
        );
    } else if (data && typeof data === "object") {
        approvedEmbassies =
            data.is_approved === "fulfilled" ? [data] : [];
    }

    useEffect(() => {

        if (blockCountryId === null) return;

        if (embassyLoading) return;

        let approvedEmbassies = [];

        if (Array.isArray(data)) {
            approvedEmbassies = data.filter(
                e => e?.is_approved === "fulfilled"
            );
        } else if (data) {
            approvedEmbassies =
                data.is_approved === "fulfilled" ? [data] : [];
        }

        if (approvedEmbassies.length === 0) {
            getSweetAlert("Oops...", "No approved embassy available right now", "error");
            setBlockCountryId(null);
            return;
        }

        const status = !currentStatus ? "blocked" : "unblocked";

        setBlockCountryId(null);
        setSelectedCountryId(blockCountryId);
        setSetStatus(status);
        setAlertModalOpen(true);
    }, [data, embassyLoading]);

    const handleSaveCountry = (countryData) => {
        if (selectedCountry) {
            // Update existing country
            setCountries(countries.map(c => c.id === countryData.id ? countryData : c));
        } else {
            // Add new country
            setCountries([...countries, countryData]);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCountry(null);
    };

    const handleBlock = (countryId, recentStatus) => {
        // console.log("ID:", countryId, "Status:", recentStatus);

        setBlockCountryId(countryId);
        setCurrentStatus(recentStatus);
    }

    const confirmUnblockBlock = () => {
        // console.log("Unblock / Block country:", selectedCountryId, setStatus);

        dispatch(toggleCountryStatus({ id: selectedCountryId, currentStatus }))
            .then(res => {
                // console.log('Response for changing status', res);

                if (res?.meta?.requestStatus == "fulfilled") {
                    hotToast(`Country ${setStatus} successfully`, "success");
                    dispatch(fetchAllCountryDetails());
                    setAlertModalOpen(false);

                }
                else {
                    hotToast(`Country ${setStatus} unsuccessful`, "error");
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden max-h-[600px] flex flex-col">
                <div className="scroll-bar overflow-x-auto overflow-y-auto flex-1">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-slate-800/90 backdrop-blur-sm z-10">
                            <tr className="border-b border-slate-700/50">
                                <th className="w-12 p-4"></th>
                                {["Country", "Code", "Continent", "Capital", "Currency", "Language", "Status", "Actions"].map((h) => (
                                    <th
                                        key={h}
                                        className="text-left p-4 text-sm font-semibold text-slate-300"
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={12} className="p-12 text-center">
                                        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto text-center" />
                                    </td>
                                </tr>
                            )}
                            {!isLoading && filteredCountry?.map(country => (
                                <CountryRow
                                    key={country?.id}
                                    country={country}
                                    setSelectedCountry={setSelectedCountry}
                                    setIsModalOpen={setIsModalOpen}
                                    setCountries={setCountries}
                                    countries={countries}
                                    expandedCountryId={expandedCountryId}
                                    setExpandedCountryId={setExpandedCountryId}
                                    handleBlock={handleBlock}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                {!isLoading && filteredCountry.length === 0 && (
                    <div className="p-12 text-center">
                        <Globe className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-400 mb-2">
                            {searchQuery || filterContinent
                                ? "No countries found"
                                : "No countries yet"}
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">
                            {searchQuery || filterContinent
                                ? "Try adjusting your search"
                                : "Add your first country"}
                        </p>

                        {!searchQuery && !filterContinent && (
                            <button
                                onClick={() => {
                                    setSelectedCountry(null);
                                    setIsModalOpen(true);
                                }}
                                className="px-4 py-2 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 text-white text-sm transition-all inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Country
                            </button>
                        )}
                    </div>
                )}

                {filteredCountry.length > 0 && (
                    <div className="p-4 border-t border-slate-700/50 text-sm text-slate-400 text-center">
                        Showing {filteredCountry.length} of {countries.length} countries
                    </div>
                )}
            </div>

            {/* MODAL */}
            <CountryFormModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                country={selectedCountry}
                onSave={handleSaveCountry}
            />

            <ConfirmBlockUnblockAlert
                open={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                onConfirm={confirmUnblockBlock}
                buttonText={setStatus == 'blocked' ? 'Block' : 'Unblock'}
                type={setStatus == 'blocked' ? 'block' : 'unblock'}
                title={`${setStatus == 'blocked' ? 'Block' : 'Unblock'} Country`}
                message={`Are you sure you want to ${setStatus == 'blocked' ? 'block' : 'unblock'} country?`}
            />
        </>
    );
};

export default CountryTable;