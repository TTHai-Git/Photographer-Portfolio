import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) return null; // ⏳ Đang fetch user → chờ, đừng redirect sớm

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/error-401" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
