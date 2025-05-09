import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from './slidebar/slidebar';
import { Header } from './header/header';
import PaymentTracker from './Payments/PaymentsTracker';
import Ledger from './Ledger/Ledger';
import InvoiceGeneratorPage from './InvoiceGenerator/InvoiceGenerator';
import AdminPage from './Admin/AdminPage/page/admin';

// Sample pages
const Dashboard = () => <div className="p-6 text-lg font-medium">Dashboard Page</div>;

// Wrapper component to handle navigation effects
const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Force re-render on location change
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    // Update key to force re-render when location changes
    setKey(prev => prev + 1);
  }, [location.pathname]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <SidebarProvider>
          <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <SidebarInset className="bg-[#E6F2FF] w-full">
            <div className="flex-1 overflow-auto p-6" key={key}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/invoice" element={<InvoiceGeneratorPage />} />
                <Route path="/payment" element={<PaymentTracker />} />
                <Route path="/ledger" element={<Ledger />} />
              </Routes>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
