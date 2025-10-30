import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout = () => {
  return <Outlet />; // Chỉ render component con, không có Navbar hay Footer
};

export default BlankLayout;