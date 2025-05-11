// EmployeeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeModal from '../../Modal/EmployeeModal/EmployeeModal';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const API_BASE_URL = 'http://localhost:5001/api'; // Update port if different

const cache = {
  roles: {},
  levels: {},
  organisations: {},
};

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
  const [clientAssignments, setClientAssignments] = useState([]);
  const [roleName, setRoleName] = useState('Loading...');
  const [levelName, setLevelName] = useState('Loading...');
  const [orgAbbreviation, setOrgAbbreviation] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientError, setClientError] = useState(null);

  useEffect(() => {
    fetchEmployee();
    fetchRolesLevelsOrgs();
    fetchClientAssignments();
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
      setEmployee(response.data);
      if (response.data.RoleID) {
        const role = await fetchRoleById(response.data.RoleID);
        setRoleName(role ? role.RoleName : 'N/A');
      } else {
        setRoleName('N/A');
      }
      if (response.data.LevelID) {
        const level = await fetchLevelById(response.data.LevelID);
        setLevelName(level ? level.LevelName : 'N/A');
      } else {
        setLevelName('N/A');
      }
      if (response.data.OrganisationID) {
        const org = await fetchOrganisationById(response.data.OrganisationID);
        setOrgAbbreviation(org ? org.Abbreviation : 'N/A');
      } else {
        setOrgAbbreviation('N/A');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Error fetching employee');
    } finally {
      setLoading(false);
    }
  };

  const fetchRolesLevelsOrgs = async () => {
    try {
      const [rolesRes, levelsRes, orgsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/roles`),
        axios.get(`${API_BASE_URL}/levels`),
        axios.get(`${API_BASE_URL}/organisations`),
      ]);
      setRoles(rolesRes.data);
      setLevels(levelsRes.data);
      setOrganisations(orgsRes.data);
      rolesRes.data.forEach((role) => (cache.roles[role.id] = role));
      levelsRes.data.forEach((level) => (cache.levels[level.id] = level));
      orgsRes.data.forEach((org) => (cache.organisations[org.id] = org));
    } catch (error) {
      console.error('Error fetching roles, levels, or organisations:', error);
    }
  };

  const fetchRoleById = async (id) => {
    if (cache.roles[id]) return cache.roles[id];
    try {
      const response = await axios.get(`${API_BASE_URL}/roles/${id}`);
      cache.roles[id] = response.data;
      return response.data;
    } catch (err) {
      console.error(`Error fetching role ${id}:`, err);
      return null;
    }
  };

  const fetchLevelById = async (id) => {
    if (cache.levels[id]) return cache.levels[id];
    try {
      const response = await axios.get(`${API_BASE_URL}/levels/${id}`);
      cache.levels[id] = response.data;
      return response.data;
    } catch (err) {
      console.error(`Error fetching level ${id}:`, err);
      return null;
    }
  };

  const fetchOrganisationById = async (id) => {
    if (cache.organisations[id]) return cache.organisations[id];
    try {
      const response = await axios.get(`${API_BASE_URL}/organisations/${id}`);
      cache.organisations[id] = response.data;
      return response.data;
    } catch (err) {
      console.error(`Error fetching organisation ${id}:`, err);
      return null;
    }
  };

  const fetchClientAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/employees/${id}/clients`);
      setClientAssignments(response.data);
      setClientError(null);
    } catch (error) {
      console.error('Error fetching client assignments:', error.response?.status, error.message);
      setClientError(
        `Failed to load client assignments: ${
          error.response?.status === 404 ? 'Client assignments endpoint not found' : error.message
        }`
      );
    }
  };

  const handleDelete = async () => {
    if (employee.Status === 'Active') {
      alert('Active employees cannot be deleted');
      return;
    }
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`${API_BASE_URL}/employees/${id}`);
        navigate('/admin/employee-master');
      } catch (error) {
        console.error('Error deleting employee:', error);
        setError('Error deleting employee');
      }
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const handleModalClose = async (updatedData) => {
    setEditModalOpen(false);
    if (updatedData) {
      try {
        await axios.put(`${API_BASE_URL}/employees/${id}`, updatedData);
        fetchEmployee();
        fetchClientAssignments();
      } catch (error) {
        console.error('Error updating employee:', error);
        setError('Error updating employee');
      }
    }
  };

  const handleBack = () => {
    navigate('/admin/employee-master');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;
  if (!employee) return <div>No employee data found.</div>;

  return (
    <div className="flex flex-col items-center bg-tint-alice-blue p-5">
      <div className="top-bar flex justify-between w-full mb-5">
        <h2 className="text-[24px] text-[#272727]">{`${employee.FirstName} ${employee.LastName}`}</h2>
        <Button
          className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
          onClick={handleBack}
        >
          Back to Employee Master
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-md p-8 w-full mb-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#9DA4B3]">
          <h2 className="text-[24px] text-[#272727]">Employee Details</h2>
          <div className="flex gap-6">
            <Button
              className="bg-[#048DFF] text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
              onClick={handleEdit}
            >
              Edit
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
              <div className="text-[16px] text-black">{roleName}</div>
            </div>
          </div>

          <div className="detail-row flex justify-between mb-4 pb-4 border-b border-[#9DA4B3]">
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Level</label>
              <div className="text-[16px] text-black">{levelName}</div>
            </div>
            <div className="detail-item flex-1 mr-4">
              <label className="text-[14px] text-[#7B7B7B] mb-1">Organisation</label>
              <div className="text-[16px] text-black">{orgAbbreviation}</div>
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

        {clientError ? (
          <div className="text-center text-red-500 py-4">{clientError}</div>
        ) : (
          <Table className="w-full border-b border-[#9DA4B3]">
            <TableHeader className='bg-[#EDEFF2] border-b border-[#9DA4B3]'>
              <TableRow className='border-b border-[#9DA4B3]'>
                
                <TableCell className="py-3 px-1  font-medium text-[16px]">Client Name</TableCell>
                <TableCell className="py-3 px-1 font-medium text-[16px]">Start Date</TableCell>
                <TableCell className="py-3 px-1 font-medium text-[16px]">End Date</TableCell>
                <TableCell className="py-3 px-1 font-medium text-[16px]">Billing Rate</TableCell>
                <TableCell className="py-3 px-1 font-medium text-[16px]">Status</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientAssignments?.length > 0 ? (
                clientAssignments.map((clientEmployee, index) => (
                  <TableRow className="border-b border-[#9DA4B3]" key={clientEmployee.id}>
                    
                    <TableCell className="py-3 px-1 text-[14px]">
                      {clientEmployee.Client?.ClientName || 'N/A'}
                    </TableCell>
                    <TableCell className="py-3 px-1 text-[14px]">
                      {formatDate(clientEmployee.StartDate)}
                    </TableCell>
                    <TableCell className="py-3 px-1 text-[14px]">
                      {formatDate(clientEmployee.EndDate)}
                    </TableCell>
                    <TableCell className="py-3 px-1 text-[14px]">
                      {formatCurrency(clientEmployee.MonthlyBilling, 'INR')}
                    </TableCell>
                    <TableCell className="py-3 px-1 text-[14px]">
                      {clientEmployee.Status}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-3 px-1 text-center text-[14px]">
                    No client assignments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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