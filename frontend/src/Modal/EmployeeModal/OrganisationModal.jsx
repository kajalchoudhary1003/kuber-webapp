import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const OrganisationModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [organisationName, setOrganisationName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [regNumber, setRegNumber] = useState('');

  // Reset form when modal opens or mode/initialData changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setOrganisationName(initialData.OrganisationName || '');
        setAbbreviation(initialData.Abbreviation || '');
        setRegNumber(initialData.RegNumber || '');
      } else {
        setOrganisationName('');
        setAbbreviation('');
        setRegNumber('');
      }
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'OrganisationName':
        setOrganisationName(value);
        break;
      case 'Abbreviation':
        setAbbreviation(value);
        break;
      case 'RegNumber':
        setRegNumber(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        id: initialData?.id, // Include id for edit mode
        OrganisationName: organisationName,
        Abbreviation: abbreviation,
        RegNumber: regNumber,
      };
      await onSubmit(formData);
      onClose(); // Close modal after successful submission
    } catch (error) {
      console.error('Error submitting organisation form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-8 border-none bg-white rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-gray-200 pb-3">
          <DialogTitle className="text-lg font-normal">
            {mode === 'edit' ? 'Edit Organisation' : 'Create Organisation'}
          </DialogTitle>
          
        
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="OrganisationName" className="text-sm font-medium">
              Organisation Name
            </label>
            <Input
              id="OrganisationName"
              type="text"
              name="OrganisationName"
              placeholder="Organisation Name"
              value={organisationName}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="Abbreviation" className="text-sm font-medium">
              Abbreviation
            </label>
            <Input
              id="Abbreviation"
              type="text"
              name="Abbreviation"
              placeholder="Abbreviation"
              value={abbreviation}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="RegNumber" className="text-sm font-medium">
              Registration Number
            </label>
            <Input
              id="RegNumber"
              type="text"
              name="RegNumber"
              placeholder="Registration Number"
              value={regNumber}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-black hover:bg-gray-300 rounded-3xl px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {mode === 'edit' ? 'Update Organisation' : 'Create Organisation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganisationModal;