import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';

// Create a local context if the global one isn't available
const YearContext = createContext();
const useYear = () => {
  const context = useContext(YearContext);
  // Return a default value if context is not available
  return context || { selectedYear: null, setSelectedYear: () => {} };
};

const fiscalMonths = [
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
];

const GenerateInvoicePage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [generatedInvoices, setGeneratedInvoices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  
  // Use the context with fallback
  const { selectedYear, setSelectedYear } = useYear();
  // Add local state as fallback
  const [localSelectedYear, setLocalSelectedYear] = useState(null);
  
  // Use either the context value or the local state
  const effectiveYear = selectedYear || localSelectedYear;
  const setEffectiveYear = (year) => {
    setSelectedYear(year);
    setLocalSelectedYear(year);
  };
  
  const [financialYears, setFinancialYears] = useState([]);
  const [showMoreAvailable, setShowMoreAvailable] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { total, financialYears } = await window.electron.ipcRenderer.invoke('get-financial-years', { page, limit });
        setFinancialYears((prevYears) => {
          const newYears = financialYears.map((year) => year.year);
          const uniqueYears = [...new Set([...prevYears, ...newYears])];
          setShowMoreAvailable(uniqueYears.length < total);
          return uniqueYears;
        });

        if (financialYears.length > 0 && page === 1) {
          setEffectiveYear(financialYears[0].year);
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
      }
    };

    fetchData();
  }, [page]);

  const handleYearChange = (year) => {
    setEffectiveYear(year);
  };

  const handleShowMoreYears = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const formatYear = (year) => {
    const nextYear = parseInt(year) + 1;
    return `${year}-${nextYear}`;
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const fetchedClients = await window.electron.ipcRenderer.invoke('get-clients-for-year', effectiveYear);
        const clientsData = fetchedClients.map((client) => client.dataValues);
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    if (effectiveYear) {
      fetchClients();
    }
  }, [effectiveYear]);

  const fetchGeneratedInvoices = async () => {
    try {
      const invoices = await window.electron.ipcRenderer.invoke('get-generated-invoices', effectiveYear, selectedMonth);
      const formattedInvoices = invoices.map((invoice) => ({
        ...invoice,
        generatedOn: new Date(invoice.generatedOn),
        invoicedOn: invoice.invoicedOn ? new Date(invoice.invoicedOn) : null,
      }));
      setGeneratedInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching generated invoices:', error);
    }
  };

  useEffect(() => {
    if (effectiveYear) {
      fetchGeneratedInvoices();
    }
  }, [effectiveYear, selectedMonth]);

  // Rest of your component code remains the same...
  
  // Make sure to use effectiveYear instead of selectedYear in the rest of your code
  
  const handleSelectAll = (checked) => {
    setAllSelected(checked);
    if (checked) {
      const allIds = mergedInvoices.map((invoice) => invoice.id || invoice.clientId);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (checked, rowId) => {
    const updatedSelectedRows = checked
      ? [...selectedRows, rowId]
      : selectedRows.filter((selectedRow) => selectedRow !== rowId);

    setSelectedRows(updatedSelectedRows);
    setAllSelected(updatedSelectedRows.length === mergedInvoices.length);
  };

  const handleGenerateInvoice = async () => {
    if (selectedRows.length === 0) {
      alert('Please select at least one client to generate invoices.');
      return;
    }

    const clientIdsToGenerate = selectedRows.map((rowId) => {
      const invoice = mergedInvoices.find((inv) => inv.id === rowId || inv.clientId === rowId);
      return invoice.clientId;
    });

    try {
      await window.electron.ipcRenderer.invoke('generate-invoices', clientIdsToGenerate, effectiveYear, selectedMonth);
      setSelectedRows([]);
      fetchGeneratedInvoices();
    } catch (error) {
      console.error('Error generating invoices:', error);
      alert(`Error generating invoices: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const invoicesToDelete = selectedRows.filter((rowId) =>
        generatedInvoices.some((invoice) => invoice.id === rowId && invoice.pdfPath)
      );
      await Promise.all(invoicesToDelete.map((id) => window.electron.ipcRenderer.invoke('delete-invoice', id)));
      setSelectedRows([]);
      setAllSelected(false);
      fetchGeneratedInvoices();
    } catch (error) {
      console.error('Error deleting invoices:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const invoicesToDownload = selectedRows.filter((rowId) =>
        generatedInvoices.some((invoice) => invoice.id === rowId && invoice.pdfPath)
      );
      await Promise.all(invoicesToDownload.map((id) => window.electron.ipcRenderer.invoke('download-invoice', id)));
      setSelectedRows([]);
      setAllSelected(false);
    } catch (error) {
      console.error('Error downloading invoices:', error);
    }
  };

  const handleMarkAsSent = async () => {
    try {
      const invoicesToMarkAsSent = selectedRows.filter((rowId) =>
        generatedInvoices.some((invoice) => invoice.id === rowId && invoice.pdfPath)
      );
      await Promise.all(invoicesToMarkAsSent.map((id) => window.electron.ipcRenderer.invoke('mark-invoice-as-sent', id)));
      setSelectedRows([]);
      setAllSelected(false);
      fetchGeneratedInvoices();
    } catch (error) {
      console.error('Error marking invoices as sent:', error);
    }
  };

  const handleRegenerate = async () => {
    try {
      const invoicesToRegenerate = selectedRows.filter((rowId) =>
        generatedInvoices.some((invoice) => invoice.id === rowId && invoice.pdfPath)
      );
      await Promise.all(invoicesToRegenerate.map((id) => window.electron.ipcRenderer.invoke('regenerate-invoice', id)));
      setSelectedRows([]);
      setAllSelected(false);
      fetchGeneratedInvoices();
    } catch (error) {
      console.error('Error regenerating invoices:', error);
    }
  };

  const handleViewInvoice = async (pdfPath) => {
    try {
      await window.electron.ipcRenderer.invoke('view-invoice', pdfPath);
    } catch (error) {
      console.error('Error viewing invoice:', error);
    }
  };

  const mergedInvoices = clients.map((client) => {
    const invoice = generatedInvoices.find((inv) => inv.clientId === client.id);
    return invoice
      ? invoice
      : {
          id: null,
          clientId: client.id,
          clientName: client.ClientName,
          totalAmount: 0,
          currencyCode: '',
          generatedOn: null,
          invoicedOn: null,
          status: 'Not generated yet',
          pdfPath: null,
        };
  });

  useEffect(() => {
    setAllSelected(selectedRows.length === mergedInvoices.length);
  }, [selectedRows, mergedInvoices]);

  const hasGeneratedInvoices = mergedInvoices.some((invoice) => invoice.id !== null);
  const bothTypesSelected = selectedRows.some((rowId) => {
    const invoice = mergedInvoices.find((inv) => inv.id === rowId || inv.clientId === rowId);
    return invoice?.id !== null;
  }) && selectedRows.some((rowId) => {
    const invoice = mergedInvoices.find((inv) => inv.id === rowId || inv.clientId === rowId);
    return invoice?.id === null;
  });

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <Card className="w-full rounded-4xl shadow-sm bg-white border-white h-28">
        <CardHeader className="flex flex-row items-center justify-between px-7 py-7">
          <h2 className="text-2xl font-normal text-black">
            FY: {effectiveYear ? formatYear(effectiveYear) : 'Select Year'}
          </h2>
          <div className="flex borderitems-center gap-3">
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-40 rounded-full border-gray-300">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {fiscalMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between w-40 rounded-full border-gray-300 text-black hover:border-blue-500"
                >
                  {effectiveYear ? formatYear(effectiveYear) : 'Select Year'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                {financialYears.map((year, index) => (
                  <DropdownMenuItem
                    key={`${year}-${index}`}
                    onSelect={() => handleYearChange(year)}
                  >
                    {formatYear(year)}
                  </DropdownMenuItem>
                ))}
                {showMoreAvailable && (
                  <DropdownMenuItem onSelect={handleShowMoreYears}>
                    Show More
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
      </Card>

      {/* Rest of your component JSX remains the same */}
      <Card className="w-full bg-white border-white rounded-3xl shadow-sm">
        <CardContent className="p-7">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[24px] font-normal  text-[#272727]">Generated Invoices</h2>
            {!bothTypesSelected && hasGeneratedInvoices && selectedRows.some(rowId => {
              const invoice = mergedInvoices.find(inv => inv.id === rowId || inv.clientId === rowId);
              return invoice?.id !== null;
            }) && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 rounded-full"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  className="text-blue-500 hover:bg-blue-50 rounded-full"
                  onClick={handleDownload}
                >
                  Download
                </Button>
                <Button
                  variant="ghost"
                  className="text-teal-500 hover:bg-teal-50 rounded-full"
                  onClick={handleMarkAsSent}
                >
                  Mark as Sent
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                  onClick={handleRegenerate}
                >
                  Re-generate
                </Button>
              </div>
            )}
            {!bothTypesSelected && (
              <Button
                onClick={handleGenerateInvoice}
                disabled={selectedRows.length === 0}
                className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
                >
                  Generate Invoice(s)
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-center">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        indeterminate={selectedRows.length > 0 && selectedRows.length < mergedInvoices.length}
                      />
                    </th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Client</th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Total Billing Amount</th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Generated On</th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Invoice Month & Year</th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Status</th>
                    <th className="p-3 text-[14px] font-normal text-[#7B7B7B] mb-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedInvoices.map((invoice, index) => (
                    <tr key={`${invoice.id || invoice.clientId}-${index}`} className="border-b border-gray-200">
                      <td className="p-3 text-center">
                        <Checkbox
                          checked={selectedRows.includes(invoice.id || invoice.clientId)}
                          onCheckedChange={(checked) => handleRowSelect(checked, invoice.id || invoice.clientId)}
                        />
                      </td>
                      <td className="p-3 text-center">{invoice.clientName}</td>
                      <td className="p-3 text-center">
                        {invoice.id ? `${invoice.currencyCode} ${invoice.totalAmount.toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="p-3 text-center">
                        {invoice.generatedOn && invoice.generatedOn.getTime() !== 0
                          ? new Date(invoice.generatedOn).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-3 text-center">
                        {invoice.invoicedOn && invoice.invoicedOn.getTime() !== 0
                          ? new Date(invoice.invoicedOn).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-3 text-center">{invoice.status}</td>
                      <td className="p-3 text-center">
                        {invoice.pdfPath ? (
                          <Button
                            variant="outline"
                            className="rounded-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                            onClick={() => handleViewInvoice(invoice.pdfPath)}
                          >
                            View
                          </Button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Create a wrapper component that provides the YearContext
  const GenerateInvoicePageWithYearContext = () => {
    const [selectedYear, setSelectedYear] = useState(null);
  
    return (
      <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
        <GenerateInvoicePage />
      </YearContext.Provider>
    );
  };
  
  export default GenerateInvoicePageWithYearContext;
  