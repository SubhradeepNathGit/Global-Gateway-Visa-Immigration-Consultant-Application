import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

/* ---------- Layouts ---------- */
import UserLayout from "../layout/user";
import AdminLayout from "../layout/admin/AdminLayout";
import EmbassyLayout from "../layout/Embassy/EmbassyLayout";
import EmbassyDashboardLayout from "../layout/Embassy/EmbassyDashboard/EmbassyDashboardLayout";

/* ---------- Utils ---------- */
import ScrollToTop from "../Components/ScrollToTop";

/* ---------- User Pages ---------- */
const Home = lazy(() => import("../Pages/user/home/Home"));
const AboutSection = lazy(() => import("../Pages/user/about/AboutPage"));
const CountryGrid = lazy(() => import("../Pages/user/countries/Country"));
const CountryDetails = lazy(() => import("../Pages/user/countries/country-details/CountryDetails"));
const ContactUs = lazy(() => import("../Pages/user/get-in-touch/ContactUs"));
const Dashboard = lazy(() => import("../Pages/user/dashboard/Dashboard"));
const VisaProcess = lazy(() => import("../Pages/user/apply-visa/process/VisaProcess"));
const VisaPolicies = lazy(() => import("../Pages/user/apply-visa/policy/VisaPolicy"));
const VisaApplicationForm = lazy(() => import("../Pages/user/apply-visa/application-form/VisaApplicationForm"));
const PaymentPreview = lazy(() => import("../Pages/user/payment/PaymentPreview"));
const PaymentStatus = lazy(() => import("../Pages/user/payment/status/PaymentStatus"));
const Courselist = lazy(() => import("../Pages/user/course/Courselist"));
const CourseDetails = lazy(() => import("../Pages/user/course/course-details/CourseDetails"));
const PaymentInterfaceCourse = lazy(() => import("../Pages/user/cart/payment/PaymentInterfaceCourse"));
const Cart = lazy(() => import("../Pages/user/cart/Cart"));

/* ---------- Auth ---------- */
const AuthForm = lazy(() => import("../Pages/user/auth/Authentication"));
const EmailVerification = lazy(() => import("../Pages/verification/EmailVerificationPage"));

/* ---------- Admin Pages ---------- */
const AdminLoginForm = lazy(() => import("../Pages/admin/auth/AdminLoginForm"));
const AdminDashboard = lazy(() => import("../Pages/admin/AdminDashboard"));
const Users = lazy(() => import("../Pages/admin/Users"));
const Payments = lazy(() => import("../Pages/admin/Payments"));
const Settings = lazy(() => import("../Pages/admin/Settings"));
const Analytics = lazy(() => import("../Pages/admin/Analytics"));
const ContactMessages = lazy(() => import("../Pages/admin/UserContact"));
const CountryManagement = lazy(() => import("../Pages/admin/ManageCountry"));
const EmbassyManage = lazy(() => import("../Pages/admin/ManageEmbassy"));
const ViewApplications = lazy(() => import("../Pages/admin/ViewApplications"));
const CourseManage = lazy(() => import("../Pages/admin/CourseManage"));
const AddAdmin = lazy(() => import("../Pages/admin/ManageAdmin"));
const VisaManage = lazy(() => import("../Pages/admin/ManageVisa"));
const ManageCharges = lazy(() => import("../Pages/admin/ManageCharges"));
const AdminProfile = lazy(() => import("../Pages/admin/AdminProfile"));

/* ---------- Embassy ---------- */
const EmbassyHome = lazy(() => import("../Pages/embassy/Home"));
const EmbassyAbout = lazy(() => import("../Pages/embassy/About"));
const EmbassyContact = lazy(() => import("../Pages/embassy/Contact"));
const EmbassyAuth = lazy(() => import("../Pages/embassy/auth/Auth"));
const EmbassyDashboard = lazy(() => import("../Pages/embassy/Dashboard/EmbassyDashboard"));
const EmbassyProfile = lazy(() => import("../Pages/embassy/Dashboard/Profile"));
const AddEmbassy = lazy(() => import("../Pages/embassy/dashboard/AddEmbassy"));
const EmbassyApplications = lazy(() => import("../Pages/embassy/Dashboard/Applications/Applications"));
const EmbassyApplicationView = lazy(() => import("../Pages/embassy/Dashboard/Applications/ApplicationView"));
const VisaPolicyManage = lazy(() => import("../Pages/embassy/dashboard/VisaPolicyManage"));
const EmbassyAnalytics = lazy(() => import("../Pages/embassy/Dashboard/EmbassyAnalytics"));
const Review = lazy(() => import("../Pages/embassy/status/Review"));
const Rejected = lazy(() => import("../Pages/embassy/status/Rejected"));
const Approved = lazy(() => import("../Pages/embassy/status/Approved"));
const CountrySetup = lazy(() => import("../Pages/embassy/requirement-form/CountrySetup"));
const ContactSetup = lazy(() => import("../Pages/embassy/requirement-form/ContactSetup"));

/* ---------- Misc ---------- */
const Error_404 = lazy(() => import("../Pages/Error_404"));
const AdminNotifications = lazy(() => import("../Pages/admin/AdminNotifications"));
const EmbassyNotifications = lazy(() => import("../Pages/embassy/dashboard/EmbassyNotifications"));

const Routing = () => {
  return (
    <>
      <ScrollToTop />


      <Routes>

        {/* ================= AUTH (NO LAYOUT) ================= */}
        <Route path="/country/:country_id" element={<CountryDetails />} />
        <Route path="/payment" element={<PaymentInterfaceCourse />} />
        <Route path="/application-form/:country_id" element={<VisaApplicationForm />} />
        <Route path="/payment-preview" element={<PaymentPreview />} />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/dashboard" element={<Dashboard />} />

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
        <Route path="/authentication" element={<AuthForm />} />
        <Route path="/verification/:email/:user_type" element={<EmailVerification />} />

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminLoginForm />} />
        <Route path="/admin/dashboard" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
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

        {/* ================= EMBASSY PUBLIC ================= */}
        <Route path="/embassy" element={<EmbassyLayout />}>
          <Route index element={<EmbassyHome />} />
          <Route path="about" element={<EmbassyAbout />} />
          <Route path="contact" element={<EmbassyContact />} />
        </Route>

        {/* ================= EMBASSY AUTH ================= */}
        <Route path="/embassy/auth" element={<EmbassyAuth />} />
        <Route path="/embassy/contact-setup/:embassyEmail/:redirectPath" element={<ContactSetup />} />
        <Route path="/embassy/country-setup" element={<CountrySetup />} />
        <Route path="/embassy/review" element={<Review />} />
        <Route path="/embassy/reject" element={<Rejected />} />
        <Route path="/embassy/approved" element={<Approved />} />

        {/* ================= EMBASSY DASHBOARD ================= */}
        <Route path="/embassy/dashboard" element={<EmbassyDashboardLayout />}>
          <Route index element={<EmbassyDashboard />} />
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

    </>
  );
};

export default Routing;
