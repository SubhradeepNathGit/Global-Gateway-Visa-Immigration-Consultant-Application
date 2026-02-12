import React, { useEffect, useState } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, toggleUserStatus } from "../../Redux/Slice/userSlice";
import getSweetAlert from "../../util/alert/sweetAlert";
import UserRow from "../../Components/admin/user/UserRow";
import UserCard from "../../Components/admin/user/UserCard";
import UserStats from "../../Components/admin/user/UserStats";
import UserHeader from "../../Components/admin/user/UserHeader";
import { useTotalRevenue } from "../../tanstack/query/getTotalRevenue";
import hotToast from "../../util/alert/hot-toast";
import ConfirmBlockUnblockAlert from "../../Components/admin/common/alerts/ConfirmBlockUnblockAlert";
import { createPortal } from "react-dom";

export default function Users() {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { getUserData, isUserLoading, isUserError } = useSelector(state => state.userProfile);
  const { data: totalRevenue, isLoading: isRevenueLoading } = useTotalRevenue();
  // console.log('All User Data',getUserData);

  const handleBlock = () => {
    console.log("change status of user:", userId, currentStatus);
    const status = !currentStatus ? 'blocked' : 'unblocked';

    dispatch(toggleUserStatus({ id: userId, currentStatus }))
      .then(res => {
        // console.log('Response for changing status', res);

        if (res?.meta?.requestStatus == "fulfilled") {
          hotToast(`User ${status} successfully`, "success");
          setAlertModalOpen(false);
          setUserId(null);
          setCurrentStatus(null);
        }
        else {
          hotToast(`User ${status} unsuccessfull`, "error");
        }
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  };

  useEffect(() => {
    dispatch(getAllUsers())
      .then(res => {
        // console.log('Response after fetching all user', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  const handleUserData = (id, status) => {
    setUserId(id);
    setCurrentStatus(status);
  }

  // Filter users
  const filteredUsers = getUserData.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || user.is_verified == statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalUsers = getUserData.length;
  const activeUsers = getUserData.filter(u => u.is_blocked === false && u.is_verified === 'success').length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <UserHeader />

        {/* Stats */}
        <UserStats totalUsers={totalUsers} activeUsers={activeUsers} totalRevenue={totalRevenue} />

        {/* Filters */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Users</option>
                  <option value="success">Verified</option>
                  <option value="failure">Unverified</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/30 border-b border-slate-700/50">
                <tr>
                  <th className="px-6 py-4 w-12"></th>
                  <th className="mx-auto px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="mx-auto px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="mx-auto px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="mx-auto px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="mx-auto px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="mx-auto px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isUserLoading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                    </td>
                  </tr>
                )}
                {!isUserLoading && (!filteredUsers || filteredUsers.length === 0) && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
                {!isUserLoading && filteredUsers?.length > 0 &&
                  filteredUsers?.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      handleUserData={handleUserData}
                      setAlertModalOpen={setAlertModalOpen}
                    />
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile/Tablet */}
        <div className="lg:hidden rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">
              No users found matching your criteria
            </div>
          ) : (
            filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onBlock={handleBlock}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-0">
            <div className="text-xs sm:text-sm text-slate-400">
              Showing {filteredUsers.length} of {getUserData.length} users
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded bg-slate-700/30 hover:bg-slate-700/50 text-white text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded bg-slate-700/30 hover:bg-slate-700/50 text-white text-xs sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {alertModalOpen && createPortal(
        <ConfirmBlockUnblockAlert
          open={alertModalOpen}
          onClose={() => setAlertModalOpen(false)}
          onConfirm={handleBlock}
          buttonText={!currentStatus ? 'Block' : 'Active'}
          type={!currentStatus ? 'block' : 'active'}
          title={`${!currentStatus ? 'Block' : 'Active'} User`}
          message={`Are you sure you want to ${!currentStatus ? 'block' : 'active'} the user?`}
        />,
        document.body)}
    </>
  );
}