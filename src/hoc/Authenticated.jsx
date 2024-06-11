import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 *
 * @param {{children: any }} props
 * @returns
 */
export default function Authenticated({ children }) {
  const { user, userData } = useContext(AppContext);
  const location = useLocation();

  if (!user) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }

  if (userData?.isBlocked) {
    return <Navigate to="/blocked" />;
  }

  return <>{children}</>;
}

Authenticated.propTypes = {
  children: PropTypes.any.isRequired,
};
