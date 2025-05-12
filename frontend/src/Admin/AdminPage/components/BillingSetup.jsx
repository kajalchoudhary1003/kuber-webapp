import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useYear } from '../../../contexts/YearContexts';

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const API_BASE_URL = 'http://localhost:5001/api/billing';

const BillingSetup = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [editIndex, setEditIndex] = useState({ row: -1, column: '' });
  const [tempValue, setTempValue] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');
  const [loading, setLoading] = useState(true);

  const { selectedYear } = useYear();

  // Fetch clients when selectedYear changes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        if (selectedYear) {
          const response = await axios.get(`${API_BASE_URL}/clients/${selectedYear}`);
          setClients(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching clients:', err);
        setLoading(false);
      }
    };
    fetchClients();
  }, [selectedYear]);

  // Fetch billing data when client or year changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedClient && selectedYear) {
          const response = await axios.get(`${API_BASE_URL}/data/${selectedClient}/${selectedYear}`);
          setData(response.data);
          if (response.data.length > 0) {
            setCurrencyCode(response.data[0].currencyCode);
          }
        }
      } catch (err) {
        console.error('Error fetching billing data:', err);
      }
    };
    fetchData();
  }, [selectedClient, selectedYear]);

  const formatNumberWithCommas = (number) => {
    if (number == null) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

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

  const handleBlur = async () => {
    try {
      const newData = [...data];
      newData[editIndex.row][editIndex.column] = parseFloat(tempValue);
      setData(newData);

      await axios.put(`${API_BASE_URL}/data/${newData[editIndex.row].id}`, {
        month: editIndex.column,
        amount: parseFloat(tempValue),
      });

      setEditIndex({ row: -1, column: '' });
    } catch (err) {
      console.error('Error updating billing data:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col rounded-3xl shadow-lg bg-white items-center p-8 px-4">
      <div className="flex justify-between items-center w-full mb-0">
        <h2 className="text-[24px] text-[#272727] m-0">Billing Setup</h2>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedClient} value={selectedClient}>
            <SelectTrigger className="cursor-pointer min-w-[180px]">
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {clients.map((client) => (
                <SelectItem className="cursor-pointer" key={client.id} value={client.id}>
                  {client.ClientName} ({client.Abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} disabled>
            <SelectTrigger className="cursor-pointer min-w-[120px]">
              <SelectValue placeholder={selectedYear || 'Select Year'} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem className="cursor-pointer" value={selectedYear}>
                {selectedYear ? `${selectedYear}-${parseInt(selectedYear) + 1}` : 'Select Year'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full overflow-x-auto mt-5">
        {selectedClient && (
          <table className="w-full border-collapse bg-white shadow-md">
            <thead className='bg-[#EDEFF2]'>
              <tr className="bg-secondary-anti-flash-white text-sm font-bold text-primary-black">
                <th className="p-2 border-b border-secondary-cadet-gray">Name</th>
                <th className="p-2 border-b border-secondary-cadet-gray">CTC/M</th>
                {fiscalMonths.map(month => (
                  <th key={month} className="p-2 border-b border-secondary-cadet-gray">{month}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                <tr key={item.id} className="text-sm text-primary-black">
                  <td className="p-2 border-b border-secondary-cadet-gray">{item.name}</td>
                  <td className="p-2 border-b border-secondary-cadet-gray">{currencyCode}{formatNumberWithCommas(item.ctcMonthly)}</td>
                  {fiscalMonths.map(column => (
                    <td
                      key={`${item.id}-${column}`}
                      className="p-2 border-b border-secondary-cadet-gray cursor-pointer"
                      onDoubleClick={() => handleDoubleClick(rowIndex, column, item[column])}
                    >
                      {editIndex.row === rowIndex && editIndex.column === column ? (
                        <Input
                          value={tempValue}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          type="number"
                          min="0"
                          step="0.01"
                          className="h-8"
                          autoFocus
                        />
                      ) : (
                        `${currencyCode}${formatNumberWithCommas(item[column])}`
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BillingSetup;