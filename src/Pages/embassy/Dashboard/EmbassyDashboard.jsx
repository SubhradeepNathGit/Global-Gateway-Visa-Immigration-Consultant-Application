import React, { useEffect } from "react";
import { FileText, CheckCircle, Clock, Calendar, BarChart2 } from "lucide-react";
import StatsCard from "../../../Components/embassy/dashboard/dashboard/StatsCard";
import ApplicationVolumeChart from "../../../Components/embassy/dashboard/dashboard/application-volume/ApplicationVolumeChart";
import ApplicationVolumeHeader from "../../../Components/embassy/dashboard/dashboard/application-volume/ApplicationVolumeHeader";
import RecentApplicationHeader from "../../../Components/embassy/dashboard/dashboard/recent-application/RecentApplicationHeader";
import ApplicationTable from "../../../Components/embassy/dashboard/dashboard/recent-application/application-table/ApplicationTable";
import QuickLinks from "../../../Components/embassy/dashboard/dashboard/quick-links/QuickLinks";
import UpcommingAppointmtnt from "../../../Components/embassy/dashboard/dashboard/Upcomming-appointmtnt/UpcommingAppointmtnt";
import AvgProcessingTime from "../../../Components/embassy/dashboard/dashboard/avg-processing-time/AvgProcessingTime";
import DashboardHeader from "../../../Components/embassy/dashboard/dashboard/DashboardHeader";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { useDispatch, useSelector } from "react-redux";
import { useFullCountryDetails } from "../../../tanstack/query/getCountryDetails";
import { useApplicationsByCountryId } from "../../../tanstack/query/getApplicationsByCountryId";
import { useApplicationStats } from "../../../tanstack/query/getApplicationStatsForEmbassy";
import { getMonthlyChange } from "../../../util/embassy-stats/calcMonthlyChange";
import { buildMonthlyApplicationVolume } from "../../../util/embassy-stats/applicationVolumeChart";
import { fetchApplicationsByCountry } from "../../../Redux/Slice/applicationSlice";
import { useApplicationsWithAppointment } from "../../../tanstack/query/getApplicationsWithAppointment";

export default function EmbassyDashboard() {
  const dispatch = useDispatch();

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isEmbassyLoading, embassyData, hasEmbassyerror } = useSelector(state => state.embassy);
  const { data: countryDetails, isLoading: isCountryLoading, isError: embassyError } = useFullCountryDetails(embassyData?.country_id);
  const { data: allTypeApplications, isLoading: isAllTypeApplicationLoading, error: allTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'all');
  const { data: fulfilledTypeApplications, isLoading: isFulfilledTypeApplicationLoading, error: fulfilledTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'approved');
  const { data: processingTypeApplications, isLoading: isProcessingTypeApplicationLoading, error: processingTypeApplicationsError } = useApplicationsByCountryId(embassyData?.country_id, 'processing');
  const { allApplications, isApplicationLoading: isAllApplicationLoading, isApplicationError: allApplicationLsError } = useSelector(state => state.application);

  // Stats data - Real embassy metrics
  const { data: allStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "all" });
  const { data: fulfilledStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "fulfilled" });
  const { data: processingStats = [] } = useApplicationStats({ countryId: embassyData?.country_id, statusFilter: "processing" });
  const { data: appointmentStats = [], isLoading } = useApplicationsWithAppointment(embassyData?.country_id, "processing", true, true);

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

  const totalChange = getMonthlyChange(allStats);
  const fulfilledChange = getMonthlyChange(fulfilledStats);
  const processingChange = getMonthlyChange(processingStats);
  const appointmentChange = getMonthlyChange(appointmentStats);

  const stats = [
    {
      icon: FileText,
      title: "Total Applications",
      value: allTypeApplications?.length??0,
      change: totalChange?.changeText,
      trend: totalChange?.trend,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: "This month"
    },
    {
      icon: CheckCircle,
      title: "Approved Visas",
      value: fulfilledTypeApplications?.length??0,
      change: fulfilledChange?.changeText,
      trend: fulfilledChange?.trend,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      subtext: "Approval rate"
    },
    {
      icon: Clock,
      title: "Pending Review",
      value: processingTypeApplications?.length??0,
      change: processingChange?.changeText,
      trend: processingChange?.trend,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      subtext: "Avg. 3 days wait"
    },
    {
      icon: Calendar,
      title: "Upcoming Interviews",
      value: appointmentStats?.length??0,
      change: appointmentChange?.changeText,
      trend: appointmentChange?.trend,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      subtext: "Next 7 days"
    }
  ];

  // Chart data - Application volume
  const chartData = buildMonthlyApplicationVolume(allTypeApplications || []);
  const maxValue = Math.max(1, ...chartData.map(d => d.value));

  // Quick actions
  const quickActions = [
    {
      icon: FileText,
      label: "Review Applications",
      count: processingTypeApplications?.length??0 + " pending",
      path: "/embassy/dashboard/applications",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Calendar,
      label: "Schedule Interview",
      count: appointmentStats.length??0 + " upcoming",
      path: "/embassy/dashboard/applications",
      color: "bg-purple-500 hover:bg-purple-600"
    },

    {
      icon: BarChart2,
      label: "Analytics",
      count: "View reports",
      path: "/embassy/dashboard/analytics",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ]

  // console.log('User data', userAuthData);
  // console.log('Embassy data', embassyData);
  // console.log('Country data', countryDetails);
  // console.log('Application data', allTypeApplications);
  // console.log('All Application data', allApplications);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <DashboardHeader />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Charts & Tables */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Application Volume Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <ApplicationVolumeHeader change={fulfilledChange?.changeText} trend={fulfilledChange?.trend} />

            {/* Chart */}
            <ApplicationVolumeChart chartData={chartData} maxValue={maxValue} />
          </div>

          {/* Recent Applications Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[710px]">
            <RecentApplicationHeader />

            <ApplicationTable recentApplications={allApplications} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Quick Actions */}
          <QuickLinks quickActions={quickActions} />

          {/* Upcoming Appointments */}
          <UpcommingAppointmtnt upcomingAppointments={appointmentStats} />

          {/* Processing Times */}
          <AvgProcessingTime countryDetails={countryDetails} />

        </div>
      </div>
    </div>
  );
}