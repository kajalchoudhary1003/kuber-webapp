import React from 'react';
import { useLocation, Outlet, Routes, Route, Navigate } from 'react-router-dom';
import OrderHeader from '../../OrderHeader/OrderHeader';
import EmployeeMaster from '../components/EmployeeMaster';
import EmployeeCost from '../components/EmployeeCost';
import ClientMaster from '../components/ClientMaster';
import BillingSetup from '../components/BillingSetup';
import OtherSettings from '../components/OtherSettings';



export const AdminPage = () => {
  const location = useLocation();
  const isOtherSettings = location.pathname.includes('other-settings');

  return (
    <div className="p-4">
      <OrderHeader />
      <div className={!isOtherSettings ? 'mx-auto p-7' : ''}>
        <Routes>
          <Route path="/" element={<Navigate to="employee-master" replace />} />
          <Route path="employee-master" element={<EmployeeMaster />} />
          <Route path="employee-cost" element={<EmployeeCost />} />
          <Route path="client-master" element={<ClientMaster />} />
          <Route path="billing-setup" element={<BillingSetup />} />
          <Route path="other-settings" element={<OtherSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;
