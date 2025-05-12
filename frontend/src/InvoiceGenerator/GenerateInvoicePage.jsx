import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useYear } from '../contexts/YearContexts';

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

const API_BASE = 'http://localhost:5001/api';

const GenerateInvoicePage = () => {
  const [clients, setClients] = useState([]);
  const [generatedInvoices, setGeneratedInvoices] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { selectedYear, loading } = useYear();

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_BASE}/clients?year=${selectedYear}`);
      if (!res.ok) throw new Error(`Failed to fetch clients: ${res.status}`);
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      alert('Failed to fetch clients. Please try again.');
    }
  };

  const fetchGeneratedInvoices = async () => {
    try {
      const res = await fetch(`${API_BASE}/invoices/generated/${selectedYear}/${selectedMonth}`);
      if (!res.ok) throw new Error(`Failed to fetch invoices: ${res.status}`);
      const data = await res.json();
      setGeneratedInvoices(data);
      console.log('Generated invoices data:', data);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      alert('Failed to fetch invoices. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchClients();
      fetchGeneratedInvoices();
    }
  }, [selectedYear, selectedMonth]);

  // Compute mergedInvoices using useMemo
  const mergedInvoices = useMemo(() => {
    return clients.map((client) => {
      const invoice = generatedInvoices.find((inv) => inv.ClientID === client.id);
      return invoice
        ? {
            id: invoice.id,
            clientId: client.id,
            clientName: client.ClientName,
            totalAmount: parseFloat(invoice.TotalAmount || 0),
            currencyCode: invoice.BillingCurrency?.CurrencyCode || '',
            generatedOn: invoice.GeneratedOn ? new Date(invoice.GeneratedOn) : null,
            invoicedOn: invoice.InvoicedOn ? new Date(invoice.InvoicedOn) : null,
            year: invoice.Year,
            month: invoice.Month,
            status: invoice.Status,
            pdfPath: invoice.PdfPath,
          }
        : {
            id: null,
            clientId: client.id,
            clientName: client.ClientName,
            totalAmount: 0,
            currencyCode: '',
            generatedOn: null,
            invoicedOn: null,
            year: null,
            month: null,
            status: 'Not generated yet',
            pdfPath: null,
          };
    });
  }, [clients, generatedInvoices]);

  // Auto-select generated invoices
  useEffect(() => {
    const generatedInvoiceIds = mergedInvoices
      .filter((invoice) => invoice.id && invoice.pdfPath)
      .map((invoice) => invoice.id);
    setSelectedRows((prev) => {
      const newSelection = [...new Set([...prev, ...generatedInvoiceIds])];
      return newSelection;
    });
  }, [mergedInvoices]);

  const handleGenerateInvoice = async () => {
    const toGenerate = mergedInvoices.filter((inv) => selectedRows.includes(inv.clientId) && !inv.id);
    console.log('Invoices to generate:', toGenerate);
    if (toGenerate.length === 0) {
      alert('No invoices selected to generate.');
      return;
    }

    try {
      for (const inv of toGenerate) {
        const response = await fetch(`${API_BASE}/invoices/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ year: selectedYear, month: selectedMonth, clientId: inv.clientId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to generate invoice for ${inv.clientName}: ${errorData.error}`);
        }
      }
      await fetchGeneratedInvoices();
      alert('Invoices generated successfully.');
    } catch (err) {
      console.error('Generate invoice failed:', err);
      alert(`Error generating invoices: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    const toDelete = mergedInvoices.filter((inv) => selectedRows.includes(inv.id) && inv.pdfPath);
    if (toDelete.length === 0) {
      alert('No generated invoices selected to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${toDelete.length} invoice(s)?`)) {
      return;
    }

    try {
      for (const inv of toDelete) {
        const response = await fetch(`${API_BASE}/invoices/delete/${inv.id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Failed to delete invoice ${inv.id}`);
      }
      await fetchGeneratedInvoices();
      alert(`${toDelete.length} invoice(s) deleted successfully.`);
    } catch (err) {
      console.error('Delete invoice failed:', err);
      alert('Failed to delete invoice(s). Please try again.');
    }
  };

  const handleMarkAsSent = async () => {
    const toMark = mergedInvoices.filter((inv) => selectedRows.includes(inv.id) && inv.pdfPath);
    if (toMark.length === 0) {
      alert('No generated invoices selected to mark as sent.');
      return;
    }
    try {
      for (const inv of toMark) {
        const response = await fetch(`${API_BASE}/invoices/mark-sent/${inv.id}`, { method: 'PUT' });
        if (!response.ok) throw new Error(`Failed to mark invoice ${inv.id} as sent`);
      }
      await fetchGeneratedInvoices();
      alert('Invoices marked as sent successfully.');
    } catch (err) {
      console.error('Mark as sent failed:', err);
      alert('Failed to mark invoice(s) as sent. Please try again.');
    }
  };

  const handleRegenerate = async () => {
    const toRegenerate = mergedInvoices.filter((inv) => selectedRows.includes(inv.id) && inv.pdfPath);
    if (toRegenerate.length === 0) {
      alert('No generated invoices selected to regenerate.');
      return;
    }

    try {
      for (const inv of toRegenerate) {
        const response = await fetch(`${API_BASE}/invoices/regenerate/${inv.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to regenerate invoice ${inv.id}: ${errorData.error}`);
        }
      }
      await fetchGeneratedInvoices();
      alert(`${toRegenerate.length} invoice(s) regenerated successfully.`);
    } catch (err) {
      console.error('Regenerate invoice failed:', err);
      alert('Failed to regenerate invoice(s). Please try again.');
    }
  };

  const handleViewInvoice = (filePath) => {
    window.open(`${API_BASE}/invoices/view/${filePath}`, '_blank');
  };

  useEffect(() => {
    setAllSelected(selectedRows.length === mergedInvoices.length && mergedInvoices.length > 0);
  }, [selectedRows, mergedInvoices]);

  const handleRowSelect = (checked, rowId) => {
    setSelectedRows((prev) =>
      checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
    );
  };

  const handleSelectAll = (checked) => {
    setAllSelected(checked);
    setSelectedRows(checked ? mergedInvoices.map((m) => m.id || m.clientId) : []);
  };

  const hasNonGeneratedSelected = selectedRows.some((rowId) => {
    const inv = mergedInvoices.find((i) => (i.id || i.clientId) === rowId);
    return inv && !inv.id;
  });

  const onlyGeneratedSelected = selectedRows.some((rowId) => {
    const inv = mergedInvoices.find((i) => i.id === rowId);
    return inv && inv.id;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <Card className="w-full rounded-4xl shadow-sm bg-white border-white h-28">
        <CardHeader className="flex flex-row items-center justify-between px-7 py-7">
          <h2 className="text-2xl font-normal text-black">
            FY: {selectedYear ? `${selectedYear}-${parseInt(selectedYear) + 1}` : 'Select Year'}
          </h2>
          <div className="flex items-center gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40 rounded-full border-gray-300">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                {fiscalMonths.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card className="w-full bg-white border-white rounded-3xl shadow-sm">
        <CardContent className="p-7">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[24px] font-normal text-[#272727]">Generated Invoices</h2>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                disabled={!onlyGeneratedSelected}
                className="bg-white text-[#048DFF] hover:bg-[#048DFF] hover:text-white border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </Button>
              <Button
                onClick={handleMarkAsSent}
                disabled={!onlyGeneratedSelected}
                className="bg-white text-[#048DFF] hover:bg-[#048DFF] hover:text-white border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mark as Sent
              </Button>
              <Button
                onClick={handleRegenerate}
                disabled={!onlyGeneratedSelected}
                className="bg-white text-[#048DFF] hover:bg-[#048DFF] hover:text-white border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Re-generate
              </Button>
              <Button
                onClick={handleGenerateInvoice}
                disabled={!hasNonGeneratedSelected}
                className="bg-white text-[#048DFF] hover:bg-[#048DFF] hover:text-white border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Invoice(s)
              </Button>
            </div>
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
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
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
                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white"
                      />
                    </td>
                    <td className="p-3 text-center">{invoice.clientName}</td>
                    <td className="p-3 text-center">
                      {invoice.id ? `${invoice.currencyCode} ${invoice.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                    </td>
                    <td className="p-3 text-center">
                      {invoice.generatedOn ? new Date(invoice.generatedOn).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-3 text-center">
                      {invoice.year && invoice.month
                        ? `${fiscalMonths.find((m) => m.value === invoice.month)?.label} ${invoice.year}`
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

export default GenerateInvoicePage;