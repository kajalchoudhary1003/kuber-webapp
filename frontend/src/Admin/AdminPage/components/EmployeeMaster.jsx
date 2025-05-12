import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '@/Admin/SearchBar/SearchBar';
import EmployeeTable from '@/Admin/EmployeeTable/EmployeeTable';
import EmployeeModal from '@/Modal/EmployeeModal/EmployeeModal';
import RoleModal from '@/Modal/EmployeeModal/RoleModal';
import LevelModal from '@/Modal/EmployeeModal/LevelModal';
import OrganisationModal from '@/Modal/EmployeeModal/OrganisationModal';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useYear } from '../../../contexts/YearContexts';

const API_BASE_URL = 'http://localhost:5001/api';

// Simple in-memory cache
const cache = {
  roles: {},
  levels: {},
  organisations: {},
};

const EmployeeMaster = () => {
  const { selectedYear } = useYear();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [clientAssignments, setClientAssignments] = useState({});
  const [clientErrors, setClientErrors] = useState({}); // New state for client fetch errors
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
    fetchEmployees(page);
    fetchRolesLevelsOrgs();
  }, [page]);

  const fetchEmployees = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/employees?page=${page}&limit=${limit}`);
      const fetchedEmployees = response.data.employees;
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
      setTotalEmployees(response.data.total);

      // Fetch client assignments for employees
      await fetchClientAssignmentsForEmployees(fetchedEmployees);

      if (isSearchActive && searchQuery) {
        applySearchFilter(fetchedEmployees, searchQuery);
      }
    } catch (err) {
      setError('Error fetching employees');
      console.error('Error fetching employees:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
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
          assignments[employee.id] = response.data;
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
        } else {
          await axios.post(`${API_BASE_URL}/employees`, { ...newEmployee, year: selectedYear });
          toast.success('Employee created successfully');
        }
        fetchEmployees(page);
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
      fetchEmployees(page);
      toast.success('Employee deleted successfully');
    } catch (err) {
      console.error('Error deleting employee:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      const errorMessage = err.response?.data?.error || 'Error deleting employee';
      setError(errorMessage);
      if (errorMessage === 'Active employees cannot be deleted') {
        toast.error('Active employees cannot be deleted');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Helper function to check if a value contains the search query
  const valueContainsQuery = (value, query) => {
    if (value == null) return false;
    return String(value).toLowerCase().includes(query.toLowerCase());
  };

  // Function to apply search filter
  const applySearchFilter = (employeesList, query) => {
    if (!query.trim()) {
      setFilteredEmployees(employeesList);
      setIsSearchActive(false);
      return;
    }

    setIsSearchActive(true);

    // Log the first employee to see the structure
    if (employeesList.length > 0) {
      console.log('Employee structure for search:', employeesList[0]);
    }

    // Function to check if any value in an object contains the query
    const checkObjectValues = (obj, searchQuery, employeeId) => {
      if (!obj) return false;

      // Check client names for the employee
      const clientNames = clientAssignments[employeeId]?.map((assignment) => assignment.Client?.ClientName || '') || [];
      if (clientNames.some((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return true;
      }

      // Check other object properties
      return Object.values(obj).some((value) => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'object') return checkObjectValues(value, searchQuery, employeeId);
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    };

    const filtered = employeesList.filter((employee) =>
      checkObjectValues(employee, query, employee.id)
    );

    console.log(`Search query: "${query}" - Found ${filtered.length} results`);
    setFilteredEmployees(filtered);
  };

  // Handle search from SearchBar component
  const handleSearch = (query) => {
    setSearchQuery(query);
    applySearchFilter(employees, query);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1600px] mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-[24px] text-[#272727]">Employee Master</h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <Button
              onClick={() => handleOpenModal()}
              className="whitespace-nowrap bg-blue-500 rounded-full text-white hover:bg-blue-500/90 cursor-pointer px-6 py-2"
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
              clientErrors={clientErrors} // Pass clientErrors for potential UI display
            />
            {!isSearchActive && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  total={Math.ceil(totalEmployees / limit)}
                  current={page}
                  onChange={(value) => setPage(value)}
                />
              </div>
            )}
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