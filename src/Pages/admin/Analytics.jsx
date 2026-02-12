import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler, Legend } from "chart.js";
import AnalyticsStats from "../../Components/admin/analytics/AnalyticsStats";
import AnalyticsHeader from "../../Components/admin/analytics/AnalyticsHeader";
import AnalyticsChart from "../../Components/admin/analytics/AnalyticsChart";
import AdditionalStats from "../../Components/admin/analytics/AdditionalStats";
import CoursePurchaseChart from "../../Components/admin/analytics/chart/CoursePurchaseChart";
import CourseRevenueChart from "../../Components/admin/analytics/chart/CourseRevenueChart";
import RevenueTrendChart from "../../Components/admin/analytics/RevenueTrendChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend
);


export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <AnalyticsHeader />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStats />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart />
      </div>

      {/* Course Analytics - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoursePurchaseChart />

        <CourseRevenueChart />
      </div>

      {/* Revenue & Applications Trend - NEW */}
      <RevenueTrendChart />

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AdditionalStats />
      </div>
    </div>
  );
}