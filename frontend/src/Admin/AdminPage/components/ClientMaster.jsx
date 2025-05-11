import React, { useState, useEffect } from 'react';
import ClientTable from '@/Admin/ClientTable/ClientTable';
import ClientModal from '@/Modal/EmployeeModal/ClientModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001/api/clients'; // Adjust if your backend uses a different port

const ClientMaster = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [query, setQuery] = useState('');

  const fetchClients = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch clients');
      const fetchedClients = await response.json();
      setClients(fetchedClients);
      setFilteredClients(fetchedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Error fetching clients');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = async (value) => {
    setQuery(value);
    try {
      if (value.trim() === '') {
        setFilteredClients(clients); // Show all clients if query is empty
      } else {
        const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(value)}`);
        if (!response.ok) throw new Error('Failed to search clients');
        const searchedClients = await response.json();
        setFilteredClients(searchedClients);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      alert('Error searching clients');
    }
  };

  const handleOpenModal = () => {
    setSelectedClient(null);
    setModalOpen(true);
  };

  const handleCloseModal = async (newClient) => {
    setModalOpen(false);
    if (newClient) {
      try {
        if (selectedClient) {
          // Update existing client
          const response = await fetch(`${API_BASE_URL}/${selectedClient.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient),
          });
          if (!response.ok) throw new Error('Failed to update client');
          alert('Client updated successfully');
        } else {
          // Create new client
          const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newClient),
          });
          if (!response.ok) throw new Error('Failed to create client');
          alert('Client created successfully');
        }
        await fetchClients(); // Refresh client list
      } catch (error) {
        console.error('Error saving client:', error);
        if (error.message.includes('Client with the same name already exists')) {
          alert('Client with the same name already exists');
        } else {
          alert(`Error saving client: ${error.message}`);
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
        const response = await fetch(`${API_BASE_URL}/${clientId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete client');
        alert('Client and associated resources deleted successfully');
        await fetchClients(); // Refresh client list
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('An error occurred while deleting the client.');
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
            <Button className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-3xl px-6 py-2 transition-all" onClick={handleOpenModal}>Add Client</Button>
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