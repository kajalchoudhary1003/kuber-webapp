import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Dummy data for client balance report
const clientBalanceData = [
  {
    client: "BirdsEyeView",
    totalBill: 1200,
    paidAmount: 120,
    balance: 1080,
  },
  {
    client: "TechSolutions",
    totalBill: 2500,
    paidAmount: 1500,
    balance: 1000,
  },
  {
    client: "GlobalInnovate",
    totalBill: 3200,
    paidAmount: 2200,
    balance: 1000,
  },
]

// Fiscal months
const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]

// Generate random color
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Generate color palette
const generateColorPalette = (numColors) => {
  const colors = []
  for (let i = 0; i < numColors; i++) {
    colors.push(generateRandomColor())
  }
  return colors
}

// Dummy data for client profitability
const dummyClientProfitabilityData = {
  client1: {
    clientName: "BirdsEyeView",
    monthlyProfit: {
      "Apr": 12000,
      "May": 15000,
      "Jun": 18000,
      "Jul": 14000,
      "Aug": 16000,
      "Sep": 19000,
      "Oct": 21000,
      "Nov": 17000,
      "Dec": 22000,
      "Jan": 20000,
      "Feb": 23000,
      "Mar": 25000,
    }
  },
  client2: {
    clientName: "TechSolutions",
    monthlyProfit: {
      "Apr": 8000,
      "May": 10000,
      "Jun": 12000,
      "Jul": 9000,
      "Aug": 11000,
      "Sep": 13000,
      "Oct": 15000,
      "Nov": 14000,
      "Dec": 16000,
      "Jan": 17000,
      "Feb": 18000,
      "Mar": 19000,
    }
  },
  client3: {
    clientName: "GlobalInnovate",
    monthlyProfit: {
      "Apr": 15000,
      "May": 18000,
      "Jun": 20000,
      "Jul": 17000,
      "Aug": 19000,
      "Sep": 21000,
      "Oct": 23000,
      "Nov": 22000,
      "Dec": 24000,
      "Jan": 25000,
      "Feb": 26000,
      "Mar": 28000,
    }
  }
}

// Dummy data for employee profitability
const dummyEmployeeProfitabilityData = {
  emp1: {
    name: "John Doe",
    clients: ["BirdsEyeView", "TechSolutions"],
    monthlyProfit: {
      "Apr": 5000,
      "May": 5500,
      "Jun": 6000,
      "Jul": 5800,
      "Aug": 6200,
      "Sep": 6500,
      "Oct": 6800,
      "Nov": 6300,
      "Dec": 7000,
      "Jan": 7200,
      "Feb": 7500,
      "Mar": 7800,
    }
  },
  emp2: {
    name: "Jane Smith",
    clients: ["GlobalInnovate"],
    monthlyProfit: {
      "Apr": 4500,
      "May": 4800,
      "Jun": 5200,
      "Jul": 5000,
      "Aug": 5300,
      "Sep": 5600,
      "Oct": 5900,
      "Nov": 5700,
      "Dec": 6100,
      "Jan": 6300,
      "Feb": 6600,
      "Mar": 6900,
    }
  }
}

