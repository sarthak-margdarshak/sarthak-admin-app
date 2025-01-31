import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { PATH_DASHBOARD } from "routes/paths";
import LoadingScreen from "components/loading-screen";
import { useAuthContext } from "auth/useAuthContext";
import React from "react";

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <React.Fragment> {children} </React.Fragment>;
}
