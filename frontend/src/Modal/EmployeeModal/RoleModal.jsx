import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const RoleModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setRoleName(initialData.RoleName);
    } else {
      setRoleName('');
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    setRoleName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ ...initialData, RoleName: roleName });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border-none rounded-2xl px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-2">
          <DialogHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-200">
            <DialogTitle className="text-xl font-normal">
              {mode === 'edit' ? 'Edit Role' : 'Create Role'}
            </DialogTitle>
            
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-black">Role Name</label>
            <Input
              type="text"
              name="RoleName"
              value={roleName}
              onChange={handleChange}
              required
              placeholder="Enter role name"
            />
          </div>

          <DialogFooter className="flex justify-end pt-4">
            <Button type="submit" className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all">
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
