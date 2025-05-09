import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResourceModal from "../../Modal/EmployeeModal/ResourceModal";

// Dummy data to resolve undefined errors
const dummyClient = {
  ClientName: "Acme Corp",
  Abbreviation: "ACME",
  ContactPerson: "John Doe",
  Email: "john@acme.com",
  RegisteredAddress: "123 Acme St, Springfield",
  BillingCurrency: {
    CurrencyName: "USD",
    CurrencyCode: "USD"
  },
  Organisation: {
    OrganisationName: "Acme Corporation"
  },
  BankDetail: {
    BankName: "Bank of Springfield"
  }
};

// Updated dummyResources to match EmployeeMaster.jsx structure
const initialResources = [
  {
    id: 1,
    Employee: {
      FirstName: "John",
      LastName: "Doe",
      EmpCode: "EMP001",
      Role: { RoleName: "Manager" },
      Level: { LevelName: "Senior" },
      Organisation: { Abbreviation: "XYZ" }
    },
    StartDate: new Date("2024-01-01"),
    EndDate: new Date("2024-12-31"),
    MonthlyBilling: 5000,
    Status: "Active",
    EmployeeID: "1"
  },
  {
    id: 2,
    Employee: {
      FirstName: "Jane",
      LastName: "Smith",
      EmpCode: "EMP002",
      Role: { RoleName: "Developer" },
      Level: { LevelName: "Mid" },
      Organisation: { Abbreviation: "ABC" }
    },
    StartDate: new Date("2023-06-01"),
    EndDate: new Date("2024-06-01"),
    MonthlyBilling: 3000,
    Status: "Inactive",
    EmployeeID: "2"
  },
  {
    id: 3,
    Employee: {
      FirstName: "Samuel",
      LastName: "Lee",
      EmpCode: "EMP003",
      Role: { RoleName: "Designer" },
      Level: { LevelName: "Junior" },
      Organisation: { Abbreviation: "TS" }
    },
    StartDate: new Date("2023-09-01"),
    EndDate: new Date("2024-09-01"),
    MonthlyBilling: 2500,
    Status: "Active",
    EmployeeID: "3"
  }
];

const ClientDetails = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resources, setResources] = useState(initialResources);
  const navigate = useNavigate();
  const filteredResources = resources.filter(r => r.Status === activeTab);
  const formatDate = (date) => date.toISOString().split('T')[0];

  const handleEditResource = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleResourceSubmit = (payload) => {
    console.log('Resource updated:', payload);
    // TODO: Implement actual update logic (e.g., API call or state update)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  const handleDeleteResource = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      setResources(resources.filter(r => r.id !== resourceId));
      console.log(`Resource ${resourceId} deleted`);
    }
  };

  const handleDeleteClient = () => {
    if (window.confirm('Are you sure you want to delete this client and all associated resources?')) {
      console.log('Client deleted:', dummyClient.ClientName);
      navigate('/admin');
    }
  };

  return (
    <div className="p-6 space-y-6  min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          {`${dummyClient.ClientName} (${dummyClient.Abbreviation})`}
        </h2>
        <div className="space-x-2">
          <Button
            onClick={() => navigate('/admin')}
            className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
          >
            Back to Client Master
          </Button>
          {/* Optional: Additional Delete Client button in header, commented out unless needed */}
          {/* <Button
            variant="destructive"
            className="rounded-3xl px-6 py-2"
            onClick={handleDeleteClient}
          >
            Delete Client
          </Button> */}
        </div>
      </div>

      {/* Client Details Section */}
      <div className="bg-white shadow p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#9DA4B3] pb-4">
          <h3 className="text-[24px] text-[#272727]">Client Details</h3>
          <div className="space-x-2">
            <Button
              className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
              onClick={handleDeleteClient}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Company name</p>
            <p>{dummyClient.ClientName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Abbreviation</p>
            <p>{dummyClient.Abbreviation}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Contact person</p>
            <p>{dummyClient.ContactPerson}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p>{dummyClient.Email}</p>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-b border-[#9DA4B3] my-2"></div>

        {/* Second Row */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Registered address</p>
            <p>{dummyClient.RegisteredAddress}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Billing currency</p>
            <p>{dummyClient.BillingCurrency.CurrencyName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payee Name</p>
            <p>{dummyClient.Organisation.OrganisationName}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Bank Details</p>
            <p>{dummyClient.BankDetail.BankName}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center pb-4">
          <h3 className="text-[24px] text-[#272727]">Resources Assigned</h3>
          <div className="flex gap-2">
            <div className="flex  gap-2">
              <Button
                onClick={() => setActiveTab('Active')}
                variant={activeTab === 'Active'  }
                className={activeTab === 'Active' ? 'border-none text-black' : ''}
              >
                Active Resources
              </Button>
              <Button
                onClick={() => setActiveTab('Inactive')}
                variant={activeTab === 'Inactive' }
                className={activeTab === 'Inactive' ? 'text-black ' : ''}
              >
                Inactive Resources
              </Button>
            </div>
            <Button className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">
              Add Resource
            </Button>
          </div>
        </div>

        {/* Divider Line Between Tabs and Table */}
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
                <TableCell>{`${r.Employee.FirstName} ${r.Employee.LastName}`}</TableCell>
                <TableCell>{r.Employee.EmpCode}</TableCell>
                <TableCell>{r.Employee.Role.RoleName}</TableCell>
                <TableCell>{r.Employee.Level.LevelName}</TableCell>
                <TableCell>{r.Employee.Organisation.Abbreviation}</TableCell>
                <TableCell>{formatDate(r.StartDate)}</TableCell>
                <TableCell>{formatDate(r.EndDate)}</TableCell>
                <TableCell>{`${dummyClient.BillingCurrency.CurrencyCode} ${r.MonthlyBilling}`}</TableCell>
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
        open={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedResource}
        onSubmit={handleResourceSubmit}
      />
    </div>
  );
};

export default ClientDetails;