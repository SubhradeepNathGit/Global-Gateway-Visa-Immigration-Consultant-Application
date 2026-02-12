import React, { useEffect, useState } from "react";
import { Search, Filter, Calendar, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTransactionsWithUsers } from "../../Redux/Slice/transactionSlice";
import TransactionStats from "../../Components/admin/transaction/TransactionStats";
import TransactionRow from "../../Components/admin/transaction/transactionDetails/transaction-row/TransactionRow";
import TransactionHeader from "../../Components/admin/transaction/TransactionHeader";
import TransactionCard from "../../Components/admin/transaction/transactionDetails/transaction-card/TransactionCard";

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const { isTransactionLoading, hasTransactionError, transactions: getAllTransactions } = useSelector(state => state.transaction);
  const dispatch = useDispatch();

  // Filter transactions
  const filteredTransactions = getAllTransactions?.filter(txn => {

    // Convert DB timestamp → JS Date
    const txnDate = new Date(txn.created_at);
    const today = new Date();

    // DATE FILTER LOGIC
    const matchesDate = dateFilter === "all" || (dateFilter === "today" && txnDate.toDateString() === today.toDateString()) ||

      (dateFilter === "week" && (() => {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return txnDate >= weekAgo && txnDate <= today;
      })()) ||

      (dateFilter === "month" && (() => {
        return (txnDate.getMonth() === today.getMonth() && txnDate.getFullYear() === today.getFullYear());
      })());

    const matchesSearch =
      txn?.application_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn?.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || txn.status === statusFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  useEffect(() => {
    dispatch(fetchUserTransactionsWithUsers())
  }, [])

  // console.log('All available transactions', getAllTransactions);

  return (
    <div className="space-y-6">
      {/* Header */}
      <TransactionHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TransactionStats />
      </div>

      {/* Filters and Search */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by applicant, ID, or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="success">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-700/30 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/30 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {isTransactionLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!isTransactionLoading && (!filteredTransactions || filteredTransactions.length === 0) && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No transaction found
                  </td>
                </tr>
              )}
              {!isTransactionLoading && filteredTransactions?.length > 0 &&
                filteredTransactions.map(txn => (
                  <TransactionRow key={txn.id} txn={txn} />
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden divide-y divide-slate-700/50">
          {filteredTransactions.length === 0 ? (
            <div className="px-4 py-12 text-center text-slate-400">
              No transactions found matching your criteria
            </div>
          ) : (
            filteredTransactions.map(txn => (
              <TransactionCard key={txn.id} txn={txn} />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
              Showing {filteredTransactions?.length} of {getAllTransactions?.length} transactions
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
    </div>
  );
}