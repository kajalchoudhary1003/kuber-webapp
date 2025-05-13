import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Import Button component
import { useYear } from '../../../contexts/YearContexts';

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const EmployeeCost = () => {
  const [data, setData] = useState([]);
  const { selectedYear, loading: yearLoading, error: yearError } = useYear();
  const [editIndex, setEditIndex] = useState({ row: -1, column: '' });
  const [tempValue, setTempValue] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Derive fiscal year range (e.g., "2025-2026")
  const fiscalYearRange = selectedYear ? `${selectedYear}-${parseInt(selectedYear) + 1}` : 'Select Year';

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) {
        console.log('No year selected, skipping fetch');
        return;
      }
      
      try {
        console.log('Fetching data for year:', selectedYear);
        setError(null);
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/employee-cost/${selectedYear}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employee cost data: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Fetched employee cost data:', result);
        setData(result);
      } catch (err) {
        console.error('Error fetching employee cost data:', err);
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear]);

  const handleDoubleClick = (row, column, value) => {
    setEditIndex({ row, column });
    setTempValue(value || '');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && value >= 0) {
      setTempValue(value);
    }
  };

  const handleBlur = async () => {
    try {
      const newData = [...data];
      const employeeId = newData[editIndex.row].id;
      const month = editIndex.column;
      const amount = parseFloat(tempValue);

      const response = await fetch(`http://localhost:5001/api/employee-cost/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month, amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee cost');
      }

      newData[editIndex.row][editIndex.column] = amount;
      setData(newData);
      setEditIndex({ row: -1, column: '' });
      setError(null);
    } catch (error) {
      console.error('Error updating employee cost data:', error);
      setError(error.message);
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="">
      <div className="w-full max-w-[1400px] bg-white rounded-3xl shadow-lg p-6">
        <div className="flex justify-between items-center w-full mb-4">
          <h2 className="text-[24px] text-[#272727]">Employee Cost</h2>

          <div className="min-w-[120px]">
            <Button
              disabled
              className="w-full bg-[#9DA4B3] text-black rounded-xl h-10 text-sm"
            >
              {fiscalYearRange}
            </Button>
          </div>
        </div>

        {yearError && <div className="text-red-500 mb-4">{yearError}</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {(yearLoading || loading) && <div className="mb-4">Loading...</div>}

        <div className="md:w-[1020px] 2xl:w-full">
          {selectedYear && !yearLoading && !loading && data.length > 0 ? (
            <div style={{ width: '100%', overflowX: 'auto', maxWidth: '100%' }}>
              <Table className="shadow-sm" style={{ width: '100%' }}>
                <TableHeader className="bg-[#EDEFF2]">
                  <TableRow className="border-b border-[#9DA4B3]">
                    <TableHead className="p-3 text-left min-w-[200px] text-[14px]">Name</TableHead>
                    {fiscalMonths.map((month) => (
                      <TableHead key={month} className="p-3 text-center min-w-[100px] text-[14px]">{month}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((item, rowIndex) => (
                    <TableRow
                      key={item.id}
                      className="text-sm text-black border-b border-[#9DA4B3] hover:bg-[#E6F2FF] transition-colors duration-200"
                    >
                      <TableCell className="p-3 text-[14px] min-w-[200px] truncate text-left">
                        {item.name}
                      </TableCell>
                      {fiscalMonths.map((column) => (
                        <TableCell
                          key={`${item.id}-${column}`}
                          className="p-3 text-[14px] min-w-[100px] text-center"
                          onDoubleClick={() => handleDoubleClick(rowIndex, column, item[column])}
                        >
                          <div className="whitespace-nowrap flex justify-center">
                            {editIndex.row === rowIndex && editIndex.column === column ? (
                              <Input
                                id={`cost-${item.id}-${column}`}
                                name={`cost-${item.id}-${column}`}
                                value={tempValue}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="number"
                                className="h-8 text-sm w-full max-w-[100px] text-center"
                                autoFocus
                              />
                            ) : (
                              formatCurrency(item[column])
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {selectedYear ? 'No employee cost data available for the selected year.' : 'Please select a year to view employee costs.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCost;