import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LevelModal = ({ open, onClose, mode, initialData, onSubmit }) => {
  const [levelName, setLevelName] = useState('');

  useEffect(() => {
    console.log('LevelModal initialData:', initialData); // Debug
    if (mode === 'edit' && initialData) {
      setLevelName(initialData.LevelName);
    } else {
      setLevelName('');
    }
  }, [open, mode, initialData]);

  const handleChange = (e) => {
    setLevelName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting level:', { id: initialData?.id, LevelName: levelName }); // Debug
      await onSubmit({ id: initialData?.id, LevelName: levelName });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Removed toast error message
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-white  border-none rounded-2xl">
        <DialogHeader className="flex flex-row justify-between items-center border-b border-gray-200 pb-3">
          <DialogTitle className="text-lg font-normal">
            {mode === 'edit' ? 'Edit Level' : 'Create Level'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="levelName" className="text-sm font-medium">
              Level Name
            </label>
            <Input
              id="levelName"
              name="LevelName"
              value={levelName}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="Enter level name"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {mode === 'edit' ? 'Update Level' : 'Create Level'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LevelModal;
