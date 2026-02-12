import { Navigate } from "react-router-dom";
import { embassyStatus } from "../utils/embassyStatus";

const ApprovalGuard = ({ children }) => {
  const { isAuthenticated, hasCountrySetup, approvalStatus } = embassyStatus;

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Logged in but country not setup
  if (!hasCountrySetup) {
    return <Navigate to="/country-setup" replace />;
  }

  // Approval states
  if (approvalStatus === "pending") {
    return <Navigate to="/review" replace />;
  }

  if (approvalStatus === "rejected") {
    return <Navigate to="/rejected" replace />;
  }

  // Approved → allow access
  return children;
};

export default ApprovalGuard;
