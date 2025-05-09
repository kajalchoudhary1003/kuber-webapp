import { Card, CardContent } from "@/components/ui/card"
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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Helper function to generate color palette
const generateColorPalette = (numColors) => {
  const colors = []
  for (let i = 0; i < numColors; i++) {
    const hue = (i * 360) / numColors
    const saturation = 60 + Math.random() * 20
    const lightness = 50 + Math.random() * 10
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }
  return colors
}

// List of employee names for dummy data
const employeeNames = [
  "Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Singh", "Vikram Mehta", 
  "Anjali Gupta", "Sanjay Verma", "Deepika Reddy", "Rajesh Khanna", "Meera Iyer"
]

// Dummy data for the charts
const generateDummyData = (client, year) => {
  const clientName = client === "bev" ? "BirdsEyeView" : client === "acme" ? "Acme Corp" : "Globex Industries"
  
  // Generate monthly data - employee profitability by month
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
  const monthlyData = {}
  
  // Generate employee data
  const employees = employeeNames.map(name => {
    return {
      name,
      // Generate a base profitability value for this employee that will be used to calculate monthly values
      baseProfit: Math.floor(Math.random() * 50000) + 10000
    }
  })
  
  // Generate monthly data for each employee
  months.forEach(month => {
    monthlyData[month] = employees.map(employee => {
      // Add some variation to the base profit for each month
      const variationFactor = 0.7 + Math.random() * 0.6 // Between 0.7 and 1.3
      return {
        name: employee.name,
        profit: Math.floor(employee.baseProfit * variationFactor)
      }
    })
    
    // Add total profit for the month
    const totalProfit = monthlyData[month].reduce((sum, employee) => sum + employee.profit, 0)
    monthlyData[month].push({ name: "Total Profit", profit: totalProfit })
  })
  
  // Generate yearly data - total profitability for each employee
  const yearlyEmployeeData = employees.map(employee => {
    // Calculate total yearly profit for this employee
    const yearlyProfit = months.reduce((sum, month) => {
      const employeeMonthData = monthlyData[month].find(data => data.name === employee.name)
      return sum + (employeeMonthData ? employeeMonthData.profit : 0)
    }, 0)
    
    return {
      name: employee.name,
      profit: yearlyProfit
    }
  })
  
  // Sort employees by profit (descending)
  yearlyEmployeeData.sort((a, b) => b.profit - a.profit)
  
  // Take top 5 employees and group the rest as "Others"
  const top5Employees = yearlyEmployeeData.slice(0, 5)
  const otherEmployees = yearlyEmployeeData.slice(5)
  
  const yearlyData = [
    ...top5Employees,
    {
      name: "Others",
      profit: otherEmployees.reduce((sum, employee) => sum + employee.profit, 0)
    }
  ]
  
  // Add total profit to yearly data
  const totalYearlyProfit = yearlyEmployeeData.reduce((sum, employee) => sum + employee.profit, 0)
  yearlyData.push({ name: "Total Profit", profit: totalYearlyProfit })
  
  return {
    clientName,
    year,
    monthlyData,
    yearlyData
  }
}

export default function ClientProfitability() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedYear, setSelectedYear] = useState("2026-2027")
  const [showReport, setShowReport] = useState(false)
  const [profitabilityData, setProfitabilityData] = useState(null)

  const handleShowReport = () => {
    if (selectedClient) {
      // Generate dummy data
      const data = generateDummyData(selectedClient, selectedYear)
      setProfitabilityData(data)
      setShowReport(true)
    }
  }

  // Chart options
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ₹${tooltipItem.raw.toLocaleString()}`,
          footer: (tooltipItems) => {
            const label = tooltipItems[0].label
            if (profitabilityData) {
              if (tooltipItems[0].datasetIndex === 0 && label !== 'Total Profit') {
                // For yearly data
                const totalProfitData = profitabilityData.yearlyData.find(entry => entry.name === 'Total Profit')
                return totalProfitData ? `Total Client Profit: ₹${totalProfitData.profit.toLocaleString()}` : ''
              } else {
                // For monthly data
                const totalProfitData = profitabilityData.monthlyData[label]?.find(entry => entry.name === 'Total Profit')
                return totalProfitData ? `Total Month Profit: ₹${totalProfitData.profit.toLocaleString()}` : ''
              }
            }
            return ''
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
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => `₹${value.toLocaleString()}`
        }
      },
    },
  }

  // Create datasets for monthly data - showing employee contributions per month
  const createMonthlyDatasets = () => {
    if (!profitabilityData) return { labels: [], datasets: [] }
    
    const months = Object.keys(profitabilityData.monthlyData)
    
    // Get unique employee names across all months (excluding "Total Profit")
    const employeeNames = new Set()
    months.forEach(month => {
      profitabilityData.monthlyData[month].forEach(entry => {
        if (entry.name !== 'Total Profit') {
          employeeNames.add(entry.name)
        }
      })
    })
    
    const uniqueEmployees = Array.from(employeeNames)
    const colors = generateColorPalette(uniqueEmployees.length)
    
    // Create a dataset for each employee
    const datasets = uniqueEmployees.map((employeeName, index) => ({
      label: employeeName,
      data: months.map(month => {
        const entry = profitabilityData.monthlyData[month].find(item => item.name === employeeName)
        return entry ? entry.profit : 0
      }),
      backgroundColor: colors[index],
    }))
    
    return {
      labels: months,
      datasets,
    }
  }

  // Create datasets for yearly data - showing top 5 employees and "Others"
  const createYearlyDatasets = () => {
    if (!profitabilityData) return { labels: [], datasets: [] }
    
    // Filter out the "Total Profit" entry
    const employeeData = profitabilityData.yearlyData.filter(entry => entry.name !== 'Total Profit')
    
    const labels = employeeData.map(entry => entry.name)
    const profits = employeeData.map(entry => entry.profit)
    const colors = generateColorPalette(labels.length)
    
    return {
      labels,
      datasets: [{
        label: 'Employee Yearly Profit',
        data: profits,
        backgroundColor: colors,
      }],
    }
  }

  const monthlyChartData = createMonthlyDatasets()
  const yearlyChartData = createYearlyDatasets()

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

      {showReport && profitabilityData && (
        <>
          {/* Monthly Profitability Chart - Employee contributions by month */}
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Employee Profitability for {profitabilityData.clientName} - {selectedYear}</h3>
              <div className="w-full h-80">
                <Bar data={monthlyChartData} options={options} />
              </div>
            </CardContent>
          </Card>

          {/* Yearly Profitability Chart - Top 5 employees and Others */}
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Yearly Employee Profitability for {profitabilityData.clientName} - {selectedYear}</h3>
              <div className="w-full h-80">
                <Bar data={yearlyChartData} options={{...options, scales: {...options.scales, x: {}}}} />
              </div>
              
              {/* Summary Card */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Profitability Summary</h4>
                <div className="grid grid-cols-4 gap-4">
                  {profitabilityData.yearlyData.map((item, index) => (
                    <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                      <p className="text-sm text-gray-500">{item.name}</p>
                      <p className="text-lg font-semibold">₹{item.profit.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
