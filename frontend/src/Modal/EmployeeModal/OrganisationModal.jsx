import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const OrganisationModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [organisationName, setOrganisationName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [regNumber, setRegNumber] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setOrganisationName(initialData.OrganisationName);
      setAbbreviation(initialData.Abbreviation);
      setRegNumber(initialData.RegNumber);
    } else {
      setOrganisationName('');
      setAbbreviation('');
      setRegNumber('');
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'OrganisationName') {
      setOrganisationName(value);
    } else if (name === 'Abbreviation') {
      setAbbreviation(value);
    } else if (name === 'RegNumber') {
      setRegNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ 
        ...initialData, 
        OrganisationName: organisationName,
        Abbreviation: abbreviation,
        RegNumber: regNumber
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
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
            <Input
              type="text"
              name="OrganisationName"
              placeholder="Organisation Name"
              value={organisationName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="Abbreviation"
              placeholder="Abbreviation"
              value={abbreviation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              name="RegNumber"
              placeholder="Registration Number"
              value={regNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all">
              {mode === 'edit' ? 'Update Organisation' : 'Create Organisation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrganisationModal;