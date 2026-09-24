import React from "react";
import FullScreenLoader from "../pages/Loading";
import { useStore } from "../zustand/store";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);

  if (isLoading) return <FullScreenLoader />;
  if (!user && !isLoading) return <Navigate to='/login' replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role || 'user';
    const isSuper = userRole === 'super_admin';
    const hasRole = allowedRoles.includes(userRole) || (isSuper && allowedRoles.includes('admin'));

    if (!hasRole) {
      if (userRole === 'admin' || userRole === 'super_admin') return <Navigate to='/admin' replace />;
      if (userRole === 'seller') return <Navigate to='/seller/dashboard' replace />;
      return <Navigate to='/user/dashboard' replace />;
    }
  }

  return children;
};

export const RoleRedirect = () => {
  const user = useStore((state) => state.user);
  const isLoading = useStore((state) => state.isLoading);

  if (isLoading) return <FullScreenLoader />;
  if (!user && !isLoading) return <Navigate to='/login' replace />;

  if (user.role === 'admin' || user.role === 'super_admin') {
    return <Navigate to='/admin' replace />;
  } else if (user.role === 'seller') {
    return <Navigate to='/seller/dashboard' replace />;
  } else {
    return <Navigate to='/user/dashboard' replace />;
  }
};