export default function Overview() {
  const [selectedYear, setSelectedYear] = useState("2026-2027")
  const [showProfitability, setShowProfitability] = useState(false)

  // Format number with commas
  const formatNumberWithCommas = (number) => {
    if (number == null) return ''
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  // Create client dataset for chart
  const createClientDataset = () => {
    const colors = generateColorPalette(Object.keys(dummyClientProfitabilityData).length)
    const datasets = []
    
    Object.keys(dummyClientProfitabilityData).forEach((clientId, index) => {
      const client = dummyClientProfitabilityData[clientId]
      datasets.push({
        label: client.clientName,
        data: fiscalMonths.map((month) => client.monthlyProfit[month]),
        backgroundColor: colors[index],
      })
    })
    
    return datasets
  }

  // Chart data
  const cvtClientData = {
    labels: fiscalMonths,
    datasets: createClientDataset(),
  }

  // Calculate total CVT Profit
  const totalCvtProfit = cvtClientData.datasets.reduce((total, dataset) => {
    return total + dataset.data.reduce((monthTotal, monthProfit) => monthTotal + monthProfit, 0)
  }, 0)

  // Chart options
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `Total Profit: ₹${formatNumberWithCommas(tooltipItem.raw.toFixed(2))}`,
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.raw, 0)
            return `Total: ₹${formatNumberWithCommas(total.toFixed(2))}`
          },
        },
        displayColors: true,
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        footerColor: '#000',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        mode: 'index',
        intersect: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  const handleShowProfitabilityReport = () => {
    setShowProfitability(true)
  }

  return (
    <div className="space-y-6">
      {/* Client Balance Report Section */}
      <Card className="bg-white border-0 shadow-md rounded-lg">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Client Balance Report</h2>

          <div className="border border-slate-200 rounded-lg">
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
              <Select defaultValue="2026-2027" onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px] cursor-pointer">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-white cursor-pointer">
                  <SelectItem className="cursor-pointer" value="2025-2026">2025-2026</SelectItem>
                  <SelectItem className="cursor-pointer" value="2026-2027">2026-2027</SelectItem>
                  <SelectItem className="cursor-pointer" value="2027-2028">2027-2028</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                className="bg-blue-500 cursor-pointer hover:bg-blue-500/90 text-white rounded-full"
                onClick={handleShowProfitabilityReport}
              >
                Show Profitability Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CVT Profitability Report Chart */}
      {showProfitability && (
        <Card className="bg-white border-0 max-w-screen shadow-md rounded-lg">
          <CardContent className="pt-6 pb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">CVT Profitability Report</h2>
              <div className="text-lg font-medium">
                Total: ₹{formatNumberWithCommas(totalCvtProfit.toFixed(2))}
              </div>
            </div>
            <div style={{ width: '100%', height: '300px', position: 'relative' }}>
              <Bar 
                data={cvtClientData} 
                options={options}
              />
            </div>
          </CardContent>
        </Card>
      )}

       {/* Employee Profitability Table - Using custom div instead of Card */}
       {showProfitability && (
        <div className="bg-white border-0 md:w-6xl 2xl:w-auto shadow-md rounded-lg p-6"  >
          <h2 className="text-xl font-semibold mb-4">Employee Profitability Report</h2>
          
          <div style={{ width: '100%', overflowX: 'auto', maxWidth: '100%' }}>
            <Table style={{ width: 'auto' }}>
              <TableHeader className="bg-slate-200">
                <TableRow>
                  <TableHead className="text-center whitespace-nowrap">#</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Name</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Projects</TableHead>
                  {fiscalMonths.map((month) => (
                    <TableHead key={month} className="text-center whitespace-nowrap">{month}</TableHead>
                  ))}
                  <TableHead className="text-center whitespace-nowrap">Average Monthly Profit</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Yearly Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(dummyEmployeeProfitabilityData).map((employeeId, index) => {
                  const employee = dummyEmployeeProfitabilityData[employeeId];
                  const monthlyProfits = Object.values(employee.monthlyProfit);
                  const averageProfit = monthlyProfits.reduce((sum, profit) => sum + profit, 0) / 12;
                  const yearlyProfit = monthlyProfits.reduce((sum, profit) => sum + profit, 0);
                  
                  return (
                    <TableRow key={employeeId} className="border-b border-slate-200">
                      <TableCell className="text-center whitespace-nowrap">{index + 1}</TableCell>
                      <TableCell className="text-center whitespace-nowrap">{employee.name}</TableCell>
                      <TableCell className="text-center whitespace-nowrap">{employee.clients.join(', ')}</TableCell>
                      {fiscalMonths.map((month) => (
                        <TableCell key={month} className="text-center whitespace-nowrap">
                          ₹{formatNumberWithCommas(employee.monthlyProfit[month].toFixed(2))}
                        </TableCell>
                      ))}
                      <TableCell className="text-center whitespace-nowrap">₹{formatNumberWithCommas(averageProfit.toFixed(2))}</TableCell>
                      <TableCell className="text-center whitespace-nowrap">₹{formatNumberWithCommas(yearlyProfit.toFixed(2))}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
