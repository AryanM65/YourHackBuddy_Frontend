import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="text-center py-10 text-lg">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="text-center py-10 text-red-500 text-lg font-semibold">
        ❌ Unauthorized Access: You do not have permission to view this page.
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute;
