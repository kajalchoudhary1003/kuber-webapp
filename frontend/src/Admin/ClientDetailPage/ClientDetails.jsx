import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

const ClientDetail = () => {
  const [activeTab, setActiveTab] = useState('Active');
  const filteredResources = dummyResources.filter(r => r.Status === activeTab);
  const formatDate = (date) => date.toISOString().split('T')[0];

  return (
    <div className="p-6 space-y-6 bg-blue-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">
          {`${dummyClient.ClientName} (${dummyClient.Abbreviation})`}
        </h2>
        <Button className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">
          Back to Client Master
        </Button>
      </div>

      {/* Client Details Section */}
      <div className="bg-white shadow p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#9DA4B3] pb-4">
          <h3 className="text-[24px] text-[#272727]">Client Details</h3>
          <div className="space-x-2">
            <Button className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">
              Edit
            </Button>
            <Button variant="destructive">Delete</Button>
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
            <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)}>
              <Tab label="Active Resources" value="Active" />
              <Tab label="Inactive Resources" value="Inactive" />
            </Tabs>
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
                  <button>
                    <Edit className="w-5 h-5 text-blue-500" />
                  </button>
                  <button>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientDetail;
