import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Dummy data for client balance report
const clientBalanceData = [
  {
    client: "BirdsEyeView",
    totalBill: 1200,
    paidAmount: 120,
    balance: 1080,
  },
]

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* Client Balance Report Section */}
      <Card className="bg-white border-0 shadow-md rounded-lg overflow-hidden">
        <CardContent className="">
          <h2 className="text-xl font-semibold mb-4">Client Balance Report</h2>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-200">
                <TableRow>
                  <TableHead className="w-1/4 text-center">Client</TableHead>
                  <TableHead className="w-1/4 text-center">Total Bill</TableHead>
                  <TableHead className="w-1/4 text-center">Paid Amount</TableHead>
                  <TableHead className="w-1/4 text-center">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientBalanceData.map((item, index) => (
                  <TableRow key={index} className="border-b border-slate-200">
                    <TableCell className="text-center">{item.client}</TableCell>
                    <TableCell className="text-center">{item.totalBill.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{item.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{item.balance.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee & CVT Profitability Report Section */}
      <Card className="bg-white border-0 shadow-md rounded-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Employee & CVT Profitability Report</h2>

            <div className="flex items-center gap-4">
              <Select  defaultValue="2026-2027">
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue  placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-white cursor-pointer">
                  <SelectItem className="cursor-pointer" value="2025-2026">2025-2026</SelectItem>
                  <SelectItem className="cursor-pointer" value="2026-2027">2026-2027</SelectItem>
                  <SelectItem className="cursor-pointer" value="2027-2028">2027-2028</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-blue-500 cursor-pointer hover:bg-blue-500/90 text-white rounded-full">Show Profitability Report</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
