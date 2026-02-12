import React from "react";
import { Globe } from "lucide-react";
import DashboardStats from "../../Components/admin/dashboard/DashboardStats";
import DashboardChart from "../../Components/admin/dashboard/DashboardChart";
import DashboardActivity from "../../Components/admin/dashboard/DashboardActivity";
import AverageProcessingTime from "../../Components/admin/dashboard/AverageProcessingTime";
import QuickLinks from "../../Components/admin/dashboard/QuickLinks";

// Main Dashboard Component
export default function AdminDashboard() {

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-600/20 border border-blue-500/30">
            <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Visa Immigration Insights Panel
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1">
              Track applications, approvals, and processing times
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Charts Section */}
        <DashboardChart />

        {/* Sidebar Section */}
        <div className="space-y-4 sm:space-y-6">
          {/* Recent Activity */}
          <DashboardActivity />

          {/* Processing Times */}
          <AverageProcessingTime />

          {/* Quick Actions */}
          <QuickLinks />

        </div>
      </div>
    </div>
  );
}