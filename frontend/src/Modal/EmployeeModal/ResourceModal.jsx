'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const dummyEmployees = [
  { id: '1', FirstName: 'John', LastName: 'Doe', EmpCode: 'EMP001', Role: { RoleName: 'Manager' }, Level: { LevelName: 'Senior' }, Organisation: { Abbreviation: 'XYZ' } },
  { id: '2', FirstName: 'Jane', LastName: 'Smith', EmpCode: 'EMP002', Role: { RoleName: 'Developer' }, Level: { LevelName: 'Mid' }, Organisation: { Abbreviation: 'ABC' } },
  { id: '3', FirstName: 'Samuel', LastName: 'Lee', EmpCode: 'EMP003', Role: { RoleName: 'Designer' }, Level: { LevelName: 'Junior' }, Organisation: { Abbreviation: 'TS' } },
];

const ResourceModal = ({ open, onClose, initialData, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState(dummyEmployees);
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = dummyEmployees.filter((emp) =>
        `${emp.FirstName} ${emp.LastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setEmployeeOptions(filtered);
    } else {
      setEmployeeOptions(dummyEmployees);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (initialData) {
      const formatDate = (date) => {
        if (date && !isNaN(new Date(date))) {
          return new Date(date).toISOString().split('T')[0];
        }
        return '';
      };
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
      setSelectedEmployee(`${initialData.Employee?.FirstName || ''} ${initialData.Employee?.LastName || ''}`);
      setSearchTerm(`${initialData.Employee?.FirstName || ''} ${initialData.Employee?.LastName || ''}`);
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
  };

  const handleEmployeeChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSelectedEmployee(value);

    const employee = employeeOptions.find((emp) => `${emp.FirstName} ${emp.LastName}` === value);
    
    if (employee) {
      setEmployeeDetails((prev) => ({
        ...prev,
        empCode: employee.EmpCode,
        role: employee.Role?.RoleName || '',
        level: employee.Level?.LevelName || '',
        organization: employee.Organisation?.Abbreviation || '',
        EmployeeID: employee.id,
      }));
    } else {
      // Just clear EmployeeID but keep other fields editable
      setEmployeeDetails((prev) => ({
        ...prev,
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
          endDate: '' 
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeDetails.EmployeeID) {
      alert('Please select a valid employee.');
      return;
    }

    if (!employeeDetails.startDate || !employeeDetails.billingMonthly) {
      alert('Please fill in all required fields (Start Date and Monthly Billing).');
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
      alert('Employee cannot be deleted in active state.');
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Name</Label>
              <Input
                value={searchTerm}
                onChange={handleEmployeeChange}
                list="employee-options"
                placeholder="Search employee"
              />
              <datalist id="employee-options">
                {employeeOptions.map((emp, index) => (
                  <option key={index} value={`${emp.FirstName} ${emp.LastName}`} />
                ))}
              </datalist>
              <p className="text-sm text-muted-foreground">Fetches all details up to organisation</p>
            </div>

            <div className="w-full">
              <Label>Emp. Code</Label>
              <Input
                name="empCode"
                value={employeeDetails.empCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Role</Label>
              <Input
                name="role"
                value={employeeDetails.role}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <Label>Level</Label>
              <Input
                name="level"
                value={employeeDetails.level}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <Label>Organization</Label>
            <Input
              name="organization"
              value={employeeDetails.organization}
              onChange={handleChange}
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