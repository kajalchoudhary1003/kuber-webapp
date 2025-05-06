import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../slidebar/slidebar"
import { Header } from "../header/header"

// Sample pages
const Dashboard = () => <div className="p-6 text-lg font-medium">Dashboard Page</div>
const Admin = () => <div className="p-6 text-lg font-medium">Admin Page</div>
const Invoice = () => <div className="p-6 text-lg font-medium">Invoice Generator Page</div>
const Payment = () => <div className="p-6 text-lg font-medium">Payment Tracker Page</div>
const Ledger = () => <div className="p-6 text-lg font-medium">Ledger & Reports Page</div>

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
                <Route path="/admin" element={<Admin />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/payment" element={<Payment />} />
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
