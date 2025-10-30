import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { storeContext } from '../../context/StoreContext';

const ProtectedRoute = () => {
  const { token, authLoading } = useContext(storeContext);

  if (authLoading) {
    // Bạn có thể hiển thị một component loading spinner ở đây
    return <div>Loading...</div>;
  }

  // Khi đã hết loading, kiểm tra token
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;