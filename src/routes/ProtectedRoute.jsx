import { Navigate, useLocation } from "react-router-dom";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingSpinner label="Checking session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />;
  }

  return children;
}