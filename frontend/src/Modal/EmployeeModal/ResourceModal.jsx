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

  useEffect(() => {
    if (open) {
      fetchEmployees();
      if (!initialData) {
        const today = new Date().toISOString().split('T')[0];
        setFormData((prev) => ({
          ...prev,
          startDate: today,
        }));
      }
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployeeOptions(Array.isArray(data.employees) ? data.employees : data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      searchEmployees(searchTerm);
    }
  }, [searchTerm]);

  const searchEmployees = async (query) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employees/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search employees');
      }
      const data = await response.json();
      setEmployeeOptions(data);
      setLoading(false);
    } catch (err) {
      console.error('Error searching employees:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      const formatDate = (date) =>
        date && !isNaN(new Date(date)) ? new Date(date).toISOString().split('T')[0] : '';

      const employee = initialData.Employee || {};
      const name = employee.FirstName && employee.LastName
        ? `${employee.FirstName} ${employee.LastName}`.trim()
        : '';

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
        EmpCode: employee.EmpCode,
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
    if (
      !employeeOptions.some((emp) =>
        `${emp.FirstName || ''} ${emp.LastName || ''}`.trim().toLowerCase() === value.trim().toLowerCase()
      )
    ) {
      setSelectedEmployee(null);
    }
  };

  const handleEmployeeSelection = async (employee) => {
    const fullName = `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();
    setSearchTerm(fullName);
    setSelectedEmployee({
      id: employee.id,
      name: fullName,
      EmpCode: employee.EmpCode,
    });

    // Check if employee is already assigned to this client
    try {
      const clientId = initialData?.ClientID;
      if (clientId && employee.id && !initialData?.id) { // Skip for editing existing resource
        const response = await fetch(`${API_BASE_URL}/client-employees/client/${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client assignments');
        }
        const assignments = await response.json();
        const isAssigned = assignments.some(
          (assignment) => assignment.EmployeeID === employee.id && !assignment.deletedAt
        );
        if (isAssigned) {
          setError('This employee is already assigned to this client.');
          setSelectedEmployee(null);
          setSearchTerm('');
          setFormData((prev) => ({
            ...prev,
            empCode: '',
            role: '',
            level: '',
            organization: '',
            EmployeeID: null,
          }));
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        empCode: employee.EmpCode || '',
        role: employee.Role?.RoleName || 'Unknown',
        level: employee.Level?.LevelName || 'Unknown',
        organization: employee.Organisation?.Abbreviation || 'Unknown',
        EmployeeID: employee.id,
      }));
      setError(null);
    } catch (err) {
      console.error('Error checking employee assignment:', err);
      setError('Failed to verify employee assignment. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      const endDate = value === 'Inactive' ? new Date().toISOString().split('T')[0] : '';
      setFormData((prev) => ({
        ...prev,
        status: value,
        endDate,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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
    EndDate: formData.status === "Active" ? null : formData.endDate || new Date().toISOString().split("T")[0], // Ensure EndDate is set for Inactive
    MonthlyBilling: Number(formData.billingMonthly),
    Status: formData.status,
    isInactiveUpdate: initialData && initialData.Status === "Active" && formData.status === "Inactive",
  };

  console.log("Submitting payload:", payload);
  onSubmit(payload, () => {
    if (payload.isInactiveUpdate) {
      console.log("Resource updated to Inactive successfully");
    }
  });
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-lg border-none bg-white">
        <DialogHeader className="flex items-start border-b border-[#9DA4B3] mb-3">
          <DialogTitle className="text-left min-w-[120px]">
            {initialData ? 'Edit Resource' : 'Add Resource'}
          </DialogTitle>
        </DialogHeader>

        {loading && <p>Loading employees...</p>}
        {error && <p className="text-red-500 p-2 bg-red-50 rounded">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
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
          <div>
            <Label>Organization</Label>
            <Input name="organization" value={formData.organization} readOnly />
          </div>
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
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleChange({ target: { name: 'status', value: val } })}
              >
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
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
          <div className="flex justify-end gap-2 pt-2">

            <Button type="submit" className="bg-[#048DFF] cursor-pointer text-white hover:bg-white hover:text-[#048DFF] hover:border-blue-500 border-2 border-[#048DFF] rounded-3xl px-6 py-2 transition-all">

              {initialData ? 'Update' : 'Add'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;