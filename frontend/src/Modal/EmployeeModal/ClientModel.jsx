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

const ClientModal = ({ open, onClose, initialData, onSubmit }) => {
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

        const currenciesData = await currenciesRes.json();
        const orgsData = await orgsRes.json();
        const bankData = await bankRes.json();
        
        setCurrencies(currenciesData);
        setOrganisations(orgsData);
        setBankDetails(bankData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        alert('Error fetching dropdown data');
      }
    };

    if (open) fetchData();
  }, [open]);

  useEffect(() => {
    if (open && initialData) {
      // Convert IDs to strings to ensure consistent comparison
      setFormData({
        ClientName: initialData.ClientName || '',
        Abbreviation: initialData.Abbreviation || '',
        ContactPerson: initialData.ContactPerson || '',
        Email: initialData.Email || '',
        RegisteredAddress: initialData.RegisteredAddress || '',
        BillingCurrencyID: initialData.BillingCurrencyID ? String(initialData.BillingCurrencyID) : 
                         (initialData.BillingCurrency?.id ? String(initialData.BillingCurrency.id) : ''),
        OrganisationID: initialData.OrganisationID ? String(initialData.OrganisationID) : 
                       (initialData.Organisation?.id ? String(initialData.Organisation.id) : ''),
        BankDetailID: initialData.BankDetailID ? String(initialData.BankDetailID) : 
                     (initialData.BankDetail?.id ? String(initialData.BankDetail.id) : ''),
      });
      
      console.log("Setting initial data in modal:", formData);
    } else {
      resetForm();
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    setFormData((prev) => ({ ...prev, [field]: String(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    
    // Pass the formData to the parent component
    onClose(formData);
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
          <DialogTitle>{initialData?.id ? 'Edit Client' : 'Add Client'}</DialogTitle>
          <DialogDescription>
            Fill out the form to {initialData?.id ? 'update' : 'add a new'} client.
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
              value={formData.BillingCurrencyID || ""}
              onValueChange={(val) => handleSelectChange('BillingCurrencyID', val)}
            >
              <SelectTrigger className="w-full p-2 border rounded">
                <SelectValue placeholder="Select Billing Currency" />
              </SelectTrigger>
              <SelectContent className='border-none bg-white'>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={String(currency.id)}>
                    {currency.CurrencyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bank Detail Select */}
          <div className="col-span-1">
            <Select
              value={formData.BankDetailID || ""}
              onValueChange={(val) => handleSelectChange('BankDetailID', val)}
            >
              <SelectTrigger className="w-full p-2 border rounded">
                <SelectValue placeholder="Select Bank Detail" />
              </SelectTrigger>
              <SelectContent className='border-none bg-white'>
                {bankDetails.map((bank) => (
                  <SelectItem key={bank.id} value={String(bank.id)}>
                    {bank.BankName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Organisation Select */}
          <div className="col-span-2">
            <Select
              value={formData.OrganisationID || ""}
              onValueChange={(val) => handleSelectChange('OrganisationID', val)}
            >
              <SelectTrigger className="w-full p-2 border rounded">
                <SelectValue placeholder="Select Organisation" />
              </SelectTrigger>
              <SelectContent className='border-none bg-white'>
                {organisations.map((org) => (
                  <SelectItem key={org.id} value={String(org.id)}>
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
              {initialData?.id ? 'Update Client' : 'Add Client'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal;