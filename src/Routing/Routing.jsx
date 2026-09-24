import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

/* ---------- Eagerly loaded pages (instant navigation, no chunk load errors) ---------- */
import Home from "../Pages/user/home/Home";
import AuthForm from "../Pages/user/auth/Authentication";
import AdminLoginForm from "../Pages/admin/auth/AdminLoginForm";
import EmbassyAuth from "../Pages/embassy/auth/Auth";
import Cart from "../Pages/user/cart/Cart";

/* ---------- Layouts ---------- */
import UserLayout from "../layout/user";
import AdminLayout from "../layout/admin/AdminLayout";
import EmbassyDashboardLayout from "../layout/Embassy/EmbassyDashboard/EmbassyDashboardLayout";

/* ---------- Utils ---------- */
import ScrollToTop from "../Components/ScrollToTop";
import ProtectedRoute from "../Components/Auth/ProtectedRoute";
import DashboardSkeleton from "../Components/DashboardSkeleton";

/**
 * Safe lazy loader that handles stale build chunks gracefully.
 * If a deployment updates chunk hashes and a user has an old page open,
 * it auto-reloads once to fetch the latest production bundle.
 */
const safeLazy = (importFn) =>
  lazy(async () => {
    const isReloaded = JSON.parse(
      sessionStorage.getItem("chunk_reload_attempted") || "false"
    );
    try {
      const comp = await importFn();
      sessionStorage.removeItem("chunk_reload_attempted");
      return comp;
    } catch (error) {
      if (!isReloaded) {
        sessionStorage.setItem("chunk_reload_attempted", "true");
        window.location.reload();
        return new Promise(() => {}); // Wait for browser reload
      }
      sessionStorage.removeItem("chunk_reload_attempted");
      throw error;
    }
  });

/* ---------- User Pages ---------- */
const AboutSection = safeLazy(() => import("../Pages/user/about/AboutPage"));
const CountryGrid = safeLazy(() => import("../Pages/user/countries/Country"));
const CountryDetails = safeLazy(() => import("../Pages/user/countries/country-details/CountryDetails"));
const ContactUs = safeLazy(() => import("../Pages/user/get-in-touch/ContactUs"));
const Dashboard = safeLazy(() => import("../Pages/user/dashboard/Dashboard"));
const VisaProcess = safeLazy(() => import("../Pages/user/apply-visa/process/VisaProcess"));
const VisaPolicies = safeLazy(() => import("../Pages/user/apply-visa/policy/VisaPolicy"));
const VisaApplicationForm = safeLazy(() => import("../Pages/user/apply-visa/application-form/VisaApplicationForm"));
const PaymentPreview = safeLazy(() => import("../Pages/user/payment/PaymentPreview"));
const PaymentStatus = safeLazy(() => import("../Pages/user/payment/status/PaymentStatus"));
const Courselist = safeLazy(() => import("../Pages/user/course/Courselist"));
const CourseDetails = safeLazy(() => import("../Pages/user/course/course-details/CourseDetails"));
const PaymentInterfaceCourse = safeLazy(() => import("../Pages/user/cart/payment/PaymentInterfaceCourse"));

/* ---------- Auth ---------- */
const ResetPassword = safeLazy(() => import("../Pages/user/auth/ResetPassword"));
const EmailVerification = safeLazy(() => import("../Pages/verification/EmailVerificationPage"));

/* ---------- Admin Pages ---------- */
const AdminDashboard = safeLazy(() => import("../Pages/admin/AdminDashboard"));
const Users = safeLazy(() => import("../Pages/admin/Users"));
const Payments = safeLazy(() => import("../Pages/admin/Payments"));
const Settings = safeLazy(() => import("../Pages/admin/Settings"));
const Analytics = safeLazy(() => import("../Pages/admin/Analytics"));
const ContactMessages = safeLazy(() => import("../Pages/admin/UserContact"));
const CountryManagement = safeLazy(() => import("../Pages/admin/ManageCountry"));
const EmbassyManage = safeLazy(() => import("../Pages/admin/ManageEmbassy"));
const ViewApplications = safeLazy(() => import("../Pages/admin/ViewApplications"));
const CourseManage = safeLazy(() => import("../Pages/admin/CourseManage"));
const AddAdmin = safeLazy(() => import("../Pages/admin/ManageAdmin"));
const VisaManage = safeLazy(() => import("../Pages/admin/ManageVisa"));
const ManageCharges = safeLazy(() => import("../Pages/admin/ManageCharges"));
const AdminProfile = safeLazy(() => import("../Pages/admin/AdminProfile"));

/* ---------- Embassy ---------- */
const EmbassyDashboard = safeLazy(() => import("../Pages/embassy/Dashboard/EmbassyDashboard"));
const EmbassyProfile = safeLazy(() => import("../Pages/embassy/Dashboard/Profile"));
const AddEmbassy = safeLazy(() => import("../Pages/embassy/Dashboard/AddEmbassy"));
const EmbassyApplications = safeLazy(() => import("../Pages/embassy/Dashboard/Applications/Applications"));
const EmbassyApplicationView = safeLazy(() => import("../Pages/embassy/Dashboard/Applications/ApplicationView"));
const VisaPolicyManage = safeLazy(() => import("../Pages/embassy/Dashboard/VisaPolicyManage"));
const EmbassyAnalytics = safeLazy(() => import("../Pages/embassy/Dashboard/EmbassyAnalytics"));
const Review = safeLazy(() => import("../Pages/embassy/status/Review"));
const Rejected = safeLazy(() => import("../Pages/embassy/status/Rejected"));
const Approved = safeLazy(() => import("../Pages/embassy/status/Approved"));
const CountrySetup = safeLazy(() => import("../Pages/embassy/requirement-form/CountrySetup"));
const ContactSetup = safeLazy(() => import("../Pages/embassy/requirement-form/ContactSetup"));

/* ---------- Misc ---------- */
const Error_404 = safeLazy(() => import("../Pages/Error_404"));
const AdminNotifications = safeLazy(() => import("../Pages/admin/AdminNotifications"));
const EmbassyNotifications = safeLazy(() => import("../Pages/embassy/Dashboard/EmbassyNotifications"));

const Routing = () => {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={null}>

            <Routes>

                {/* ================= AUTH (NO LAYOUT) ================= */}
                <Route path="/country/:country_id" element={<CountryDetails />} />
                <Route path="/payment" element={<ProtectedRoute allowedRoles={['user']}><PaymentInterfaceCourse /></ProtectedRoute>} />
                <Route path="/application-form/:country_id" element={<ProtectedRoute allowedRoles={['user']}><VisaApplicationForm /></ProtectedRoute>} />
                <Route path="/payment-preview" element={<ProtectedRoute allowedRoles={['user']}><PaymentPreview /></ProtectedRoute>} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <Suspense fallback={<DashboardSkeleton type="user" />}>
                                <Dashboard />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* Course */}
                <Route path="/course/:course_id" element={<CourseDetails />} />
                <Route path="/cart" element={<Cart />} />

                {/* ================= USER ================= */}
                <Route element={<UserLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutSection />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/country" element={<CountryGrid />} />
                    <Route path="/visaprocess/:country_id" element={<VisaProcess />} />
                    <Route path="/policy/:country_id" element={<VisaPolicies />} />

                    {/* Course */}
                    <Route path="/course" element={<Courselist />} />
                </Route>

                {/* ================= AUTH (NO LAYOUT) ================= */}
                <Route path="/authentication" element={<ProtectedRoute publicOnly={true}><AuthForm /></ProtectedRoute>} />
                <Route path="/reset-password" element={<Suspense fallback={null}><ResetPassword /></Suspense>} />
                <Route path="/verification/:email/:user_type" element={<Suspense fallback={null}><EmailVerification /></Suspense>} />

                {/* ================= ADMIN ================= */}
                <Route path="/admin" element={<ProtectedRoute publicOnly={true}><AdminLoginForm /></ProtectedRoute>} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <Suspense fallback={<DashboardSkeleton type="admin" />}>
                                <AdminLayout />
                            </Suspense>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Suspense fallback={<DashboardSkeleton type="admin" isContentOnly={true} />}><AdminDashboard /></Suspense>} />
                    <Route path="users" element={<Users />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="contact" element={<ContactMessages />} />
                    <Route path="country" element={<CountryManagement />} />
                    <Route path="embassyManage" element={<EmbassyManage />} />
                    <Route path="viewApplications" element={<ViewApplications />} />
                    <Route path="courseManage" element={<CourseManage />} />
                    <Route path="admin" element={<AddAdmin />} />
                    <Route path="visaManage" element={<VisaManage />} />
                    <Route path="adminProfile" element={<AdminProfile />} />
                    <Route path="adminNotification" element={<AdminNotifications />} />
                    <Route path="charges" element={<ManageCharges />} />
                </Route>

                {/* ================= EMBASSY AUTH ================= */}
                <Route path="/embassy" element={<ProtectedRoute publicOnly={true}><EmbassyAuth /></ProtectedRoute>} />
                <Route path="/embassy/auth" element={<Navigate to="/embassy" replace />} />
                <Route path="/embassy/contact-setup/:embassyEmail/:redirectPath" element={<ProtectedRoute allowedRoles={['embassy']}><ContactSetup /></ProtectedRoute>} />
                <Route path="/embassy/country-setup" element={<ProtectedRoute allowedRoles={['embassy']}><CountrySetup /></ProtectedRoute>} />
                <Route path="/embassy/review" element={<ProtectedRoute allowedRoles={['embassy']}><Review /></ProtectedRoute>} />
                <Route path="/embassy/reject" element={<ProtectedRoute allowedRoles={['embassy']}><Rejected /></ProtectedRoute>} />
                <Route path="/embassy/approved" element={<ProtectedRoute allowedRoles={['embassy']}><Suspense fallback={<DashboardSkeleton type="embassy" />}><Approved /></Suspense></ProtectedRoute>} />

                {/* ================= EMBASSY DASHBOARD ================= */}
                <Route
                    path="/embassy/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['embassy']}>
                            <Suspense fallback={<DashboardSkeleton type="embassy" />}>
                                <EmbassyDashboardLayout />
                            </Suspense>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Suspense fallback={<DashboardSkeleton type="embassy" isContentOnly={true} />}><EmbassyDashboard /></Suspense>} />
                    <Route path="profile" element={<EmbassyProfile />} />
                    <Route path="new-embassy" element={<AddEmbassy />} />
                    <Route path="applications" element={<EmbassyApplications />} />
                    <Route path="applications/:application_id" element={<EmbassyApplicationView />} />
                    <Route path="visa-policy-manage" element={<VisaPolicyManage />} />
                    <Route path="analytics" element={<EmbassyAnalytics />} />
                    <Route path="notifications/:countryId" element={<EmbassyNotifications />} />
                </Route>

                {/* ================= FALLBACK ================= */}
                <Route path="*" element={<Error_404 />} />

            </Routes>
            </Suspense>

        </>
    );
};

export default Routing;
