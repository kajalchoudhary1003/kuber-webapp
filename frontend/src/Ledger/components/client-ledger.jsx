import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DatePicker, ConfigProvider } from "antd"
import axios from "axios"
import dayjs from "dayjs"

// Destructure RangePicker from DatePicker
const { RangePicker } = DatePicker

export default function ClientLedger() {
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [showLedger, setShowLedger] = useState(false)
  const [dateRange, setDateRange] = useState(null)
  const [ledgerEntries, setLedgerEntries] = useState([])
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Custom theme for Ant Design components
  const antTheme = {
    token: {
      colorBorder: '#000000',           // Black border color
      colorPrimary: '#1677ff',          // Keep primary color as default blue
      borderRadius: 4,                  // Match your UI border radius
      colorBgContainer: '#ffffff',      // White background
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.45)', // Default placeholder color
    },
    components: {
      DatePicker: {
        activeBorderColor: '#000000',   // Black border when active
        hoverBorderColor: '#000000',    // Black border on hover
      }
    }
  }

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

  // Handle date range change from Ant Design RangePicker
  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates) {
      setDateRange(dates)
    } else {
      setDateRange(null)
    }
  }

  const handleShowLedger = async () => {
    if (selectedClient && 
        (selectedPeriod !== "custom" || (dateRange && dateRange.length === 2))) {
      try {
        setLoading(true)
        
        // Calculate date range based on selected period
        let startDateStr = ''
        let endDateStr = dayjs().format('YYYY-MM-DD') // Current date
        
        if (selectedPeriod === "custom" && dateRange) {
          startDateStr = dateRange[0].format('YYYY-MM-DD')
          endDateStr = dateRange[1].format('YYYY-MM-DD')
        } else {
          switch (selectedPeriod) {
            case "1month":
              startDateStr = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
              break
            case "3months":
              startDateStr = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
              break
            case "6months":
              startDateStr = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
              break
            case "1year":
              startDateStr = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
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
    if (selectedPeriod === "custom" && (!dateRange || dateRange.length !== 2)) return true;
    return false;
  }

  const handleDownload = async () => {
    try {
      if (!selectedClient) return;
      
      let startDateStr = ''
      let endDateStr = dayjs().format('YYYY-MM-DD')
      
      if (selectedPeriod === "custom" && dateRange) {
        startDateStr = dateRange[0].format('YYYY-MM-DD')
        endDateStr = dateRange[1].format('YYYY-MM-DD')
      } else {
        switch (selectedPeriod) {
          case "1month":
            startDateStr = dayjs().subtract(1, 'month').format('YYYY-MM-DD')
            break
          case "3months":
            startDateStr = dayjs().subtract(3, 'month').format('YYYY-MM-DD')
            break
          case "6months":
            startDateStr = dayjs().subtract(6, 'month').format('YYYY-MM-DD')
            break
          case "1year":
            startDateStr = dayjs().subtract(1, 'year').format('YYYY-MM-DD')
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

  // Format date for display - with error handling
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      return dayjs(date).format('DD/MM/YYYY');
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
                  {/* Ant Design RangePicker with custom styling */}
                  <ConfigProvider theme={antTheme}>
                    <RangePicker 
                      onChange={handleDateRangeChange}
                      style={{ 
                        width: '360px', 
                        height: '40px',
                        borderColor: '#000000' // Inline style for border color
                      }}
                      format="DD/MM/YYYY"
                    />
                  </ConfigProvider>
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
