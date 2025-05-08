import React, { useState, useEffect } from 'react';

const ClientModal = ({ open, onClose, initialData }) => {
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

  // Base URL for the API
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch currencies
        const currenciesRes = await fetch(`${API_BASE_URL}/currencies`);
        if (!currenciesRes.ok) throw new Error('Failed to fetch currencies');
        const currenciesData = await currenciesRes.json();
        setCurrencies(currenciesData);

        // Fetch organisations
        const orgsRes = await fetch(`${API_BASE_URL}/organisations`);
        if (!orgsRes.ok) throw new Error('Failed to fetch organisations');
        const orgsData = await orgsRes.json();
        setOrganisations(orgsData);

        // Fetch bank details
        const bankRes = await fetch(`${API_BASE_URL}/bank-details/all`);
        if (!bankRes.ok) throw new Error('Failed to fetch bank details');
        const bankData = await bankRes.json();
        setBankDetails(bankData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Populate form with initial data when editing
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // Update existing client
        const response = await fetch(`${API_BASE_URL}/clients/${initialData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update client');
        }
        alert('Client updated successfully');
      } else {
        // Create new client
        const response = await fetch(`${API_BASE_URL}/clients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create client');
        }
        alert('Client created successfully');
      }
      onClose(formData);
    } catch (error) {
      if (error.message.includes('Client with the same name already exists')) {
        alert('Client with the same name already exists');
      } else {
        console.error('Error submitting form:', error);
        alert(error.message || 'Error submitting form');
      }
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-normal text-[#272727]">
            {initialData ? 'Edit Client' : 'Add Client'}
          </h2>
          <button
            onClick={() => onClose(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Client Name *"
              name="ClientName"
              value={formData.ClientName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Contact Person *"
              name="ContactPerson"
              value={formData.ContactPerson}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="BillingCurrencyID"
              value={formData.BillingCurrencyID}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Billing Currency</option>
              {currencies.map((currency) => (
                <option key={currency._id} value={currency._id}>
                  {currency.CurrencyName}
                </option>
              ))}
            </select>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Abbreviation *"
              name="Abbreviation"
              value={formData.Abbreviation}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email *"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Registered Address *"
              name="RegisteredAddress"
              value={formData.RegisteredAddress}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              name="BankDetailID"
              value={formData.BankDetailID}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Bank Detail</option>
              {bankDetails.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.BankName}
                </option>
              ))}
            </select>
          </div>

          {/* Full-width Payee Dropdown */}
          <div className="col-span-2">
            <select
              name="OrganisationID"
              value={formData.OrganisationID}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Payee</option>
              {organisations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.Abbreviation}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all">
            
              {initialData ? 'Update Client' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;
