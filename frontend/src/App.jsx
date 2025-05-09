import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from './slidebar/slidebar';
import { Header } from './header/header';
import PaymentTracker from './Payments/PaymentsTracker';
import Ledger from './Ledger/Ledger';
import InvoiceGeneratorPage from './InvoiceGenerator/InvoiceGenerator';
import AdminPage from './Admin/AdminPage/page/admin';

// Sample pages
const Dashboard = () => <div className="p-6 text-lg font-medium">Dashboard Page</div>;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <SidebarProvider>
            <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <SidebarInset className="bg-[#E6F2FF] w-full">
              <div className="flex-1 overflow-auto p-6">
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
    </BrowserRouter>
  );
};

export default App;
