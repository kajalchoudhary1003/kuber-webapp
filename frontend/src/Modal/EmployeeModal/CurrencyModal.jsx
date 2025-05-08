import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CurrencyModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    CurrencyCode: '',
    CurrencyName: ''
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        id: initialData.id || '',
        CurrencyCode: initialData.CurrencyCode || '',
        CurrencyName: initialData.CurrencyName || ''
      });
    } else {
      resetForm();
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validData = {
        id: formData.id ? parseInt(formData.id, 10) : undefined,
        CurrencyCode: String(formData.CurrencyCode),
        CurrencyName: String(formData.CurrencyName)
      };
      await onSubmit(validData);
      onClose(null);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', CurrencyCode: '', CurrencyName: '' });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(null)}>
      <DialogContent className="max-w-xl bg-white border-none rounded-2xl">
        <DialogHeader className="flex flex-row justify-between items-center border-b pb-2">
          <DialogTitle >
            {mode === 'edit' ? 'Edit Currency' : 'Add Currency'}
          </DialogTitle>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input
            label="Currency Code"
            name="CurrencyCode"
            placeholder="Enter currency code"
            value={formData.CurrencyCode}
            onChange={handleChange}
            required
          />
          <Input
            label="Currency Name"
            name="CurrencyName"
            placeholder="Enter currency name"
            value={formData.CurrencyName}
            onChange={handleChange}
            required
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all">
              {mode === 'edit' ? 'Update Currency' : 'Add Currency'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyModal;
