import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { storeContext } from '../../context/StoreContext';

const ProtectedRoute = () => {
  const { token, authLoading } = useContext(storeContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Khi đã hết loading, kiểm tra token
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;