import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@/Admin/SearchBar/SearchBar';
import EmployeeTable from '@/Admin/EmployeeTable/EmployeeTable';
import EmployeeModal from '@/Modal/EmployeeModal/EmployeeModal';
import RoleModal from '@/Modal/EmployeeModal/RoleModal';
import LevelModal from '@/Modal/EmployeeModal/LevelModal';
import OrganisationModal from '@/Modal/EmployeeModal/OrganisationModal';
import { Button } from '@/components/ui/button';
import { Pagination } from 'antd'; // Use antd Pagination
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const API_BASE_URL = 'http://localhost:5001/api';

// Simple in-memory cache
const cache = {
  roles: {},
  levels: {},
  organisations: {},
};

const EmployeeMaster = () => {
  const [allEmployees, setAllEmployees] = useState([]); // Store all employees
  const [filteredEmployees, setFilteredEmployees] = useState([]); // Displayed employees (paginated)
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [clientAssignments, setClientAssignments] = useState({});
  const [clientErrors, setClientErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [orgModalOpen, setOrgModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    fetchAllEmployees();
    fetchRolesLevelsOrgs();
  }, []);

  useEffect(() => {
    applySearchAndPagination();
  }, [page, searchQuery, allEmployees]);

  const fetchAllEmployees = async () => {
    setLoading(true);
    try {
      // Fetch all employees (adjust limit if needed)
      const response = await axios.get(`${API_BASE_URL}/employees`, {
        params: { page: 1, limit: 1000 }, // Large limit to get all employees
      });
      const fetchedEmployees = response.data.employees;
      setAllEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees.slice(0, limit)); // Initial page
      setTotalEmployees(response.data.total);
      await fetchClientAssignmentsForEmployees(fetchedEmployees);
    } catch (err) {
      setError('Error fetching employees');
      console.error('Error fetching employees:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack,
      });
      toast.error(err.response?.data?.error || 'Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientAssignmentsForEmployees = async (employees) => {
    const assignments = {};
    const errors = {};
    await Promise.all(
      employees.map(async (employee) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/employees/${employee.id}/clients`);
          const activeAssignments = response.data.filter((assignment) => assignment.Status === 'Active');
          assignments[employee.id] = activeAssignments;
        } catch (err) {
          console.error(`Error fetching clients for employee ${employee.id}:`, {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
            url: `${API_BASE_URL}/employees/${employee.id}/clients`,
          });
          assignments[employee.id] = [];
          errors[employee.id] = err.response?.status === 404
            ? 'Client assignments not found'
            : `Error: ${err.message} (Status: ${err.response?.status})`;
        }
      })
    );
    setClientAssignments(assignments);
    setClientErrors(errors);
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
    } catch (err) {
      console.error('Error fetching roles, levels, or organisations:', err);
      toast.error('Error fetching roles, levels, or organisations');
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

  const applySearchAndPagination = () => {
    let result = allEmployees;

    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      result = allEmployees.filter((employee) => {
        // Search by FirstName, LastName, EmpCode, Email
        const matchesEmployee =
          (employee.FirstName && employee.FirstName.toLowerCase().includes(queryLower)) ||
          (employee.LastName && employee.LastName.toLowerCase().includes(queryLower)) ||
          (employee.EmpCode && employee.EmpCode.toLowerCase().includes(queryLower)) ||
          (employee.Email && employee.Email.toLowerCase().includes(queryLower));

        // Search by client names
        const clientNames = clientAssignments[employee.id]?.map((assignment) =>
          assignment.Client?.ClientName?.toLowerCase() || ''
        ) || [];
        const matchesClient = clientNames.some((name) => name.includes(queryLower));

        return matchesEmployee || matchesClient;
      });
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedEmployees = result.slice(startIndex, startIndex + limit);
    setFilteredEmployees(paginatedEmployees);
    setTotalEmployees(result.length);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleOpenModal = (employee = null, mode = 'create') => {
    setSelectedEmployee(employee);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleOpenRoleModal = (role = null, mode = 'create') => {
    setSelectedRole(role);
    setModalMode(mode);
    setRoleModalOpen(true);
  };

  const handleOpenLevelModal = (level = null, mode = 'create') => {
    setSelectedLevel(level);
    setModalMode(mode);
    setLevelModalOpen(true);
  };

  const handleOpenOrgModal = (org = null, mode = 'create') => {
    setSelectedOrg(org);
    setModalMode(mode);
    setOrgModalOpen(true);
  };

  const handleCloseModal = async (newEmployee) => {
    setModalOpen(false);
    setSelectedEmployee(null);
    if (newEmployee) {
      try {
        if (selectedEmployee) {
          await axios.put(`${API_BASE_URL}/employees/${selectedEmployee.id}`, newEmployee);
          toast.success('Employee updated successfully');
          // Update allEmployees
          setAllEmployees((prev) =>
            prev.map((emp) => (emp.id === selectedEmployee.id ? { ...emp, ...newEmployee } : emp))
          );
        } else {
          const response = await axios.post(`${API_BASE_URL}/employees`, newEmployee);
          toast.success('Employee created successfully');
          // Add new employee to allEmployees
          setAllEmployees((prev) => [...prev, response.data]);
        }
      } catch (err) {
        console.error('Error saving employee:', err);
        setError('Error saving employee');
        toast.error('Error saving employee');
      }
    }
  };

  const handleCloseRoleModal = async (roleData) => {
    setRoleModalOpen(false);
    setSelectedRole(null);
    if (roleData) {
      try {
        if (selectedRole) {
          await axios.put(`${API_BASE_URL}/roles/${selectedRole.id}`, roleData);
          toast.success('Role updated successfully');
        } else {
          await axios.post(`${API_BASE_URL}/roles`, roleData);
          toast.success('Role created successfully');
        }
        fetchRolesLevelsOrgs();
      } catch (err) {
        console.error('Error saving role:', err);
        setError('Error saving role');
        toast.error('Error saving role');
      }
    }
  };

  const handleCloseLevelModal = async (levelData) => {
    setLevelModalOpen(false);
    setSelectedLevel(null);
    if (levelData) {
      try {
        if (selectedLevel) {
          await axios.put(`${API_BASE_URL}/levels/${selectedLevel.id}`, levelData);
          toast.success('Level updated successfully');
        } else {
          await axios.post(`${API_BASE_URL}/levels`, levelData);
          toast.success('Level created successfully');
        }
        fetchRolesLevelsOrgs();
      } catch (err) {
        console.error('Error saving level:', err);
        setError('Error saving level');
        toast.error('Error saving level');
      }
    }
  };

  const handleCloseOrgModal = async (orgData) => {
    setOrgModalOpen(false);
    setSelectedOrg(null);
    if (orgData) {
      try {
        if (selectedOrg) {
          await axios.put(`${API_BASE_URL}/organisations/${selectedOrg.id}`, orgData);
          toast.success('Organisation updated successfully');
        } else {
          await axios.post(`${API_BASE_URL}/organisations`, orgData);
          toast.success('Organisation created successfully');
        }
        fetchRolesLevelsOrgs();
      } catch (err) {
        console.error('Error saving organisation:', err);
        setError('Error saving organisation');
        toast.error('Error saving organisation');
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`${API_BASE_URL}/employees/${employeeId}`);
      toast.success('Employee deleted successfully');
      // Remove employee from allEmployees
      setAllEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
    } catch (err) {
      console.error('Error deleting employee:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.error || 'Error deleting employee';
      if (errorMessage === 'Cannot delete employee with active client assignments') {
        toast.error('Employee cannot be deleted with active clients');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Custom render function for Pagination to show only current page
  const paginationItemRender = (page, type, originalElement) => {
    if (type === 'page') {
      // Only show the current page number
      if (page === currentPage) {
        return originalElement;
      }
      return null; // Hide other page numbers
    }
    // Show Previous and Next buttons
    if (type === 'prev' || type === 'next') {
      return originalElement;
    }
    return originalElement;
  };

  const currentPage = page; // For use in itemRender

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="">
      <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-[24px] text-[#272727]">Employee Master</h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <Button 
              onClick={() => handleOpenModal()}
             className="bg-[#048DFF] cursor-pointer text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all"
            >
              Create Employee
            </Button>
          </div>
        </div>

        {filteredEmployees.length > 0 ? (
          <>
            <EmployeeTable
              data={filteredEmployees}
              onEdit={handleOpenModal}
              onDelete={handleDeleteEmployee}
              roles={roles}
              levels={levels}
              organisations={organisations}
              fetchRoleById={fetchRoleById}
              fetchLevelById={fetchLevelById}
              fetchOrganisationById={fetchOrganisationById}
              clientAssignments={clientAssignments}
              clientErrors={clientErrors}
            />
            <div className="mt-8 flex justify-center">
              <Pagination
                current={page}
                total={totalEmployees}
                pageSize={limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                itemRender={paginationItemRender} // Custom render to show only current page
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500 text-lg">No employees found.</div>
        )}

        <EmployeeModal
          open={modalOpen}
          onClose={handleCloseModal}
          roles={roles}
          levels={levels}
          organisations={organisations}
          initialData={selectedEmployee}
        />
        <RoleModal
          open={roleModalOpen}
          onClose={handleCloseRoleModal}
          mode={modalMode}
          initialData={selectedRole}
          onSubmit={handleCloseRoleModal}
        />
        <LevelModal
          open={levelModalOpen}
          onClose={handleCloseLevelModal}
          mode={modalMode}
          initialData={selectedLevel}
          onSubmit={handleCloseLevelModal}
        />
        <OrganisationModal
          open={orgModalOpen}
          onClose={handleCloseOrgModal}
          mode={modalMode}
          initialData={selectedOrg}
          onSubmit={handleCloseOrgModal}
        />
        <ToastContainer />
      </div>
    </div>
  );
};

export default EmployeeMaster;