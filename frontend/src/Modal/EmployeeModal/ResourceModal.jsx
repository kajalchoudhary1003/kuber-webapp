'use client';

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/library/ui/calendar';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ResourceModal = ({ open, onClose, initialData, onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({
    empCode: '',
    role: '',
    level: '',
    organization: '',
    startDate: '',
    billingMonthly: '',
    endDate: '',
    status: 'Active',
    EmployeeID: null
  });

  useEffect(() => {
    if (searchTerm) {
      const fetchEmployees = async () => {
        try {
          const employees = await window.electron.ipcRenderer.invoke('search-employees', searchTerm);
          setEmployeeOptions(employees);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      fetchEmployees();
    } else {
      setEmployeeOptions([]);
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
        EmployeeID: initialData.EmployeeID || null
      });
      setSelectedEmployee(`${initialData.Employee?.FirstName || ''} ${initialData.Employee?.LastName || ''}`);
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
      EmployeeID: null
    });
    setSelectedEmployee(null);
    setSearchTerm('');
  };

  const handleEmployeeChange = (value) => {
    setSelectedEmployee(value);
    const employee = employeeOptions.find(emp => `${emp.FirstName} ${emp.LastName}` === value);
    if (employee) {
      setEmployeeDetails(prev => ({
        ...prev,
        empCode: employee.EmpCode,
        role: employee.Role?.RoleName || '',
        level: employee.Level?.LevelName || '',
        organization: employee.Organisation?.Abbreviation || '',
        EmployeeID: employee.id
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails(prev => ({ ...prev, [name]: value }));

    if (name === 'status') {
      if (value === 'Inactive') {
        setEmployeeDetails(prev => ({ ...prev, endDate: new Date().toISOString().split('T')[0] }));
      } else {
        setEmployeeDetails(prev => ({ ...prev, endDate: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeDetails.EmployeeID) return console.error('No employee selected');

    const payload = {
      EmployeeID: employeeDetails.EmployeeID,
      ClientID: initialData?.ClientID || null,
      StartDate: employeeDetails.startDate,
      EndDate: employeeDetails.endDate,
      MonthlyBilling: employeeDetails.billingMonthly,
      Status: employeeDetails.status
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
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="w-full">
              <Label>Name</Label>
              <Input
                value={selectedEmployee || ''}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedEmployee(e.target.value);
                }}
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
              <Input value={employeeDetails.empCode} readOnly className="bg-gray-100" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Role</Label>
              <Input value={employeeDetails.role} readOnly className="bg-gray-100" />
            </div>
            <div className="w-full">
              <Label>Level</Label>
              <Input value={employeeDetails.level} readOnly className="bg-gray-100" />
            </div>
          </div>

          <div>
            <Label>Organization</Label>
            <Input value={employeeDetails.organization} readOnly className="bg-gray-100" />
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Start Date</Label>
              <Input
                type="date"
                name="startDate"
                value={employeeDetails.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="w-full">
              <Label>Billing (Monthly)</Label>
              <Input
                type="number"
                name="billingMonthly"
                value={employeeDetails.billingMonthly}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label>Status</Label>
              <Select value={employeeDetails.status} onValueChange={(val) => handleChange({ target: { name: 'status', value: val } })}>
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

          <div className="flex justify-end pt-2">
            <Button type="submit">{initialData ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
