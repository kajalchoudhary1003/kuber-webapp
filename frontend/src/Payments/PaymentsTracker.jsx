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

export default function PaymentTracker() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [date, setDate] = useState()
  const [amount, setAmount] = useState("")
  const [remark, setRemark] = useState("")
  const [reconciliationNote, setReconciliationNote] = useState("")
  const [clientPayments, setClientPayments] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
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

  // Fetch payments for selected client
  useEffect(() => {
    const fetchClientPayments = async () => {
      if (!selectedClient) {
        setClientPayments([])
        return
      }

      try {
        setPaymentLoading(true)
        const response = await axios.get(`http://localhost:5001/api/payment-tracker/payment/last-three/${selectedClient}`)
        setClientPayments(response.data.payments || [])
        setPaymentError(null)
      } catch (err) {
        setPaymentError("Failed to fetch payments for this client")
        console.error("Error fetching client payments:", err)
        setClientPayments([])
      } finally {
        setPaymentLoading(false)
      }
    }

    fetchClientPayments()
  }, [selectedClient])

  const handleRecordPayment = async () => {
    if (!selectedClient || !date || !amount) {
      alert("Please select a client, date, and enter an amount")
      return
    }

    try {
      setSubmitLoading(true)
      
      // Format the date to ISO string for the backend
      const formattedDate = date.toISOString()
      
      // Send payment data to backend
      await axios.post('http://localhost:5001/api/payment-tracker/payment', {
        ClientID: parseInt(selectedClient),
        ReceivedDate: formattedDate,
        Amount: parseFloat(amount),
        Remark: remark
      })

      // Refresh the payments list
      const response = await axios.get(`http://localhost:5001/api/payment-tracker/payment/last-three/${selectedClient}`)
      setClientPayments(response.data.payments || [])
      
      // Reset form
      setDate(undefined)
      setAmount("")
      setRemark("")
      
      alert("Payment recorded successfully")
    } catch (err) {
      console.error("Error recording payment:", err)
      alert(`Failed to record payment: ${err.response?.data?.error || err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="p-6 min-h-screen">
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
                <Input 
                  id="amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  className="pl-7"
                  type="number"
                  step="0.01" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remark">Remark</Label>
              <Input id="remark" placeholder="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
            </div>

            <Button 
              className="bg-blue-500 hover:bg-blue-500/90 text-white rounded-full h-10 cursor-pointer" 
              onClick={handleRecordPayment}
              disabled={!selectedClient || !date || !amount || submitLoading}
            >
              {submitLoading ? "Recording..." : "Record Payment"}
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
                  {paymentLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">Loading payments...</TableCell>
                    </TableRow>
                  ) : paymentError ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-red-500">{paymentError}</TableCell>
                    </TableRow>
                  ) : clientPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">No payment records found for this client</TableCell>
                    </TableRow>
                  ) : (
                    clientPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-center">{formatDisplayDate(payment.ReceivedDate)}</TableCell>
                        <TableCell className="text-center">£{parseFloat(payment.Amount).toFixed(2)}</TableCell>
                        <TableCell className="text-center">{payment.Remark || "-"}</TableCell>
                      </TableRow>
                    ))
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
