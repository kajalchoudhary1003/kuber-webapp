import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ResourceModal from "../../Modal/EmployeeModal/ResourceModal";
import ClientModal from "../../Modal/EmployeeModal/ClientModel";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Active");
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [client, setClient] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5001/api";

  // Fetch client and resources
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch client details
        const clientResponse = await fetch(`${API_BASE_URL}/clients/${id}`);
        if (!clientResponse.ok) throw new Error("Failed to fetch client");
        const clientData = await clientResponse.json();
        setClient(clientData);

        // Fetch resources
        const resourcesResponse = await fetch(`${API_BASE_URL}/client-employees/client/${id}`);
        if (!resourcesResponse.ok) throw new Error("Failed to fetch resources");
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredResources = resources.filter((r) => r.Status === activeTab);

  const formatDate = (date) => (date ? new Date(date).toISOString().split("T")[0] : "N/A");

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsResourceModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setSelectedResource({ ...resource, ClientID: id });
    setIsResourceModalOpen(true);
  };

  const handleResourceSubmit = async (payload) => {
    try {
      if (payload.delete) {
        // Delete resource
        const response = await fetch(`${API_BASE_URL}/client-employees/${selectedResource.id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete resource");
        setResources((prev) => prev.filter((r) => r.id !== selectedResource.id));
      } else {
        if (selectedResource && selectedResource.id) {
          // Update resource
          const response = await fetch(`${API_BASE_URL}/client-employees/${selectedResource.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error("Failed to update resource");
          const updatedResource = await response.json();
          setResources((prev) =>
            prev.map((r) => (r.id === selectedResource.id ? updatedResource : r))
          );
        } else {
          // Create resource
          const response = await fetch(`${API_BASE_URL}/client-employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, ClientID: id }),
          });
          if (!response.ok) throw new Error("Failed to create resource");
          const newResource = await response.json();
          setResources((prev) => [...prev, newResource]);
        }
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
    setIsResourceModalOpen(false);
    setSelectedResource(null);
  };

  const handleCloseResourceModal = () => {
    setIsResourceModalOpen(false);
    setSelectedResource(null);
  };

  const handleEditClient = () => {
    setIsClientModalOpen(true);
  };

  const handleClientSubmit = async (updatedClientData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClientData),
      });
      if (!response.ok) throw new Error("Failed to update client");
      const updatedClient = await response.json();
      setClient(updatedClient);
    } catch (err) {
      alert(`Error updating client: ${err.message}`);
    }
    setIsClientModalOpen(false);
  };

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/client-employees/${resourceId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete resource");
        setResources((prev) => prev.filter((r) => r.id !== resourceId));
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleDeleteClient = async () => {
    if (window.confirm("Are you sure you want to delete this client and all associated resources?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to delete client");
        navigate("/admin");
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!client) return <div className="p-4">Client not found</div>;

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          {`${client.ClientName} (${client.Abbreviation})`}
        </h2>
        <div className="space-x-2">
          <Button
            onClick={() => navigate("/admin")}
            className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
          >
            Back to Client Master
          </Button>
        </div>
      </div>

      {/* Client Details */}
      <div className="bg-white shadow p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#9DA4B3] pb-4">
          <h3 className="text-[24px] text-[#272727]">Client Details</h3>
          <div className="space-x-2">
            <Button onClick={handleEditClient} className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">
              Edit
            </Button>
            <Button variant="destructive" className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all" onClick={handleDeleteClient}>
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Company name</p>
            <p>{client.ClientName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Abbreviation</p>
            <p>{client.Abbreviation}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Contact person</p>
            <p>{client.ContactPerson}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p>{client.Email}</p>
          </div>
        </div>

        <div className="border-b border-[#9DA4B3] my-2"></div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Registered address</p>
            <p>{client.RegisteredAddress}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Billing currency</p>
            <p>{client.BillingCurrency?.CurrencyName || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payee Name</p>
            <p>{client.Organisation?.Abbreviation || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Bank Details</p>
            <p>{client.BankDetail?.BankName || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Resources Assigned */}
      <div className="bg-white shadow p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-[24px] text-[#272727]">Resources Assigned</h3>
          <div className="flex gap-2">
            <Button onClick={() => setActiveTab("Active")} className={activeTab === "Active" ? "border-none text-black" : ""}>
              Active Resources
            </Button>
            <Button onClick={() => setActiveTab("Inactive")} className={activeTab === "Inactive" ? "text-black" : ""}>
              Inactive Resources
            </Button>
            <Button onClick={handleAddResource} className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">
              Add Resource
            </Button>
          </div>
        </div>

        <div className="border-b border-[#9DA4B3] my-2"></div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Emp. Code</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Billing/M</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResources.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.Employee?.EmployeeName || "N/A"}</TableCell>
                <TableCell>{r.Employee?.EmployeeCode || "N/A"}</TableCell>
                <TableCell>{r.Employee?.Role?.RoleName || "N/A"}</TableCell>
                <TableCell>{r.Employee?.Level?.LevelName || "N/A"}</TableCell>
                <TableCell>{r.Employee?.Organisation?.Abbreviation || "N/A"}</TableCell>
                <TableCell>{formatDate(r.StartDate)}</TableCell>
                <TableCell>{formatDate(r.EndDate)}</TableCell>
                <TableCell>{`${client.BillingCurrency?.CurrencyName || "N/A"} ${r.MonthlyBilling}`}</TableCell>
                <TableCell className="text-blue-500">{r.Status}</TableCell>
                <TableCell className="flex gap-2">
                  <button onClick={() => handleEditResource(r)}>
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button onClick={() => handleDeleteResource(r.id)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ResourceModal
        open={isResourceModalOpen}
        onClose={handleCloseResourceModal}
        initialData={selectedResource}
        onSubmit={handleResourceSubmit}
      />

      <ClientModal
        open={isClientModalOpen}
        onClose={handleCloseClientModal}
        initialData={client}
        onSubmit={handleClientSubmit}
      />
    </div>
  );
};

export default ClientDetails;