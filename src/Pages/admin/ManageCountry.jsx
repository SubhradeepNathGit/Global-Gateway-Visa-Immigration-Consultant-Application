import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import CountryFormModal from "../../Components/admin/country/CountryFormModal";
import CountryHeader from "../../Components/admin/country/CountryHeader";
import CountryTable from "../../Components/admin/country/CountryTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCountryDetails } from "../../Redux/Slice/countrySlice";
import getSweetAlert from "../../util/alert/sweetAlert";

export default function CountryAdminPanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterContinent, setFilterContinent] = useState("");
  const dispatch = useDispatch();
  const { isAllCountryListLoading, getAllCountryList, isAllCountryListError } = useSelector(state => state.allCountry);

  useEffect(() => {
    dispatch(fetchAllCountryDetails())
      .then(res => {
        // console.log('Response for fetching all country', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  }, []);

  // console.log('All available country details', getAllCountryList);

  const filteredCountry = getAllCountryList.filter(country => country.is_approved == "fulfilled").filter(
    (c) =>
      (c?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c?.country_details?.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c?.country_details?.capital?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!filterContinent || c?.country_details?.continents?.toLowerCase() === filterContinent?.toLowerCase())
  );

  const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "South America", "Oceania"];

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="space-y-6">
        {/* Header */}
        <CountryHeader setSelectedCountry={setSelectedCountry} setIsModalOpen={setIsModalOpen} />

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>

          <select
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
            className="px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="">All Continents</option>
            {continents.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <CountryTable searchQuery={searchQuery} isLoading={isAllCountryListLoading} filteredCountry={filteredCountry} countries={getAllCountryList.filter(country => country.is_approved == "fulfilled")} filterContinent={filterContinent} setCountries={setSelectedCountry} />

        <CountryFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCountry(null);
          }}
          country={selectedCountry}
        />
      </div>
    </div>
  );
}
