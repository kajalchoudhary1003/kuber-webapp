
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const BankDetailModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: null,
    BankName: '',
    AccountNumber: '',
    SwiftCode: '',
    IFSC: '',
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        id: initialData.id || null,
        BankName: initialData.BankName || '',
        AccountNumber: initialData.AccountNumber || '',
        SwiftCode: initialData.SwiftCode || '',
        IFSC: initialData.IFSC || '',
      });
    } else {
      resetForm();
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose(formData);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      BankName: '',
      AccountNumber: '',
      SwiftCode: '',
      IFSC: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(null)}>
      <DialogContent className="bg-white border-none rounded-3xl shadow-xl p-8 max-w-2xl w-full">
        <DialogHeader className="flex flex-row justify-between items-center border-b border-gray-200 pb-3 mb-6">
          <DialogTitle className="text-xl font-normal">
            {mode === 'edit' ? 'Edit Bank Detail' : 'Add Bank Detail'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Input
              placeholder="Bank Name"
              name="BankName"
              value={formData.BankName}
              onChange={handleChange}
              required
              className="flex-1"
            />
            <Input
              placeholder="Account Number"
              name="AccountNumber"
              value={formData.AccountNumber}
              onChange={handleChange}
              required
              className="flex-1"
            />
          </div>
          <div className="flex gap-4">
            <Input
              placeholder="Swift Code"
              name="SwiftCode"
              value={formData.SwiftCode}
              onChange={handleChange}
              required
              className="flex-1"
            />
            <Input
              placeholder="IFSC Code"
              name="IFSC"
              value={formData.IFSC}
              onChange={handleChange}
              required
              className="flex-1"
            />
          </div>
          <DialogFooter className="mt-6 flex justify-end">
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {mode === 'edit' ? 'Update Bank Detail' : 'Add Bank Detail'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BankDetailModal;
