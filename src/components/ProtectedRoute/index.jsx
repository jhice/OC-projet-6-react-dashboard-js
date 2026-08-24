import { Navigate } from "react-router";

export default function ProtectedRoute({ children, token }) {
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}