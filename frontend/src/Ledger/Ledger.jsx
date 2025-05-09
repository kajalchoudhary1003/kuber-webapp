"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import tab components
import Overview from "./components/overview"
import ClientLedger from "./components/client-ledger"
import ClientProfitability from "./components/client-profitability"

export default function Ledger() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="p-6 min-h-screen max-w-[100vw] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ledger & Reports</h1>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-end mb-6">
          <TabsList>
            <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
            <TabsTrigger value="client-ledger" className="cursor-pointer">Client Ledger</TabsTrigger>
            <TabsTrigger value="client-profitability" className="cursor-pointer">Client Profitability Report</TabsTrigger>
          </TabsList>
        </div>

        <div className="w-full overflow-x-hidden">
          <TabsContent value="overview" className="w-full">
            <Overview />
          </TabsContent>

          <TabsContent value="client-ledger" className="w-full">
            <ClientLedger />
          </TabsContent>

          <TabsContent value="client-profitability" className="w-full">
            <ClientProfitability />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
