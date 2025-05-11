

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const ResourceModal = ({ open, onClose, initialData, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState({
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

  // Fetch employees
  useEffect(() => {
  console.log('Initial data:', initialData); // Debug log
  if (initialData) {
    const formatDate = (date) => {
      if (date && !isNaN(new Date(date))) {
        return new Date(date).toISOString().split('T')[0];
      }
      return '';
    };

    // Ensure that you're getting FirstName, LastName, and EmpCode from initialData.Employee
    const employeeName = `${initialData.Employee?.FirstName || ''} ${initialData.Employee?.LastName || ''}`.trim();

    setEmployeeDetails({
      empCode: initialData.Employee?.EmpCode || '',
      role: initialData.Employee?.Role?.RoleName || '',
      level: initialData.Employee?.Level?.LevelName || '',
      organization: initialData.Employee?.Organisation?.Abbreviation || '',
      startDate: formatDate(initialData.StartDate),
      billingMonthly: initialData.MonthlyBilling || '',
      endDate: formatDate(initialData.EndDate),
      status: initialData.Status || 'Active',
      EmployeeID: initialData.EmployeeID || null,
    });

    setSelectedEmployee(employeeName);
    setSearchTerm(employeeName);
  } else {
    resetForm();
  }
}, [initialData]);


  // Populate form with initial data
  useEffect(() => {
    console.log('Initial data:', initialData); // Debug log
    console.log('initialData.Employee:', initialData?.Employee);
    if (initialData) {
      const formatDate = (date) => {
        if (date && !isNaN(new Date(date))) {
          return new Date(date).toISOString().split('T')[0];
        }
        return '';
      };
      const employeeName = `${initialData.Employee?.FirstName || ''} ${initialData.Employee?.LastName || ''}`.trim();
      setEmployeeDetails({
        empCode: initialData.Employee?.EmpCode || '',
        role: initialData.Employee?.Role?.RoleName || '',
        level: initialData.Employee?.Level?.LevelName || '',
        organization: initialData.Employee?.Organisation?.Abbreviation || '',
        startDate: formatDate(initialData.StartDate),
        billingMonthly: initialData.MonthlyBilling || '',
        endDate: formatDate(initialData.EndDate),
        status: initialData.Status || 'Active',
        EmployeeID: initialData.EmployeeID || null,
      });
      setSelectedEmployee(employeeName);
      setSearchTerm(employeeName);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setEmployeeDetails({
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
    setSelectedEmployee('');
    setSearchTerm('');
    setError(null);
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedEmployee(value);

    const employee = employeeOptions.find(
      (emp) => `${emp.FirstName} ${emp.LastName}`.trim() === value.trim()
    );
    console.log('Selected employee:', employee); // Debug log
    if (employee) {
      setEmployeeDetails((prev) => ({
        ...prev,
        empCode: employee.EmpCode || '',
        role: employee.Role?.RoleName || '',
        level: employee.Level?.LevelName || '',
        organization: employee.Organisation?.Abbreviation || '',
        EmployeeID: employee.id || null,
      }));
    } else {
      setEmployeeDetails((prev) => ({
        ...prev,
        empCode: '',
        role: '',
        level: '',
        organization: '',
        EmployeeID: null,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails((prev) => ({ ...prev, [name]: value }));

    if (name === 'status') {
      if (value === 'Inactive') {
        setEmployeeDetails((prev) => ({
          ...prev,
          status: value,
          endDate: new Date().toISOString().split('T')[0],
        }));
      } else {
        setEmployeeDetails((prev) => ({
          ...prev,
          status: value,
          endDate: '',
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeDetails.EmployeeID) {
      setError('Please select a valid employee.');
      return;
    }

    if (!employeeDetails.startDate || !employeeDetails.billingMonthly) {
      setError('Please fill in all required fields (Start Date and Monthly Billing).');
      return;
    }

    const payload = {
      EmployeeID: employeeDetails.EmployeeID,
      ClientID: initialData?.ClientID || null,
      StartDate: employeeDetails.startDate,
      EndDate: employeeDetails.endDate || null,
      MonthlyBilling: Number(employeeDetails.billingMonthly),
      Status: employeeDetails.status,
    };

    console.log('Submitting payload:', payload); // Debug log
    onSubmit(payload);
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (employeeDetails.status === 'Active') {
      setError('Employee cannot be deleted in active state.');
      return;
    }

    const payload = {
      EmployeeID: employeeDetails.EmployeeID,
      delete: true,
    };

    console.log('Delete payload:', payload); // Debug log
    onSubmit(payload);
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 rounded-2xl shadow-lg bg-white">
        <DialogHeader className="flex justify-between items-center mb-4">
          <DialogTitle>{initialData ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        </DialogHeader>

        {loading && <p>Loading employees...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Name</Label>
              <Input
                value={searchTerm}
                onChange={handleEmployeeChange}
                placeholder="Search employee by name"
                list="employee-options"
              />
              <datalist id="employee-options">
                {employeeOptions.map((emp) => (
                  <option key={emp.id} value={`${emp.FirstName} ${emp.LastName}`} />
                ))}
              </datalist>
              {!searchTerm && (
                <p className="text-sm text-red-500">Please select an employee</p>
              )}
            </div>

            <div className="w-full">
              <Label>Emp. Code</Label>
              <Input
                name="empCode"
                value={employeeDetails.empCode || 'Select an employee'}
                readOnly
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Role</Label>
              <Input
                name="role"
                value={employeeDetails.role || 'N/A'}
                readOnly
              />
            </div>
            <div className="w-full">
              <Label>Level</Label>
              <Input
                name="level"
                value={employeeDetails.level || 'N/A'}
                readOnly
              />
            </div>
          </div>

          <div>
            <Label>Organization</Label>
            <Input
              name="organization"
              value={employeeDetails.organization || 'N/A'}
              readOnly
            />
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={employeeDetails.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <Label>Billing (Monthly)</Label>
              <Input
                type="number"
                name="billingMonthly"
                value={employeeDetails.billingMonthly}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Status</Label>
              <Select
                value={employeeDetails.status}
                onValueChange={(val) =>
                  handleChange({ target: { name: 'status', value: val } })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {employeeDetails.status === 'Inactive' && (
              <div className="w-full">
                <Label>End Date</Label>
                <Input
                  type="date"
                  name="endDate"
                  value={employeeDetails.endDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {initialData && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">{initialData ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;