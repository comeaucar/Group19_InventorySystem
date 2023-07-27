import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./AuthContext";

const ProtectedScreen = ({ Component }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  return currentUser ? (
    <Component />
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

export default ProtectedScreen;
