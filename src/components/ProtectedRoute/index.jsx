import { useContext } from "react";
import { Navigate } from "react-router";
import { LoginContext } from "../../utils/context";

export default function ProtectedRoute({ children }) {

  const { token } = useContext(LoginContext);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}