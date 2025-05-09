import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Dummy data for ledger entries
const ledgerEntries = [
  {
    date: "03/04/2025",
    particulars: "Payment Received",
    invoiceRaised: "-",
    paymentReceived: 100,
    balancePayment: -100,
  },
  {
    date: "02/05/2025",
    particulars: "Invoice Raised",
    invoiceRaised: 600,
    paymentReceived: "-",
    balancePayment: 500,
  },
  {
    date: "02/05/2025",
    particulars: "Invoice Raised",
    invoiceRaised: 600,
    paymentReceived: "-",
    balancePayment: 1100,
  },
  {
    date: "05/05/2025",
    particulars: "Payment Received",
    invoiceRaised: "-",
    paymentReceived: 20,
    balancePayment: 1080,
  },
]

export default function ClientLedger() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [showLedger, setShowLedger] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const handleShowLedger = () => {
    if (selectedClient && 
        (selectedPeriod !== "custom" || (startDate && endDate))) {
      setShowLedger(true)
    }
  }

  const isButtonDisabled = () => {
    if (!selectedClient) return true;
    if (selectedPeriod === "custom" && (!startDate || !endDate)) return true;
    return false;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Client Ledger</h2>

            <div className="flex items-center gap-4">
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem className="cursor-pointer" value="bev">BirdsEyeView (BEV)</SelectItem>
                  <SelectItem className="cursor-pointer" value="acme">Acme Corp</SelectItem>
                  <SelectItem className="cursor-pointer" value="globex">Globex Industries</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className=" cursor-pointer w-[180px]">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="1month">Last 1 month</SelectItem>
                  <SelectItem value="3months">Last 3 months</SelectItem>
                  <SelectItem value="6months">Last 6 months</SelectItem>
                  <SelectItem value="1year">Last 1 year</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>

              {selectedPeriod === "custom" && (
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start cursor-pointer text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2  h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto bg-white p-0">
                      <Calendar
                      className="cursor-pointer"
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "End date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => 
                          startDate ? date < startDate : false
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <Button 
                className="bg-blue-500 cursor-pointer hover:bg-blue-500/90 text-white rounded-full" 
                disabled={isButtonDisabled()}
                onClick={handleShowLedger}
              >
                Show Ledger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showLedger && (
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Ledger</h3>
              <div className="flex items-center gap-2">
                <span className="font-medium">Balance: $1080</span>
                <Button variant="outline" size="sm">
                  DOWNLOAD
                </Button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden m-4">
              <Table>
                <TableHeader className="bg-slate-200">
                  <TableRow>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Particulars</TableHead>
                    <TableHead className="text-center">Invoice Raised</TableHead>
                    <TableHead className="text-center">Payment Received</TableHead>
                    <TableHead className="text-center">Balance Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry, index) => (
                    <TableRow key={index} className="border-b border-slate-200">
                      <TableCell className="text-center">{entry.date}</TableCell>
                      <TableCell className="text-center">{entry.particulars}</TableCell>
                      <TableCell className="text-center">{entry.invoiceRaised}</TableCell>
                      <TableCell className="text-center">{entry.paymentReceived}</TableCell>
                      <TableCell className="text-center">{entry.balancePayment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
