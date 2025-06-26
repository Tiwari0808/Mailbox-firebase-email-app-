import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children }) => {
    let isAuthenticated = localStorage.getItem('user_id');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;