import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkLoggedInUser } from "../../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { updateLastSignInAt } from "../../../Redux/Slice/userSlice";
import { Link } from "react-router-dom";

const Approved = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then((res) => {
        console.log('Response for fetching embassy profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  useEffect(() => {

    // Update last_sign_in_at ONCE
    if (userAuthData?.id) {
      dispatch(
        updateLastSignInAt({
          id: userAuthData.id,
          user_type: "embassy",
        })
      );
    }

    // Redirect after 3.5 seconds
    // const timer = setTimeout(() => {
    //   navigate("/embassy/dashboard", { replace: true });
    // }, 3500);

    // return () => clearTimeout(timer);
  }, [dispatch, navigate, userAuthData?.id]);

  // console.log('User data', userAuthData);

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
            Embassy Approved
          </h3>

          <p className="text-base text-white/80 mb-6">
            Congratulations! Your embassy has been successfully verified and
            approved by the administration.
          </p>

          <ul className="space-y-3 text-sm text-white/70">
            <li>• Country listing activated</li>
            <li>• Visa processing enabled</li>
            <li>• Appointment management unlocked</li>
          </ul>

          <div className="mt-8 flex items-center gap-2 text-sm text-white/60">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.778 7.778a1 1 0 01-1.414 0L3.293 9.707a1 1 0 011.414-1.414l3.111 3.111 7.071-7.071a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Approval completed successfully</span>
          </div>
        </div>

        {/* RIGHT STATUS */}
        <div
          className="w-full md:w-1/2 px-6 sm:px-10 py-10 text-white
          flex flex-col justify-center items-center text-center gap-6"
        >
          <div className="w-20 h-20 rounded-full border-2 border-green-400/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.778 7.778a1 1 0 01-1.414 0L3.293 9.707a1 1 0 011.414-1.414l3.111 3.111 7.071-7.071a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h4 className="text-2xl sm:text-3xl font-bold">
            Approval Successful
          </h4>

          <p className="text-sm sm:text-base text-white/70 max-w-sm">
            You can now access your embassy dashboard and start managing visa
            applications and appointments.
          </p>

          <Link to='/embassy/dashboard'
            className="mt-4 px-6 py-3 rounded-md bg-black hover:bg-black/80
            transition font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Approved;
