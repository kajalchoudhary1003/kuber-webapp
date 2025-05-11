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

  useEffect(() => {
    if (initialData) {
      const formatDate = (date) =>
        date && !isNaN(new Date(date))
          ? new Date(date).toISOString().split('T')[0]
          : '';

      const employee = initialData.Employee || {};
      const name = `${employee.FirstName || ''} ${employee.LastName || ''}`.trim();

      setEmployeeDetails({
        empCode: employee.EmpCode || '',
        role: employee.Role?.RoleName || '',
        level: employee.Level?.LevelName || '',
        organization: employee.Organisation?.Abbreviation || '',
        startDate: formatDate(initialData.StartDate),
        billingMonthly: initialData.MonthlyBilling || '',
        endDate: formatDate(initialData.EndDate),
        status: initialData.Status || 'Active',
        EmployeeID: initialData.EmployeeID || null,
      });

      setSelectedEmployee(name);
      setSearchTerm(name);
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

    if (name === 'status') {
      const endDate = value === 'Inactive' ? new Date().toISOString().split('T')[0] : '';
      setEmployeeDetails((prev) => ({
        ...prev,
        status: value,
        endDate,
      }));
    } else {
      setEmployeeDetails((prev) => ({ ...prev, [name]: value }));
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
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name & Emp Code */}
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
            </div>

            <div className="w-full">
              <Label>Emp. Code</Label>
              <Input name="empCode" value={employeeDetails.empCode} readOnly />
            </div>
          </div>

          {/* Role & Level */}
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Role</Label>
              <Input name="role" value={employeeDetails.role} readOnly />
            </div>
            <div className="w-full">
              <Label>Level</Label>
              <Input name="level" value={employeeDetails.level} readOnly />
            </div>
          </div>

          {/* Organization */}
          <div>
            <Label>Organization</Label>
            <Input name="organization" value={employeeDetails.organization} readOnly />
          </div>

          {/* Start Date & Billing */}
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

          {/* Status & End Date */}
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

          {/* Buttons */}
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
