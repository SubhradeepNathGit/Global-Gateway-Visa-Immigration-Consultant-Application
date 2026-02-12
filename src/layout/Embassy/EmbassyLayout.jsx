import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkLoggedInUser } from "../../Redux/Slice/auth/checkAuthSlice";
import getSweetAlert from "../../util/alert/sweetAlert";

const EmbassyLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Routes where Navbar & Footer should be hidden
  const hideLayout =
    location.pathname.startsWith("/embassy/auth") ||
    location.pathname.startsWith("/embassy/dashboard");

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then((res) => {
        // console.log('Response for fetching embassy profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">

      {/* Embassy Navbar */}
      {!hideLayout && <Navbar />}

      {/* Page Content */}
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>

      {/* Embassy Footer */}
      {!hideLayout && <Footer />}

    </div>
  );
};

export default EmbassyLayout;
