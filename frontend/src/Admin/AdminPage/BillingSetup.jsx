import React, { useState, useEffect } from 'react';
import { useYear } from '../../contexts/YearContexts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const fiscalMonths = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const BillingSetup = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [editIndex, setEditIndex] = useState({ row: -1, column: '' });
  const [tempValue, setTempValue] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [currencyCode, setCurrencyCode] = useState('');

  // Must always be called unconditionally
  const { selectedYear, loading, error } = useYear();

  // Always call all hooks before any conditional return
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients = await window.electron.ipcRenderer.invoke('get-clients-for-year', selectedYear);
        const clientsData = fetchedClients.map(client => client.dataValues);
        setClients(clientsData);
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    if (selectedYear) fetchClients();
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedClient) {
          const fetchedData = await window.electron.ipcRenderer.invoke('get-billing-data', {
            clientId: selectedClient,
            year: selectedYear,
          });
          setData(fetchedData);
          if (fetchedData.length > 0) {
            setCurrencyCode(fetchedData[0].currencyCode);
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
      newData[editIndex.row][editIndex.column] = tempValue;
      setData(newData);

      await window.electron.ipcRenderer.invoke('update-billing-data', {
        id: newData[editIndex.row].id,
        month: editIndex.column,
        amount: tempValue,
      });

      setEditIndex({ row: -1, column: '' });
    } catch (err) {
      console.error('Error updating billing data:', err);
    }
  };

  // Safe conditional rendering (only after all hooks)
  if (loading) return <div>Loading financial year...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center px-4">
      <div className="flex justify-between items-center w-full mb-0">
        <h2 className="text-xl font-semibold text-primary-federal-blue m-0">Billing Setup</h2>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedClient} value={selectedClient}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.ClientName} ({client.Abbreviation})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} disabled>
            <SelectTrigger className="min-w-[120px]">
              <SelectValue placeholder={selectedYear || 'Select Year'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={selectedYear}>{selectedYear}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full overflow-x-auto mt-5">
        {selectedClient && (
          <table className="w-full border-collapse bg-white shadow-md">
            <thead>
              <tr className="bg-secondary-anti-flash-white text-sm font-bold text-primary-black">
                <th className="p-2 border-b border-secondary-cadet-gray">#</th>
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
                  <td className="p-2 border-b border-secondary-cadet-gray">{item.id}</td>
                  <td className="p-2 border-b border-secondary-cadet-gray">{item.name}</td>
                  <td className="p-2 border-b border-secondary-cadet-gray">₹{formatNumberWithCommas(item.ctcMonthly)}</td>
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
