import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllApplications } from '../../Redux/Slice/applicationSlice';
import getSweetAlert from '../../util/alert/sweetAlert';
import ApplicationStats from '../../Components/admin/applications/ApplicationStats';
import ApplicationTable from '../../Components/admin/applications/ApplicationTable';
import { ApplicationDetail } from '../../Components/admin/applications/ApplicationDetail';

const ViewApplicationsAdmin = () => {
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const [resolvedApplications, setResolvedApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { isApplicationLoading, allApplications } = useSelector(state => state.application);

  // Fetch all applications
  useEffect(() => {
    dispatch(getAllApplications()).catch(() =>
      getSweetAlert('Oops...', 'Something went wrong!', 'error')
    );
  }, [dispatch]);

  // Filter & Search
  useEffect(() => {
    let filtered = resolvedApplications;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (searchTerm) {
      filtered = filtered?.filter(a =>
        (a?.application_personal_info?.first_name + " " + a?.application_personal_info?.last_name)?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        a?.id.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        a?.application_country_info?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        a?.application_personal_info?.country?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
    setCurrentPage(1);
  }, [resolvedApplications, searchTerm, filterStatus]);

  // Stats
  const stats = {
    total: resolvedApplications?.length,
    processing: resolvedApplications?.filter(a => a?.status === 'processing').length,
    approved: resolvedApplications?.filter(a => a?.status === 'approved').length,
    rejected: resolvedApplications?.filter(a => a?.status === 'rejected').length
  };

  // console.log('Application details', resolvedApplications);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">View Applications</h1>
          <p className="text-sm md:text-base text-slate-400">Monitor and track all visa applications across embassies</p>
        </div>

        {/* Stats Cards */}
        <ApplicationStats stats={stats} />

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>

          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer min-w-[160px] pr-10"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Applications Table */}
        <ApplicationTable isApplicationLoading={isApplicationLoading} filteredApplications={filteredApplications} currentPage={currentPage} />

        {/* Resolver Components */}
        {allApplications.map(app => (
          <ApplicationDetail
            key={app.id}
            app={app}
            onLoad={(data) => setResolvedApplications(prev => {
              if (!prev.find(d => d.id === data.id)) return [...prev, data];
              return prev;
            })}
          />
        ))}

      </div>
    </div>
  );
};

export default ViewApplicationsAdmin;
