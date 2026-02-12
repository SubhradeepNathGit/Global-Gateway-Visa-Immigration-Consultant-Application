import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, FileText, Clock, CheckCircle, XCircle, AlertCircle, BookOpen } from 'lucide-react';
import ProfileCard from '../../../Components/user/dashboard/ProfileCard';
import DashboardHeader from '../../../Components/user/dashboard/DashboardHeader';
import StatsCard from '../../../Components/user/dashboard/StatsCard';
import VisaApplicationsSection from '../../../Components/user/dashboard/VisaApplicationsSection';
import PaymentsSection from '../../../Components/user/dashboard/PaymentsSection';
import AppointmentsSection from '../../../Components/user/dashboard/AppointmentsSection';
import PurchasedCoursesSection from '../../../Components/user/dashboard/PurchasedCoursesSection';
import { checkLoggedInUser } from '../../../Redux/Slice/auth/checkAuthSlice';
import { fetchUserTransactions } from '../../../Redux/Slice/transactionSlice';
import { useApplicationsByUser } from '../../../tanstack/query/getApplicationsByUser';
import { useApplicationsWithAppointmentForUser } from '../../../tanstack/query/getAvailableAppointmentForUser';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { fetchUserOrders } from '../../../Redux/Slice/orderSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { data: application, isLoading: isApplicationLoading, isError: isApplicationError, error } = useApplicationsByUser(userAuthData?.id);
  const { data: appointment = [], isLoading: isAppointmentLoading, isError: isAppointmentError } = useApplicationsWithAppointmentForUser(userAuthData?.id, "processing", true);
  const { isTransactionLoading, allTransactions: { all, visa, course } } = useSelector(state => state.transaction);
  const { isOrderLoading, allOrders, hasOrderError } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        // console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (userAuthData) {
      dispatch(fetchUserTransactions(userAuthData?.id))
        .then(res => {
          // console.log('Response for fetching all transaction', res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [dispatch, userAuthData]);

  useEffect(() => {
    if (userAuthData) {
      dispatch(fetchUserOrders({ userId: userAuthData?.id, status: 'success' }))
        .then(res => {
          // console.log('Response for fetching all purchased courses', res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [dispatch, userAuthData]);

  const uniqueCourses = useMemo(() => {
    if (!Array.isArray(allOrders) || allOrders.length === 0) return [];

    return [
      ...new Map(
        allOrders.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .flatMap(order => {
            if (!Array.isArray(order.order_items)) return [];

            return order.order_items.filter(item => item?.course_id && item?.courses).map(item => [
              item.course_id,
              {
                ...item.courses,
                order_created_at: order.created_at,
                purchase_date: order.purchase_date,
              },
            ]);
          })
      ).values(),
    ];
  }, [allOrders]);


  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
      case 'confirmed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'processing':
      case 'pending':
      case 'in progress':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'rejected':
      case 'failed':
      case 'cancelled':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'completed':
      case 'success':
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
      case 'in progress':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  if (isuserLoading || isApplicationLoading || isOrderLoading ) {
    return (
      <div className='flex flex-col h-screen items-center justify-center bg-black'>
        <div className="w-18 h-18 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className='mt-5 text-white'>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Banner with Image */}
      <DashboardHeader />

      {/* Profile Card */}
      <ProfileCard userAuthData={userAuthData} />

      {/* Stats Cards */}
      <StatsCard
        visaApplications={Array.isArray(application) ? application : []}
        appointments={appointment} uniqueCourses={uniqueCourses}
      />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px overflow-x-auto">
              {[
                { id: 'overview', label: 'Visa Applications', icon: FileText },
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'courses', label: 'My Courses', icon: BookOpen }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                    ? 'border-red-600 text-red-700'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <VisaApplicationsSection
                visaApplications={Array.isArray(application) ? application : []}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            )}

            {activeTab === 'appointments' && (
              <AppointmentsSection
                appointments={appointment}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsSection
                transactions={all}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            )}

            {activeTab === 'courses' && (
              <PurchasedCoursesSection
                purchasedCourses={uniqueCourses}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                onNavigate={handleNavigate}
                userAuthData={userAuthData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;