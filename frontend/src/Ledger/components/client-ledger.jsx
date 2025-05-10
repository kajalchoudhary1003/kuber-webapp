import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axios from "axios"

export default function ClientLedger() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [showLedger, setShowLedger] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5001/api/clients')
        setClients(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching clients:', err)
        setError('Failed to load clients')
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Replace the handleShowLedger function with this:
const handleShowLedger = async () => {
  if (selectedClient && 
      (selectedPeriod !== "custom" || (startDate && endDate))) {
    try {
      setLoading(true)
      
      // Calculate date range based on selected period
      let startDateStr = ''
      let endDateStr = new Date().toISOString().split('T')[0] // Current date
      
      if (selectedPeriod === "custom" && startDate && endDate) {
        startDateStr = format(startDate, 'yyyy-MM-dd')
        endDateStr = format(endDate, 'yyyy-MM-dd')
      } else {
        switch (selectedPeriod) {
          case "1month":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')
            break
          case "3months":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'yyyy-MM-dd')
            break
          case "6months":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 6)), 'yyyy-MM-dd')
            break
          case "1year":
            startDateStr = format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd')
            break
          default:
            break
        }
      }
      
      // Fetch ledger data from backend - using POST as required by your API
      const response = await axios.post('http://localhost:5001/api/ledger/by-client-date-range', {
        clientId: selectedClient,
        startDate: startDateStr,
        endDate: endDateStr
      })
      
      setLedgerEntries(response.data.entries)
      setBalance(response.data.balance)
      setShowLedger(true)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching ledger data:', err)
      setError('Failed to load ledger data')
      setLoading(false)
    }
  }
}


  const isButtonDisabled = () => {
    if (!selectedClient) return true;
    if (selectedPeriod === "custom" && (!startDate || !endDate)) return true;
    return false;
  }

  const handleDownload = async () => {
    try {
      if (!selectedClient) return;
      
      let startDateStr = ''
      let endDateStr = new Date().toISOString().split('T')[0]
      
      if (selectedPeriod === "custom" && startDate && endDate) {
        startDateStr = format(startDate, 'yyyy-MM-dd')
        endDateStr = format(endDate, 'yyyy-MM-dd')
      } else {
        switch (selectedPeriod) {
          case "1month":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'yyyy-MM-dd')
            break
          case "3months":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 3)), 'yyyy-MM-dd')
            break
          case "6months":
            startDateStr = format(new Date(new Date().setMonth(new Date().getMonth() - 6)), 'yyyy-MM-dd')
            break
          case "1year":
            startDateStr = format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), 'yyyy-MM-dd')
            break
          default:
            break
        }
      }
      
      // Request the PDF download
      const response = await axios.get(`http://localhost:5001/api/ledger/client/${selectedClient}/download`, {
        params: {
          startDate: startDateStr,
          endDate: endDateStr
        },
        responseType: 'blob'
      })
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `client_ledger_${selectedClient}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      console.error('Error downloading ledger:', err)
      setError('Failed to download ledger')
    }
  }

  // Format date for display
  // Format date for display - with error handling
const formatDate = (dateString) => {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return format(date, 'dd/MM/yyyy');
  } catch (err) {
    console.error('Error formatting date:', dateString, err);
    return '-';
  }
}


  // Format number with commas
  const formatNumberWithCommas = (number) => {
    if (number == null) return '-'
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                  {clients.map(client => (
                    <SelectItem 
                      key={client.id} 
                      className="cursor-pointer" 
                      value={client.id.toString()}
                    >
                      {client.ClientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="cursor-pointer w-[180px]">
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
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                disabled={isButtonDisabled() || loading}
                onClick={handleShowLedger}
              >
                {loading ? "Loading..." : "Show Ledger"}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 mt-2">{error}</div>
          )}
        </CardContent>
      </Card>

      {showLedger && (
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Ledger</h3>
              <div className="flex items-center gap-2">
                <span className="font-medium">Balance: {formatNumberWithCommas(balance)}</span>
                <Button variant="outline" size="sm" onClick={handleDownload}>
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
  {ledgerEntries.length > 0 ? (
    ledgerEntries.map((entry, index) => (
      <TableRow key={index} className="border-b border-slate-200">
        <TableCell className="text-center">{formatDate(entry.Date || entry.date)}</TableCell>
        <TableCell className="text-center">{entry.type === 'Invoice' || entry.type === 'invoice' ? 'Invoice Raised' : 'Payment Received'}</TableCell>
        <TableCell className="text-center">
          {(entry.type === 'Invoice' || entry.type === 'invoice') 
            ? formatNumberWithCommas(entry.InvoiceRaised || entry.amount) 
            : '-'}
        </TableCell>
        <TableCell className="text-center">
          {(entry.type === 'Payment' || entry.type === 'payment') 
            ? formatNumberWithCommas(Math.abs(entry.PaymentReceived || entry.amount)) 
            : '-'}
        </TableCell>
        <TableCell className="text-center">{formatNumberWithCommas(entry.BalancePayment || entry.balance)}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-4">No ledger entries found for the selected period</TableCell>
    </TableRow>
  )}
</TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
