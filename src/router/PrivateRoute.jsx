import React from "react";
import { Navigate } from 'react-router-dom';
import { useUser } from "./index.js";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();

  if (!user?.role || !allowedRoles?.includes(user.role)) {
    return <Navigate to="/notfound" replace />;
  }
  return <div>{children}</div>;
};
