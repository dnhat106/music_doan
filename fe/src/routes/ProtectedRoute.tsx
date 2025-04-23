import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useUserInfo } from "../hook/auth/useUserInfo";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { data: user } = useUserInfo();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;
