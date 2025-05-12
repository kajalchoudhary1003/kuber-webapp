import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

const ResourceModal = ({ open, onClose, initialData, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    empCode: '',
    role: '',
    level: '',
    organization: '',
    startDate: '',
    billingMonthly: '',
    endDate: '',
    status: 'Active',
    EmployeeID: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5001/api';

  // Fetch employees when modal opens
  useEffect(() => {
    if (open) {
      fetchEmployees();
      
      // Initialize form with today's date for new resources
      if (!initialData) {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({
          ...prev,
          startDate: today
        }));
      }
    }
  }, [open]);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      console.log('Fetched employees:', data);
      setEmployeeOptions(Array.isArray(data.employees) ? data.employees : data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      setLoading(false);
    }
  };

  // Search for employees when searchTerm changes
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      searchEmployees(searchTerm);
    }
  }, [searchTerm]);

  // Search employees from API
  const searchEmployees = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search employees');
      }
      const data = await response.json();
      console.log('Search results:', data);
      setEmployeeOptions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching employees:', err);
      setLoading(false);
    }
  };

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      const formatDate = (date) =>
        date && !isNaN(new Date(date))
          ? new Date(date).toISOString().split('T')[0]
          : '';

      const employee = initialData.Employee || {};
      const name = employee.FirstName && employee.LastName 
        ? `${employee.FirstName} ${employee.LastName}`.trim()
        : '';

      console.log('Initial employee data:', employee);

      setFormData({
        empCode: employee.EmpCode || '',
        role: employee.Role?.RoleName || 'Unknown',
        level: employee.Level?.LevelName || 'Unknown',
        organization: employee.Organisation?.Abbreviation || 'Unknown',
        startDate: formatDate(initialData.StartDate),
        billingMonthly: initialData.MonthlyBilling || '',
        endDate: formatDate(initialData.EndDate),
        status: initialData.Status || 'Active',
        EmployeeID: initialData.EmployeeID || employee.id || null,
      });

      setSelectedEmployee({
        id: employee.id,
        name: name,
        EmpCode: employee.EmpCode
      });
      setSearchTerm(name);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setFormData({
      empCode: '',
      role: '',
      level: '',
      organization: '',
      startDate: today,
      billingMonthly: '',
      endDate: '',
      status: 'Active',
      EmployeeID: null,
    });
    
    setSelectedEmployee(null);
    setSearchTerm('');
    setError(null);
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!employeeOptions.some(emp => 
      `${emp.FirstName || ''} ${emp.LastName || ''}`.trim().toLowerCase() === value.trim().toLowerCase()
    )) {
      setSelectedEmployee(null);
    }
  };

  const handleEmployeeSelection = (employee) => {
    const fullName = `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
    console.log('Selected employee:', employee);
    
    setSearchTerm(fullName);
    setSelectedEmployee({
      id: employee.id,
      name: fullName,
      EmpCode: employee.EmpCode
    });
    
    setFormData(prev => ({
      ...prev,
      empCode: employee.EmpCode || '',
      role: employee.Role?.RoleName || 'Unknown',
      level: employee.Level?.LevelName || 'Unknown',
      organization: employee.Organisation?.Abbreviation || 'Unknown',
      EmployeeID: employee.id
    }));
    
    setError(null);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "status") {
    const endDate = value === "Inactive" ? new Date().toISOString().split("T")[0] : "";
    setFormData(prev => ({
      ...prev,
      status: value,
      endDate, // Clear or set endDate based on status
    }));
  } else {
    setFormData(prev => ({ ...prev, [name]: value }));
  }
};

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Submitting form:", formData);

  if (!formData.EmployeeID) {
    setError("Please select a valid employee.");
    return;
  }

  if (!formData.startDate) {
    setError("Please provide a start date.");
    return;
  }

  if (!formData.billingMonthly || formData.billingMonthly <= 0) {
    setError("Please provide a valid monthly billing amount.");
    return;
  }

  const payload = {
    EmployeeID: formData.EmployeeID,
    ClientID: initialData?.ClientID || null,
    StartDate: formData.startDate,
    EndDate: formData.status === "Active" ? null : formData.endDate || null, // Set EndDate to null for Active
    MonthlyBilling: Number(formData.billingMonthly),
    Status: formData.status,
    isInactiveUpdate: initialData && initialData.Status === "Active" && formData.status === "Inactive",
  };

  console.log("Submitting payload:", payload);
  onSubmit(payload, () => {
    if (payload.isInactiveUpdate) {
      console.log("Resource updated successfully");
    }
  });
};

  const handleDelete = () => {
    if (formData.status === 'Active') {
      setError('Resource cannot be deleted in active state. Please set status to Inactive first.');
      return;
    }

    const payload = {
      EmployeeID: formData.EmployeeID,
      delete: true,
    };

    console.log('Delete payload:', payload);
    onSubmit(payload, () => {
      console.log('Resource deleted successfully');
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-lg border-none bg-white">
        <DialogHeader className="flex items-start border-b border-[#9DA4B3] mb-3">
          <DialogTitle className="text-left min-w-[120px]">{initialData ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        </DialogHeader>

        {loading && <p>Loading employees...</p>}
        {error && <p className="text-red-500 p-2 bg-red-50 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name & Emp Code */}
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Name</Label>
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={handleEmployeeChange}
                  placeholder="Search employee by name"
                />
                {searchTerm && employeeOptions.length > 0 && !selectedEmployee && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                    {employeeOptions.map((emp) => {
                      const fullName = `${emp.FirstName || ''} ${emp.LastName || ''}`.trim();
                      if (fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return (
                          <div
                            key={emp.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleEmployeeSelection(emp)}
                          >
                            {fullName} ({emp.EmpCode || 'No code'})
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <Label>Emp. Code</Label>
              <Input name="empCode" value={formData.empCode} readOnly />
            </div>
          </div>

          {/* Role & Level */}
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Role</Label>
              <Input name="role" value={formData.role} readOnly />
            </div>
            <div className="w-full">
              <Label>Level</Label>
              <Input name="level" value={formData.level} readOnly />
            </div>
          </div>

          {/* Organization */}
          <div>
            <Label>Organization</Label>
            <Input name="organization" value={formData.organization} readOnly />
          </div>

          {/* Start Date & Billing */}
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Start Date*</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <Label>Billing (Monthly)*</Label>
              <Input
                type="number"
                name="billingMonthly"
                value={formData.billingMonthly}
                onChange={handleChange}
                required
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Status & End Date */}
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(val) =>
                  handleChange({ target: { name: 'status', value: val } })
                }
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className='bg-white border-none'>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'Inactive' && (
              <div className="w-full">
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">

            
            <Button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {initialData ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;