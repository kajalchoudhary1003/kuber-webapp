import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeModal from '../../Modal/EmployeeModal/EmployeeModal'; // Adjust the path as necessary
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const formatDate = (date) => {
  if (!date || isNaN(new Date(date).getTime())) return 'N/A';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

const formatCurrency = (value, currencyCode = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [organisations, setOrganisations] = useState([]);

  useEffect(() => {
    // Replace these with mock data for now
    const fetchEmployee = async () => {
      try {
        // Replace with mock data
        const fetchedEmployee = {
          FirstName: 'John',
          LastName: 'Doe',
          EmpCode: 'EMP12345',
          Role: { RoleName: 'Software Engineer' },
          Level: { LevelName: 'Junior' },
          Organisation: { Abbreviation: 'ABC Corp' },
          CTCAnnual: 1200000,
          CTCMonthly: 100000,
          ContactNumber: '9876543210',
          Email: 'john.doe@example.com',
          ClientEmployees: [
            {
              Client: { ClientName: 'XYZ Ltd.', BillingCurrency: { CurrencyCode: 'INR' } },
              StartDate: '2023-01-01',
              EndDate: '2023-12-31',
              MonthlyBilling: 50000,
              Status: 'Active'
            }
          ]
        };
        setEmployee(fetchedEmployee);
      } catch (error) {
        console.error('Error fetching employee:', error);
        // No toast, just handle the error silently or log
      }
    };

    const fetchRoles = async () => {
      // Mock roles data
      setRoles(['Admin', 'Manager', 'Software Engineer']);
    };

    const fetchLevels = async () => {
      // Mock levels data
      setLevels(['Junior', 'Mid', 'Senior']);
    };

    const fetchOrganisations = async () => {
      // Mock organisations data
      setOrganisations(['ABC Corp', 'XYZ Ltd']);
    };

    fetchEmployee();
    fetchRoles();
    fetchLevels();
    fetchOrganisations();
  }, [id]);

  const handleDelete = async () => {
    try {
      // Simulate deletion
      navigate('/admin/employee-master');
    } catch (error) {
      // Handle error silently or log
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleModalClose = async (updatedData) => {
    setEditModalOpen(false);
    if (updatedData) {
      // Simulate updating employee data silently
    }
  };

  const handleBack = () => {
    navigate('/admin/employee-master');
  };

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex flex-col items-center bg-tint-alice-blue p-5">
      <div className="top-bar flex justify-between w-full mb-5">
        <h2 className=" text-[24px] text-[#272727]">{`${employee.FirstName} ${employee.LastName}`}</h2>
        <Button
          className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
          onClick={handleDelete}
        >
          Back to Employee Master
        </Button>
      </div>

      <div className=" bg-white rounded-3xl shadow-md p-8 w-full mb-6">
        <div className=" flex justify-between items-center mb-6 pb-4 border-b border-[#9DA4B3]">
          <h2 className="text-[24px] text-[#272727]">Employee Details</h2>
          <div className="flex gap-6">
            <Button
              className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
              onClick={handleEdit}
            >
              edit
            </Button>
            <Button
              className="bg-[#FF6E65] text-white hover:bg-white hover:text-[#FF6E65] hover:border-red-500 border-2 border-[#FF6E65] rounded-3xl px-6 py-2 transition-all"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="employee-detail">
          <div className="detail-row flex justify-between mb-4 pb-4 border-b border-[#9DA4B3]">
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">First name</label>
              <div className="text-[16px] text-black">{employee.FirstName}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Last name</label>
              <div className="text-[16px] text-black">{employee.LastName}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Employee code</label>
              <div className="text-[16px] text-black">{employee.EmpCode}</div>
            </div>
            <div className="detail-item flex-1">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Role</label>
              <div className="text-[16px] text-black">{employee.Role?.RoleName}</div>
            </div>
          </div>

          <div className="detail-row flex justify-between mb-4 pb-4  border-b border-[#9DA4B3]">
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Level</label>
              <div className="text-[16px] text-black">{employee.Level?.LevelName}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Organisation</label>
              <div className="text-[16px] text-black">{employee.Organisation?.Abbreviation}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">CTC (Annual)</label>
              <div className="text-[16px] text-black">{formatCurrency(employee.CTCAnnual)}</div>
            </div>
            <div className="detail-item flex-1">
              <label className="text-[14px] text-[#7B7B7B] mb-1">CTC (Monthly)</label>
              <div className="text-[16px] text-black">{formatCurrency(employee.CTCMonthly)}</div>
            </div>
          </div>

          <div className="detail-row flex justify-between mb-4 pb-4">
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Contact number</label>
              <div className="text-[16px] text-black">{employee.ContactNumber}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Email</label>
              <div className="text-[16px] text-black">{employee.Email}</div>
            </div>
          </div>
        </div>

      </div>

      <div className="projects-card bg-white rounded-2xl shadow-md p-8 w-full">
        <div className="projects-header flex justify-between items-center pb-4 border-b border-[#9DA4B3]">
          <h2 className="text-xl text-primary-federal-blue">Clients</h2>
        </div>

        <Table className=" w-full ">
          <TableHeader>
            <TableRow className="border-b border-[#9DA4B3]">
              <TableCell className="py-3 px-1 text-[16px]">#</TableCell>
              <TableCell className="py-3 px-1 text-[16px]">Client Name</TableCell>
              <TableCell className="py-3 px-1 text-[16px]"> Start Date</TableCell>
              <TableCell className="py-3 px-1 text-[16px]">End Date</TableCell>
              <TableCell className="py-3 px-1 text-[16px]">Billing Rate</TableCell>
              <TableCell className="py-3 px-1 text-[16px]">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee.ClientEmployees?.map((clientEmployee, index) => (
              <TableRow className="border-b border-[#9DA4B3]" key={index} >
                <TableCell className="py-3 px-1 text-[14px]">{index + 1}</TableCell>
                <TableCell className="py-3 px-1 text-[14px]">{clientEmployee.Client.ClientName}</TableCell>
                <TableCell className="py-3 px-1 text-[14px]">{formatDate(clientEmployee.StartDate)}</TableCell>
                <TableCell className="py-3 px-1 text-[14px]">{formatDate(clientEmployee.EndDate)}</TableCell>
                <TableCell className="py-3 px-1 text-[14px]">
                  {clientEmployee.Client.BillingCurrency?.CurrencyCode}{" "}
                  {formatCurrency(clientEmployee.MonthlyBilling)}
                </TableCell>
                <TableCell className="text-lg">{clientEmployee.Status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EmployeeModal
        open={editModalOpen}
        onClose={handleModalClose}
        initialData={employee}
        roles={roles}
        levels={levels}
        organisations={organisations}
      />
    </div>
  );
};

export default EmployeeDetail;
