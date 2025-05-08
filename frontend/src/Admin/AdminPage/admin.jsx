import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import OrderHeader from '../OrderHeader/OrderHeader';

export const AdminPage = () => {
  const location = useLocation();
  const isOtherSettings = location.pathname.includes('other-settings');

  return (
    <div className="p-4">
      <OrderHeader />
      <div className={!isOtherSettings ? 'mx-auto p-7' : ''}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
