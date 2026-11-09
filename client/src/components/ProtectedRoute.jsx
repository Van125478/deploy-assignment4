import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.admin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!adminOnly && user.admin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
