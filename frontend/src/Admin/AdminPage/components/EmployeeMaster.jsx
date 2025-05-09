import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import SearchBar from '@/Admin/SearchBar/SearchBar';
import EmployeeTable from '@/Admin/EmployeeTable/EmployeeTable';
import EmployeeModal from '@/Modal/EmployeeModal/EmployeeModal';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

// const API_BASE_URL = 'http://localhost:5001/api/employees';

const EmployeeMaster = () => {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    fetchDummyEmployees(page);
    fetchDummyRolesLevelsOrgs();
  }, [page]);

  // Fetching dummy employees data with CTC and Status fields
  const fetchDummyEmployees = async () => {
    setLoading(true);
    try {
      const dummyEmployees = [
        { 
          _id: '1', 
          name: 'John Doe', 
          role: 'Manager', 
          level: 'Senior', 
          organisation: 'XYZ Corp',
          CTCAnnual: 1200000,  // Added CTCAnnual
          CTCMonthly: 100000,  // Added CTCMonthly
          Status: 'Active'  // Added Status
        },
        { 
          _id: '2', 
          name: 'Jane Smith', 
          role: 'Developer', 
          level: 'Mid', 
          organisation: 'ABC Inc.',
          CTCAnnual: 800000,
          CTCMonthly: 66667,
          Status: 'Inactive'
        },
        { 
          _id: '3', 
          name: 'Samuel Lee', 
          role: 'Designer', 
          level: 'Junior', 
          organisation: 'Tech Solutions',
          CTCAnnual: 600000,
          CTCMonthly: 50000,
          Status: 'Active'
        },
      ];
      setEmployees(dummyEmployees);
      setTotalEmployees(dummyEmployees.length);  // Total employees count for pagination
    } catch (err) {
      setError('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  // Fetching dummy roles, levels, and organisations data
  const fetchDummyRolesLevelsOrgs = async () => {
    try {
      const dummyRoles = ['Manager', 'Developer', 'Designer'];
      const dummyLevels = ['Junior', 'Mid', 'Senior'];
      const dummyOrganisations = ['XYZ Corp', 'ABC Inc.', 'Tech Solutions'];

      setRoles(dummyRoles);
      setLevels(dummyLevels);
      setOrganisations(dummyOrganisations);
    } catch (err) {
      console.error('Error fetching roles, levels, or organisations');
    }
  };

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  };

  const handleCloseModal = async (newEmployee) => {
    setModalOpen(false);
    setSelectedEmployee(null);
    if (newEmployee) {
      try {
        if (selectedEmployee) {
          // Simulate employee update
          console.log('Employee updated:', newEmployee);
        } else {
          // Simulate new employee creation
          console.log('Employee created:', newEmployee);
        }
        fetchDummyEmployees(page);  // Re-fetch employees to simulate a data update
      } catch (err) {
        console.error('Error saving employee');
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      // Simulate employee deletion
      console.log('Employee deleted:', employeeId);
      fetchDummyEmployees(page);  // Re-fetch employees after deletion
    } catch (err) {
      console.error('Error deleting employee');
    }
  };

  const handleSearch = async (query) => {
    // Simulating a search functionality using the dummy data
    const filteredEmployees = employees.filter(employee =>
      employee.name.toLowerCase().includes(query.toLowerCase())
    );
    setEmployees(filteredEmployees);
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
            <Button onClick={() => handleOpenModal()} className="whitespace-nowrap bg-blue-500 rounded-full text-white hover:bg-blue-500/90 cursor-pointer px-6 py-2">
              Create Employee
            </Button>
          </div>
        </div>

        {employees.length > 0 ? (
          <>
            <EmployeeTable
              data={employees}
              onEdit={handleOpenModal}
              onDelete={handleDeleteEmployee}
              roles={roles}
              levels={levels}
              organisations={organisations}
            />
            <div className="mt-8 flex justify-center">
              <Pagination
                total={Math.ceil(totalEmployees / limit)}
                current={page}
                onChange={(value) => setPage(value)}
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
      </div>
    </div>
  );
};

export default EmployeeMaster;
