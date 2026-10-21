import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles is optional: <ProtectedRoute roles={["admin"]} /> lets only admins in
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="center-screen">
        <div className="spinner" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
