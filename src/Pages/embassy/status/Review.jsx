import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../Redux/Slice/auth/checkAuthSlice";

/* ---------- SOFT LOADER ---------- */
const PulseLoader = () => (
  <div className="relative w-20 h-20">
    <span className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
    <span className="absolute inset-2 rounded-full border-2 border-white/60" />
  </div>
);

/* ---------- REVIEW / PENDING ---------- */
const Review = () => {

    const dispatch = useDispatch(),
      navigate = useNavigate();
  
    const setLogout = async () => {
      await dispatch(logoutUser({ user_type: 'embassy', showAlert: false }))
      navigate('/embassy/');
    }

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4 py-8"
      style={{
        backgroundImage: `url(/Slider1.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-4xl flex flex-col md:flex-row rounded-xl overflow-hidden
        shadow-2xl bg-black/20 backdrop-blur-xl"
      >
        {/* LEFT INFO PANEL */}
        <div className="hidden md:flex md:w-1/2 bg-black/50 text-white px-10 py-10 flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4">
            Verification in Progress
          </h3>

          <p className="text-base text-white/80 mb-6">
            Your embassy details have been successfully submitted and are now
            under administrative review.
          </p>

          <ul className="space-y-3 text-sm text-white/70">
            <li>• Country details verification</li>
            <li>• Embassy authenticity check</li>
            <li>• Compliance & approval</li>
          </ul>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your data is securely protected</span>
          </div>
        </div>

        {/* RIGHT STATUS PANEL */}
        <div
          className="w-full md:w-1/2 px-6 sm:px-10 py-10 text-white
          flex flex-col justify-center items-center text-center gap-6"
        >
          <PulseLoader />

          <h4 className="text-2xl sm:text-3xl font-bold mt-4">
            Pending Approval
          </h4>

          <p className="text-sm sm:text-base text-white/70 max-w-sm">
            Our team is currently reviewing your submission.  
            This usually takes <span className="font-semibold">24–48 hours</span>.
          </p>

          <div className="mt-6 w-full max-w-xs border border-white/20 rounded-lg px-4 py-3 bg-black/30">
            <p className="text-xs text-white/60">
              You’ll be informed once your embassy is approved
              or if additional information is required.
            </p>
          </div>

          <p className="text-xs text-white/50 mt-3">
            Thank you for your patience.
          </p>
          
          <button onClick={() => setLogout()}
            className="mt-4 px-6 py-3 rounded-md bg-black hover:bg-black/80
            transition font-semibold cursor-pointer"
          >
            Go To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
