import React, { useEffect, useState } from 'react';
import { Search, Building2, Loader2, Image as ImageIcon } from 'lucide-react';
import EmbassyStats from '../../Components/admin/embassy/EmbassyStats';
import EmbassyTable from '../../Components/admin/embassy/EmbassyTable';
import EmbassyModal from '../../Components/admin/embassy/modal/EmbassyModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEmbassy } from '../../Redux/Slice/embassySlice';
import getSweetAlert from "../../util/alert/sweetAlert";

const ManageEmbassy = () => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEmbassies, setExpandedEmbassies] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const { isEmbassyLoading, allEmbassyData: embassyData, hasEmbassyerror } = useSelector(state => state?.embassy);

  // const embassyData = allEmbassyData?.filter(embassy=>embassy?.is_country_available)
  useEffect(() => {
    dispatch(fetchAllEmbassy())
      .then(res => {
        // console.log('Response for fetching all embassy', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  const filteredEmbassies = embassyData.filter(e => {
    const embassyName = e?.country_name + ' Embassy';

    const matchesSearch = embassyName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      e?.country_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'processing' ? (!e?.starting_hours || !e?.country_id) && e?.is_approved == 'pending'
      : selectedStatus === 'pending' ? e?.starting_hours && e?.country_id && e?.is_approved == 'pending'
        : selectedStatus === 'fulfilled' || selectedStatus === 'rejected' ? e?.is_approved === selectedStatus?.toLowerCase() : e;

    return matchesSearch && matchesStatus;
  });

  // console.log('All available embassy data', embassyData);

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Manage Embassies</h1>
        <p className="text-slate-400 text-sm mt-1">Review and manage embassy registrations</p>
      </div>

      <EmbassyStats embassies={embassyData} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search embassies name, country name, email ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
        </div>

        <select
          // value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer min-w-[160px]"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="fulfilled">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-slate-700/30 backdrop-blur-sm rounded-lg border border-slate-600/50 overflow-hidden">
        <div className="overflow-x-auto">
          <EmbassyTable filteredEmbassies={filteredEmbassies} expandedEmbassies={expandedEmbassies} setExpandedEmbassies={setExpandedEmbassies} setSelectedDocument={setSelectedDocument} />
        </div>

        {isEmbassyLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-16 h-16 text-white animate-spin mx-auto text-center" />
            <p className="text-slate-400 text-lg">Loading...</p>
          </div>
        )}

        {!isEmbassyLoading && filteredEmbassies?.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No embassies found</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-slate-600/50 text-center text-sm text-slate-500">
          Showing {filteredEmbassies.length} of {embassyData.length} embassies
        </div>
      </div>

      {selectedDocument && (
        <EmbassyModal selectedDocument={selectedDocument} setSelectedDocument={setSelectedDocument} />
      )}
    </div>
  );
};

export default ManageEmbassy;