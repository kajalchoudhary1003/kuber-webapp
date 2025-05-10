"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Dummy data for payments
const clientPayments = {
  1: [
    { id: 1, date: "05/05/2025", amount: "£20", remark: "hello" },
    { id: 2, date: "03/04/2025", amount: "£100", remark: "hi" },
  ],
  2: [
    { id: 3, date: "12/03/2025", amount: "£500", remark: "Monthly retainer" },
    { id: 4, date: "15/02/2025", amount: "£750", remark: "Project milestone" },
  ],
  3: [
    { id: 5, date: "22/04/2025", amount: "£1,200", remark: "Consulting fee" },
    { id: 6, date: "18/03/2025", amount: "£950", remark: "Service payment" },
  ],
  4: [
    { id: 7, date: "10/05/2025", amount: "£3,000", remark: "Product development" },
    { id: 8, date: "05/04/2025", amount: "£2,500", remark: "Research grant" },
  ],
}

export default function PaymentTracker() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [date, setDate] = useState()
  const [amount, setAmount] = useState("")
  const [remark, setRemark] = useState("")
  const [reconciliationNote, setReconciliationNote] = useState("")
  const currentDate = new Date()

  // Fetch clients when component mounts
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:5001/api/clients')
        setClients(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch clients")
        console.error("Error fetching clients:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const handleRecordPayment = () => {
    // This would normally send data to a backend
    alert(`Payment recorded for ${selectedClient}: ${amount} on ${date?.toLocaleDateString()}`)
    // Reset form
    setDate(undefined)
    setAmount("")
    setRemark("")
  }

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Payment Tracker</h1>

      <Card className="mb-6 bg-white border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Track the Payment</CardTitle>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Last Updated on: {format(currentDate, "dd/MM/yyyy")}
              </span>
              {loading ? (
                <div>Loading clients...</div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <Select onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-[180px] cursor-pointer">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectGroup>
                      <SelectItem value="default" disabled>Select Client</SelectItem>
                      {clients.map((client) => (
                        <SelectItem 
                          className="cursor-pointer" 
                          key={client.id} 
                          value={client.id.toString()}
                        >
                          {client.ClientName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6 bg-white border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Label htmlFor="reconciliation" className="text-lg font-semibold whitespace-nowrap">
              Reconciliation Note
            </Label>
            <Textarea
              id="reconciliation"
              placeholder="Reconciliation Note"
              value={reconciliationNote}
              onChange={(e) => setReconciliationNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-white border-0 shadow-md">
        <CardHeader>
          <CardTitle>Record New Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="space-y-2">
              <Label htmlFor="date">Received Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : "dd/mm/yyyy"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input id="remark" placeholder="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>

            <Button className="bg-blue-500 hover:bg-blue-500/90 text-white rounded-full h-10 cursor-pointer" onClick={handleRecordPayment}>
              Record Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedClient && (
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="px-4">
            <div className="overflow-hidden rounded-md border border-slate-400">
              <Table>
                <TableHeader className="bg-slate-200">
                  <TableRow>
                    <TableHead className="w-[200px] text-center">Date</TableHead>
                    <TableHead className="w-[200px] text-center">Amount</TableHead>
                    <TableHead className="text-center">Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClient &&
                    clientPayments[Number.parseInt(selectedClient)]?.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-center">{payment.date}</TableCell>
                        <TableCell className="text-center">{payment.amount}</TableCell>
                        <TableCell className="text-center">{payment.remark}</TableCell>
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
