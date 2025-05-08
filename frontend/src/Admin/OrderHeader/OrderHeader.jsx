import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';

const OrderHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    if (location.pathname.includes('/admin/employee-master')) return 'employee-master';
    if (location.pathname.includes('/admin/employee-cost')) return 'employee-cost';
    if (location.pathname.includes('/admin/client-master')) return 'client-master';
    if (location.pathname.includes('/admin/billing-setup')) return 'billing-setup';
    if (location.pathname.includes('/admin/other-settings')) return 'other-settings';
    return 'employee-master';
  };

  const handleTabChange = (value) => {
    navigate(`/admin/${value}`);
  };

  return (
    <header className="  px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-normal text-black">Admin</h1>
      <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
        <TabsList className="gap-4">
          <TabsTrigger value="employee-master">Employee Master</TabsTrigger>
          <TabsTrigger value="employee-cost">Employee Cost</TabsTrigger>
          <TabsTrigger value="client-master">Client Master</TabsTrigger>
          <TabsTrigger value="billing-setup">Billing Setup</TabsTrigger>
          <TabsTrigger value="other-settings">Other Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
};

export default OrderHeader;
