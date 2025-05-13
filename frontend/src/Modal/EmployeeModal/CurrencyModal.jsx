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

  const [errors, setErrors] = useState({
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
      setErrors({
        CurrencyCode: '',
        CurrencyName: ''
      });
    } else {
      resetForm();
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (value.trim()) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      CurrencyCode: '',
      CurrencyName: ''
    };
    
    let isValid = true;
    
    if (!formData.CurrencyCode.trim()) {
      newErrors.CurrencyCode = 'Currency code is required';
      isValid = false;
    }
    
    if (!formData.CurrencyName.trim()) {
      newErrors.CurrencyName = 'Currency name is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
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
    setErrors({ CurrencyCode: '', CurrencyName: '' });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(null)}>
      <DialogContent className="max-w-xl bg-white border-none rounded-2xl">
        <DialogHeader className="flex flex-row justify-between items-center border-b pb-2">
          <DialogTitle>
            {mode === 'edit' ? 'Edit Currency' : 'Add Currency'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <Input
              label="Currency Code"
              name="CurrencyCode"
              placeholder="Enter currency code"
              value={formData.CurrencyCode}
              onChange={handleChange}
              required
              className={`focus-visible:ring-gray-300 focus-visible:ring-3 focus-visible:ring-offset-0 ${errors.CurrencyCode ? 'border-red-500' : ''}`}
              aria-invalid={errors.CurrencyCode ? "true" : "false"}
              aria-describedby={errors.CurrencyCode ? "currency-code-error" : undefined}
            />
            {errors.CurrencyCode && (
              <p id="currency-code-error" className="text-red-500 text-sm mt-1">
                {errors.CurrencyCode}
              </p>
            )}
          </div>
          
          <div>
            <Input
              label="Currency Name"
              name="CurrencyName"
              placeholder="Enter currency name"
              value={formData.CurrencyName}
              onChange={handleChange}
              required
              className={`focus-visible:ring-gray-300 focus-visible:ring-3 focus-visible:ring-offset-0 ${errors.CurrencyName ? 'border-red-500' : ''}`}
              aria-invalid={errors.CurrencyName ? "true" : "false"}
              aria-describedby={errors.CurrencyName ? "currency-name-error" : undefined}
            />
            {errors.CurrencyName && (
              <p id="currency-name-error" className="text-red-500 text-sm mt-1">
                {errors.CurrencyName}
              </p>
            )}
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-blue-500 shadow-md text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all cursor-pointer">
              {mode === 'edit' ? 'Update Currency' : 'Add Currency'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyModal;
