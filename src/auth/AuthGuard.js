import PropTypes from "prop-types";
import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "components/loading-screen";
import Login from "pages/auth/LoginPage";
import { useAuthContext } from "auth/useAuthContext";

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <React.Fragment> {children} </React.Fragment>;
}
