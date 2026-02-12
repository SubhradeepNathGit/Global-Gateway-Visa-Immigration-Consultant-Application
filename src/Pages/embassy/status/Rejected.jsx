import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../Redux/Slice/auth/checkAuthSlice";

const Rejected = () => {
  const dispatch = useDispatch(),
    navigate = useNavigate();

  const reApplyAgain = async () => {
    await dispatch(logoutUser({ user_type: 'embassy', showAlert: false }))
    navigate('/embassy/auth/');
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
        {/* LEFT INFO */}
        <div className="hidden md:flex md:w-1/2 bg-black/50 text-white px-10 py-10 flex-col justify-center">
          <h3 className="text-3xl font-bold mb-4">
            Verification Unsuccessful
          </h3>

          <p className="text-base text-white/80 mb-6">
            Unfortunately, your embassy submission could not be approved at this
            time.
          </p>

          <ul className="space-y-3 text-sm text-white/70">
            <li>• Incomplete or incorrect information</li>
            <li>• Verification mismatch</li>
            <li>• Additional documents required</li>
          </ul>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 102 0 1 1 0 00-2 0zm0-8a1 1 0 012 0v5a1 1 0 01-2 0V5z"
                clipRule="evenodd"
              />
            </svg>
            <span>Review required before resubmission</span>
          </div>
        </div>

        {/* RIGHT STATUS */}
        <div
          className="w-full md:w-1/2 px-6 sm:px-10 py-10 text-white
          flex flex-col justify-center items-center text-center gap-6"
        >
          <div className="w-20 h-20 rounded-full border-2 border-red-400/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 012 0v4a1 1 0 01-2 0V5zm0 6a1 1 0 102 0 1 1 0 00-2 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h4 className="text-2xl sm:text-3xl font-bold">
            Submission Rejected
          </h4>

          <p className="text-sm sm:text-base text-white/70 max-w-sm">
            We are sorry to inform you that your application got rejected due to some lack of verification checks.
            Please feel free to re-apply again.
          </p>

          <button onClick={() => reApplyAgain()}
            className="mt-4 px-6 py-3 rounded-md bg-black hover:bg-black/80
            transition font-semibold"
          >
            Re-apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rejected;
