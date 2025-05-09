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
    return 'employee-master'; // Default tab
  };

  const handleTabChange = (value) => {
    // Check if we're navigating from other-settings
    if (location.pathname.includes('/admin/other-settings') && value !== 'other-settings') {
      // Force a hard navigation
      window.location.href = `/admin/${value}`;
    } else {
      // Normal navigation for other cases
      navigate(`/admin/${value}`);
    }
  };

  // Get the current active tab
  const activeTab = getActiveTab();

  return (
    <header className="px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-normal text-black">Admin</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="gap-4">
          <TabsTrigger 
            value="employee-master" 
            className={`cursor-pointer ${activeTab === 'employee-master' ? 'shadow-lg text-blue-500' : ''}`}
          >
            Employee Master
          </TabsTrigger>
          <TabsTrigger 
            value="employee-cost" 
            className={`cursor-pointer ${activeTab === 'employee-cost' ? 'shadow-lg text-blue-500' : ''}`}
          >
            Employee Cost
          </TabsTrigger>
          <TabsTrigger 
            value="client-master" 
            className={`cursor-pointer ${activeTab === 'client-master' ? 'shadow-lg text-blue-500' : ''}`}
          >
            Client Master
          </TabsTrigger>
          <TabsTrigger 
            value="billing-setup" 
            className={`cursor-pointer ${activeTab === 'billing-setup' ? 'shadow-lg text-blue-500' : ''}`}
          >
            Billing Setup
          </TabsTrigger>
          <TabsTrigger 
            value="other-settings" 
            className={`cursor-pointer ${activeTab === 'other-settings' ? 'shadow-lg text-blue-500' : ''}`}
          >
            Other Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
};

export default OrderHeader;
