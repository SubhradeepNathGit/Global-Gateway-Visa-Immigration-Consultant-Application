import React, { useEffect, useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Clock, ChevronDown, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatsCard from "../../../../Components/embassy/dashboard/applications/StatsCard";
import ApplicationTable from "../../../../Components/embassy/dashboard/applications/application-table/ApplicationTable";
import { useDispatch, useSelector } from "react-redux";
import { useFullCountryDetails } from "../../../../tanstack/query/getCountryDetails";
import { useApplicationsByCountryId } from "../../../../tanstack/query/getApplicationsByCountryId";
import { useApplicationStats } from "../../../../tanstack/query/getApplicationStatsForEmbassy";
import { fetchApplicationsByCountry } from "../../../../Redux/Slice/applicationSlice";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { usePersonalInfoByApplicationId } from "../../../../tanstack/query/getApplicationPersonalInfo";

export default function Applications() {

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isEmbassyLoading, embassyData, hasEmbassyerror } = useSelector(state => state.embassy);
  const { data: countryDetails, isLoading: isCountryLoading, isError: embassyError } = useFullCountryDetails(embassyData?.country_id);
  const { data: allTypeApplications, isLoading: isAllTypeApplicationLoading, error: allTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'all');
  const { data: fulfilledTypeApplications, isLoading: isFulfilledTypeApplicationLoading, error: fulfilledTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'approved');
  const { data: processingTypeApplications, isLoading: isProcessingTypeApplicationLoading, error: processingTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'processing');
  const { allApplications, isApplicationLoading: isAllApplicationLoading, isApplicationError: allApplicationLsError } = useSelector(state => state.application);

  // Stats data - Real embassy metrics
  const { data: allStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "all" });
  const { data: fulfilledStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "approved" });
  const { data: processingStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "processing" });
  const { data: rejectedStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "rejected" });

  useEffect(() => {
    dispatch(fetchApplicationsByCountry({ countryId: embassyData?.country_id, statusFilter: 'all' }))
      .then(res => {
        // console.log('Response for fetching all applications', res);
      })
      .catch(err => {
        console.log('Error occures', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [embassyData?.country_id]);

  const filteredApplications = allApplications?.filter(app => {

    const fullName = app?.application_personal_info?.first_name + " " + app?.application_personal_info?.last_name;

    const matchesSearch =
      app?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      app?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      app?.application_personal_info?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());

    const matchesStatus = filterStatus === "all" || app?.status === filterStatus;
    const matchesType = filterType === "all" || app?.application_visa_details?.visa_type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = [
    {
      label: "Total Applications",
      value: allStats?.length,
      icon: FileText,
      color: "bg-blue-100 text-blue-600"
    },
    {
      label: "Pending",
      value: processingStats?.length,
      icon: Clock,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      label: "Approved",
      value: fulfilledStats?.length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600"
    },
    {
      label: "Rejected",
      value: rejectedStats?.length,
      icon: XCircle,
      color: "bg-red-100 text-red-600"
    }
  ];

  // console.log('User data', userAuthData);
  // console.log('Embassy data', embassyData);
  // console.log('Country data', countryDetails);
  // console.log('Application data', allTypeApplications);
  // console.log('All Application data', allApplications);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Visa Applications</h1>
        <p className="text-gray-600 mt-1">Manage and review all visa applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="processing">Under Review</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visa Type
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Tourist Visa">Tourist Visa</option>
                  <option value="Student Visa">Student Visa</option>
                  <option value="Work Visa">Work Visa</option>
                  <option value="Business Visa">Business Visa</option>
                  <option value="Family Visa">Family Visa</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <ApplicationTable filteredApplications={filteredApplications} />

      {/* Pagination */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredApplications?.length}</span> of{" "}
            <span className="font-medium">{allApplications?.length}</span> applications
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}