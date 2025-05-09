import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../slidebar/slidebar"
import { Header } from "../header/header"
import PaymentTracker from "../Payments/PaymentsTracker"
import Ledger from "../Ledger/Ledger"
import InvoiceGeneratorPage from "../InvoiceGenerator/InvoiceGenerator"
import AdminPage from "../Admin/AdminPage/page/admin" // Import the actual AdminPage component

// Sample pages
const Dashboard = () => <div className="p-6 text-lg font-medium">Dashboard Page</div>
// Remove the dummy Admin component since we're importing the real one

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
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
  )
}

export default Layout
