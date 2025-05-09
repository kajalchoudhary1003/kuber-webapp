import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ClientProfitability() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedYear, setSelectedYear] = useState("2026-2027")
  const [showReport, setShowReport] = useState(false)

  const handleShowReport = () => {
    if (selectedClient) {
      setShowReport(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-md">
        <CardContent className="pt-6 pb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Profitability Report</h2>

            <div className="flex items-center gap-4">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="cursor-pointer w-[180px]">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent className="bg-white" >
                  <SelectItem value="bev">BirdsEyeView</SelectItem>
                  <SelectItem value="acme">Acme Corp</SelectItem>
                  <SelectItem value="globex">Globex Industries</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className=" cursor-pointer w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                  <SelectItem value="2027-2028">2027-2028</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="bg-blue-500 hover:bg-blue-500/90 text-white cursor-pointer rounded-full"
                disabled={!selectedClient}
                onClick={handleShowReport}
              >
                Show Profitability Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showReport && (
        <Card>
          <CardContent className="pt-6">
            {/* Report content would go here */}
            <div className="h-80 flex items-center justify-center">
              Profitability report for {selectedClient} - {selectedYear}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
