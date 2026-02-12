import React, { useEffect, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import VisaStats from '../../Components/admin/visa/VisaStats';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllVisa } from '../../Redux/Slice/visaSlice';
import VisaTable from '../../Components/admin/visa/VisaTable';
import getSweetAlert from '../../util/alert/sweetAlert';

const ManageVisa = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedVisa, setExpandedVisa] = useState(null);
  const [visaStatuses, setVisaStatuses] = useState({});
  const { isVisaListloading, visaListData } = useSelector(state => state?.visa);

  useEffect(() => {
    dispatch(fetchAllVisa())
      .then(res => {
        // console.log('Response for fetching all visa', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [dispatch]);

  const getVisaStatus = (visaId, defaultStatus) => {
    return visaStatuses[visaId] || defaultStatus;
  };

  const filteredVisas = visaListData?.filter(visa => {
    const matchesSearch = visa?.visa_type?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || visa?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // console.log('All available visa', visaListData);

  return (
    <div className="min-h-screen w-full bg-transparent">
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-3xl font-bold text-white mb-2">Manage Global Visas</h1>
          <p className="text-slate-400 text-sm">Monitor all visa types and country-specific status</p>
        </div>

        {/* Stats Cards */}
        <VisaStats visaListData={visaListData} />

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search visa types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer min-w-[140px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '12px'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Visa Table */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <VisaTable expandedVisa={expandedVisa} setExpandedVisa={setExpandedVisa} filteredVisas={filteredVisas} isVisaListloading={isVisaListloading} getVisaStatus={getVisaStatus} />
          </div>

          {filteredVisas.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No visa types found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        select option {
          background-color: rgb(51, 65, 85);
          color: white;
          padding: 8px;
        }
      `}</style>
    </div>
  );
};

export default ManageVisa;