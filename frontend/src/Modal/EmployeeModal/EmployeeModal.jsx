'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const EmployeeModal = ({ open, onClose, roles, levels, organisations, initialData }) => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    EmpCode: '',
    RoleID: '',
    LevelID: '',
    OrganisationID: '',
    CTCAnnual: '',
    CTCMonthly: '',
    ContactNumber: '',
    Email: '',
    Status: 'Active',
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        FirstName: initialData.FirstName || '',
        LastName: initialData.LastName || '',
        EmpCode: initialData.EmpCode || '',
        RoleID: String(initialData.RoleID || ''),
        LevelID: String(initialData.LevelID || ''),
        OrganisationID: String(initialData.OrganisationID || ''),
        CTCAnnual: initialData.CTCAnnual || '',
        CTCMonthly: initialData.CTCMonthly || '',
        ContactNumber: initialData.ContactNumber || '',
        Email: initialData.Email || '',
        Status: initialData.Status || 'Active',
      });
    } else {
      resetForm();
    }
  }, [open, initialData]);

  useEffect(() => {
    const annual = parseFloat(formData.CTCAnnual);
    if (!isNaN(annual)) {
      const monthly = (annual / 12).toFixed(2);
      setFormData((prev) => ({ ...prev, CTCMonthly: monthly }));
    }
  }, [formData.CTCAnnual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'CTCAnnual' || name === 'ContactNumber') && isNaN(Number(value))) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.OrganisationID) {
      alert('Please select an organisation');
      return;
    }
    try {
      onClose(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Error submitting form');
    }
  };

  const resetForm = () => {
    setFormData({
      FirstName: '',
      LastName: '',
      EmpCode: '',
      RoleID: '',
      LevelID: '',
      OrganisationID: '',
      CTCAnnual: '',
      CTCMonthly: '',
      ContactNumber: '',
      Email: '',
      Status: 'Active',
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(null)}>
      <DialogContent className="max-w-3xl border-none bg-white p-6">
        <DialogHeader>
          <DialogTitle className='mb-3'>{initialData ? 'Edit Employee' : 'Create Employee'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 flex gap-4">
            <div className="w-full">
              <Label className="mb-2">First Name</Label>
              <Input name="FirstName" value={formData.FirstName} onChange={handleChange} required />
            </div>
            <div className="w-full">
              <Label className="mb-2">Last Name</Label>
              <Input name="LastName" value={formData.LastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label className="mb-2">Employee Code</Label>
              <Input name="EmpCode" value={formData.EmpCode} onChange={handleChange} required />
            </div>
            <div className="w-full">
              <Label className="mb-2">Role</Label>
              <Select
                value={formData.RoleID}
                onValueChange={(value) => setFormData({ ...formData, RoleID: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
                  {roles.length === 0 ? (
                    <SelectItem value="" disabled>
                      No roles available
                    </SelectItem>
                  ) : (
                    roles.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.RoleName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label className="mb-2">Level</Label>
              <Select
                value={formData.LevelID}
                onValueChange={(value) => setFormData({ ...formData, LevelID: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
                  {levels.length === 0 ? (
                    <SelectItem value="" disabled>
                      No levels available
                    </SelectItem>
                  ) : (
                    levels.map((level) => (
                      <SelectItem key={level.id} value={String(level.id)}>
                        {level.LevelName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full">
              <Label className="mb-2">Organisation</Label>
              <Select
                value={formData.OrganisationID}
                onValueChange={(value) => setFormData({ ...formData, OrganisationID: value })}
                disabled={organisations.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={organisations.length === 0 ? 'No organisations available' : 'Select Organisation'}
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border-none">
                  {organisations.length === 0 ? (
                    <SelectItem value="" disabled>
                      No organisations available
                    </SelectItem>
                  ) : (
                    organisations.map((org) => (
                      <SelectItem key={org.id} value={String(org.id)}>
                        {org.Abbreviation}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label className="mb-2">CTC Annual (₹)</Label>
              <Input
                name="CTCAnnual"
                value={formData.CTCAnnual}
                onChange={handleChange}
                required
              />
            </div>
            <div className="w-full">
              <Label className="mb-2">CTC Monthly (₹)</Label>
              <Input value={formData.CTCMonthly} readOnly className="opacity-60" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <Label className="mb-2">Contact Number</Label>
              <Input
                name="ContactNumber"
                value={formData.ContactNumber}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>
            <div className="w-full">
              <Label className="mb-2">Email</Label>
              <Input name="Email" value={formData.Email} onChange={handleChange} required />
            </div>
          </div>

          <div className="w-full">
            <Label className="mb-2">Status</Label>
            <Select
              value={formData.Status}
              onValueChange={(value) => setFormData({ ...formData, Status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;