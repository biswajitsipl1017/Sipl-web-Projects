// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to home (or login page)
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the children (the protected route)
  return children;
};

export default PrivateRoute;
