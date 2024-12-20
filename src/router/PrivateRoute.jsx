import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "./index.js";

export const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user?.role || !allowedRoles?.includes(user.role))) {
      navigate('/notfound', { replace: true });
    }
  }, [user, loading, allowedRoles, navigate]);

  return <div>{children}</div>;
};
