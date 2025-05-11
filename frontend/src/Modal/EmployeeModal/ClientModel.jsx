import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


const ClientModal = ({ open, onClose, initialData, clientList = [] }) => {
  const [formData, setFormData] = useState({
    ClientName: '',
    Abbreviation: '',
    ContactPerson: '',
    Email: '',
    RegisteredAddress: '',
    BillingCurrencyID: '',
    OrganisationID: '',
    BankDetailID: '',
  });

  const [currencies, setCurrencies] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);

  const API_BASE_URL = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currenciesRes, orgsRes, bankRes] = await Promise.all([
          fetch(`${API_BASE_URL}/currencies`),
          fetch(`${API_BASE_URL}/organisations`),
          fetch(`${API_BASE_URL}/bank-details/all`)
        ]);

        if (!currenciesRes.ok || !orgsRes.ok || !bankRes.ok) {
          throw new Error('Failed to fetch dropdown data');
        }

        setCurrencies(await currenciesRes.json());
        setOrganisations(await orgsRes.json());
        setBankDetails(await bankRes.json());
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        alert('Error fetching dropdown data');
      }
    };

    if (open) fetchData();
  }, [open]);

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        ClientName: initialData.ClientName || '',
        Abbreviation: initialData.Abbreviation || '',
        ContactPerson: initialData.ContactPerson || '',
        Email: initialData.Email || '',
        RegisteredAddress: initialData.RegisteredAddress || '',
        BillingCurrencyID: initialData.BillingCurrencyID || '',
        OrganisationID: initialData.OrganisationID || '',
        BankDetailID: initialData.BankDetailID || '',
      });
    } else {
      resetForm();
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = initialData
        ? `${API_BASE_URL}/clients/${initialData.id}`
        : `${API_BASE_URL}/clients`;

      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit');
      }

      onClose(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.message.includes('not found')) alert('Client not found');
      else if (error.message.includes('already exists')) alert('Client with this name or abbreviation already exists');
      else if (error.message.includes('Validation')) alert('Please fill all required fields');
      else alert(`Error submitting form: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      ClientName: '',
      Abbreviation: '',
      ContactPerson: '',
      Email: '',
      RegisteredAddress: '',
      BillingCurrencyID: '',
      OrganisationID: '',
      BankDetailID: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose(null)}>
      <DialogContent className="max-w-3xl border-none bg-white p-6">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <DialogDescription>
            Fill out the form to {initialData ? 'update' : 'add a new'} client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            placeholder="Client Name *"
            name="ClientName"
            value={formData.ClientName}
            onChange={handleChange}
            required
            className="col-span-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Abbreviation *"
            name="Abbreviation"
            value={formData.Abbreviation}
            onChange={handleChange}
            required
            className="col-span-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Contact Person *"
            name="ContactPerson"
            value={formData.ContactPerson}
            onChange={handleChange}
            required
            className="col-span-1 p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email *"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
            className="col-span-1 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Registered Address *"
            name="RegisteredAddress"
            value={formData.RegisteredAddress}
            onChange={handleChange}
            required
            className="col-span-2 p-2 border rounded"
          />

          {/* Billing Currency Select */}
          <div className="col-span-1">
            <Select
              value={formData.BillingCurrencyID}
              onValueChange={(val) => handleSelectChange('BillingCurrencyID', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Billing Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.CurrencyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Detail Select */}
          <div className="col-span-1">
            <Select
              value={formData.BankDetailID}
              onValueChange={(val) => handleSelectChange('BankDetailID', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Bank Detail" />
              </SelectTrigger>
              <SelectContent>
                {bankDetails.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.BankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          

          {/* Organisation Select */}
          <div className="col-span-2">
            <Select
              value={formData.OrganisationID}
              onValueChange={(val) => handleSelectChange('OrganisationID', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Organisation" />
              </SelectTrigger>
              <SelectContent>
                {organisations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.Abbreviation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="col-span-2 mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {initialData ? 'Update Client' : 'Add Client'}
            </button>
          </DialogFooter>
        </form>

        
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal;
