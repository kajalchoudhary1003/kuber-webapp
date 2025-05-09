import React, { useState, useEffect } from 'react';
import ClientTable from '@/Admin/ClientTable/ClientTable';
import ClientModal from '@/Modal/EmployeeModal/ClientModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ClientMaster = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [query, setQuery] = useState('');

  const fetchClients = async () => {
    try {
      const fetchedClients = [
        {
          id: 1,
          ClientName: 'Acme Corp',
          ContactPerson: 'John Doe',
          Email: 'john@acme.com',
          RegisteredAddress: '123 Acme St, Springfield',
          BillingCurrency: { CurrencyName: 'USD' }
        },
        {
          id: 2,
          ClientName: 'Globex Inc.',
          ContactPerson: 'Jane Smith',
          Email: 'jane@globex.com',
          RegisteredAddress: '456 Globex Ave, Metropolis',
          BillingCurrency: { CurrencyName: 'EUR' }
        },
        {
          id: 3,
          ClientName: 'Initech',
          ContactPerson: 'Peter Gibbons',
          Email: 'peter@initech.com',
          RegisteredAddress: '789 Initech Rd, Silicon Valley',
          BillingCurrency: { CurrencyName: 'GBP' }
        },
        {
          id: 4,
          ClientName: 'Hooli',
          ContactPerson: 'Gavin Belson',
          Email: 'gavin@hooli.com',
          RegisteredAddress: '100 Hooli Blvd, Palo Alto',
          BillingCurrency: { CurrencyName: 'USD' }
        }
      ];
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Error fetching clients'); // Replaced toast with an alert for simplicity
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    const filtered = clients.filter((client) =>
      client.ClientName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const handleOpenModal = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleCloseModal = async (newClient) => {
    setModalOpen(false);
    if (newClient) {
      try {
        await fetchClients();
        if (selectedClient) {
          alert('Client updated successfully'); // Replaced toast with an alert
        } else {
          alert('Client created successfully'); // Replaced toast with an alert
        }
      } catch (error) {
        if (error.message.includes('Client with the same name already exists')) {
          alert('Client with the same name already exists'); // Replaced toast with an alert
        } else {
          alert('Error fetching clients after update'); // Replaced toast with an alert
        }
      }
    }
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client? This will also delete all associated resources.')) {
      try {
        alert('Client and associated resources deleted successfully'); // Replaced toast with an alert
        fetchClients();
      } catch (error) {
        alert('An error occurred while deleting the client.'); // Replaced toast with an alert
      }
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[24px] text-[#272727]">Client Master</h2>
          <div className="flex gap-4 items-center">
            <div className="max-w-[280px] rounded-full bg-white shadow-sm flex items-center px-3 border border-gray-300">
              <Search className="h-4 w-4 text-gray-500 mr-2" />
              <Input
                type="text"
                placeholder="Search by name"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm"
              />
            </div>
            <Button className="bg-blue-500 text-white  cursor-pointer hover:bg-blue-500/85 rounded-3xl px-6 py-2 transition-all" onClick={handleOpenModal}>Add Client</Button>
          </div>
        </div>

        {filteredClients.length > 0 ? (
          <ClientTable
            data={filteredClients}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
          />
        ) : (
          <p className="text-gray-500">No clients found.</p>
        )}

        <ClientModal
          open={modalOpen}
          onClose={handleCloseModal}
          initialData={selectedClient}
        />
      </div>
    </div>
  );
};

export default ClientMaster;
