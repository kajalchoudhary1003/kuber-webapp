import React, { useState, useEffect, createContext, useContext } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Create a local context if the global one isn't available
const YearContext = createContext();
const useYear = () => {
  const context = useContext(YearContext);
  // Return a default value if context is not available
  return context || { 
    selectedYear: new Date().getFullYear().toString(), 
    loading: false, 
    error: null 
  };
};

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
  // Add local state as fallback
  const [localYear] = useState(new Date().getFullYear().toString());
  
  // Use either the context value or the local state
  const effectiveYear = selectedYear || localYear;

  // Always call all hooks before any conditional return
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // If window.electron is not available, use dummy data
        if (window.electron) {
          const fetchedClients = await window.electron.ipcRenderer.invoke('get-clients-for-year', effectiveYear);
          const clientsData = fetchedClients.map(client => client.dataValues);
          setClients(clientsData);
        } else {
          // Dummy data for development
          setClients([
            { id: '1', ClientName: 'Client A', Abbreviation: 'CA' },
            { id: '2', ClientName: 'Client B', Abbreviation: 'CB' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    if (effectiveYear) fetchClients();
  }, [effectiveYear]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedClient) {
          if (window.electron) {
            const fetchedData = await window.electron.ipcRenderer.invoke('get-billing-data', {
              clientId: selectedClient,
              year: effectiveYear,
            });
            setData(fetchedData);
            if (fetchedData.length > 0) {
              setCurrencyCode(fetchedData[0].currencyCode);
            }
          } else {
            // Dummy data for development
            const dummyData = [
              { 
                id: '1', 
                name: 'Employee X', 
                ctcMonthly: 50000,
                Apr: 10000, May: 10000, Jun: 10000, Jul: 10000, 
                Aug: 10000, Sep: 10000, Oct: 10000, Nov: 10000, 
                Dec: 10000, Jan: 10000, Feb: 10000, Mar: 10000,
                currencyCode: '₹'
              },
              { 
                id: '2', 
                name: 'Employee Y', 
                ctcMonthly: 60000,
                Apr: 12000, May: 12000, Jun: 12000, Jul: 12000, 
                Aug: 12000, Sep: 12000, Oct: 12000, Nov: 12000, 
                Dec: 12000, Jan: 12000, Feb: 12000, Mar: 12000,
                currencyCode: '₹'
              }
            ];
            setData(dummyData);
            setCurrencyCode('₹');
          }
        }
      } catch (err) {
        console.error('Error fetching billing data:', err);
      }
    };
    fetchData();
  }, [selectedClient, effectiveYear]);

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

      if (window.electron) {
        await window.electron.ipcRenderer.invoke('update-billing-data', {
          id: newData[editIndex.row].id,
          month: editIndex.column,
          amount: tempValue,
        });
      }

      setEditIndex({ row: -1, column: '' });
    } catch (err) {
      console.error('Error updating billing data:', err);
    }
  };

  // Safe conditional rendering (only after all hooks)
  if (loading) return <div>Loading financial year...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col rounded-3xl shadow-lg bg-white items-center p-8 px-4">
      <div className="flex justify-between  items-center w-full mb-0">
        <h2 className="text-[24px] text-[#272727] m-0">Billing Setup</h2>
        <div className="flex gap-2">
          <Select onValueChange={setSelectedClient} value={selectedClient}>
            <SelectTrigger className=" cursor-pointer min-w-[180px]">
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

          <Select value={effectiveYear} disabled>
            <SelectTrigger className=" cursor-pointer min-w-[120px]">
              <SelectValue placeholder={effectiveYear || 'Select Year'} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem className="cursor-pointer" value={effectiveYear}>{effectiveYear}</SelectItem>
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

// Create a wrapper component that provides the YearContext
const BillingSetupWithYearContext = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, loading, error }}>
      <BillingSetup />
    </YearContext.Provider>
  );
};

export default BillingSetupWithYearContext;
