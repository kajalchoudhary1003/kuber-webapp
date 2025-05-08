import React, { useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useYear } from '../../contexts/YearContexts';

// Static data for employee cost
const staticEmployeeCostData = [
  {
    id: '1',
    name: 'Employee A',
    Apr: 10000,
    May: 10000,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Jan: 0,
    Feb: 0,
    Mar: 0,
  },
  {
    id: '2',
    name: 'Employee B',
    Apr: 12000,
    May: 12000,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Jan: 0,
    Feb: 0,
    Mar: 0,
  },
];

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const EmployeeCost = () => {
  const [data, setData] = useState([]);
  const { selectedYear } = useYear();
  const [editIndex, setEditIndex] = useState({ row: -1, column: '' });
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    if (selectedYear) {
      setData(staticEmployeeCostData);
    }
  }, [selectedYear]);

  const handleDoubleClick = (row, column, value) => {
    setEditIndex({ row, column });
    setTempValue(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && value >= 0) {
      setTempValue(value);
    }
  };

  const handleBlur = () => {
    try {
      const newData = [...data];
      newData[editIndex.row][editIndex.column] = tempValue;
      setData(newData);
      setEditIndex({ row: -1, column: '' });
    } catch (error) {
      console.error('Error updating employee cost data:', error);
    }
  };

  const formatCurrency = (value) => {
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center w-full mb-2">
          <h2 className="text-[24px] text-[#272727]">Employee Cost</h2>
          <div className="w-32">
            <Select disabled value={selectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={selectedYear}>{selectedYear}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          {selectedYear && (
            <Table className="bg-white shadow-sm">
              <TableHeader className="text-[16px] bg-[#EDEFF2] ">
                <TableRow className="border-b border-[#9DA4B3]">
                  <TableHead className="px-3 py-2 ">#</TableHead>
                  <TableHead className="px-3 py-2 ">Name</TableHead>
                  {fiscalMonths.map((month) => (
                    <TableHead key={month} className="px-3 py-2 ">{month}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((item, rowIndex) => (
                  <TableRow key={item.id} className="text-sm text-black border-b border-[#9DA4B3] hover:bg-[#E6F2FF] transition-colors duration-200">
                    <TableCell className="px-3 py-2 text-[14px]">{item.id}</TableCell>
                    <TableCell className="px-3 py-2 text-[14px]">{item.name}</TableCell>
                    {fiscalMonths.map((column) => (
                      <TableCell
                        key={`${item.id}-${column}`}
                        className="px-3 py-2 text-[14px] cursor-pointer"
                        onDoubleClick={() => handleDoubleClick(rowIndex, column, item[column])}
                      >
                        {editIndex.row === rowIndex && editIndex.column === column ? (
                          <Input
                            value={tempValue}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="number"
                            className="h-8 text-sm"
                            autoFocus
                          />
                        ) : (
                          item[column] !== null && item[column] !== undefined && item[column] !== ''
                            ? formatCurrency(item[column])
                            : ''
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}
        </div>
      </div>
    </div>

  );
};

export default EmployeeCost;
