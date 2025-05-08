

'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

const CurrencyExchangeModal = ({
  open,
  onClose,
  mode,
  initialData,
  onSubmit,
  currencies = [],
}) => {
  const [currencyFrom, setCurrencyFrom] = useState('');
  const [currencyTo, setCurrencyTo] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setCurrencyFrom(initialData.CurrencyFromID || '');
      setCurrencyTo(initialData.CurrencyToID || '');
      setExchangeRate(initialData.ExchangeRate || '');
    } else {
      setCurrencyFrom('');
      setCurrencyTo('');
      setExchangeRate('');
    }
  }, [open, mode, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...initialData,
        CurrencyFromID: currencyFrom,
        CurrencyToID: currencyTo,
        ExchangeRate: exchangeRate,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white border-none w-full">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-normal">
            {mode === 'edit' ? 'Edit Exchange Rate' : 'Create Exchange Rate'}
          </DialogTitle>
          
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={currencyFrom} onValueChange={setCurrencyFrom} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Currency From" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency._id} value={currency._id}>
                    {currency.CurrencyCode} - {currency.CurrencyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currencyTo} onValueChange={setCurrencyTo} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Currency To" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency._id} value={currency._id}>
                    {currency.CurrencyCode} - {currency.CurrencyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            type="number"
            placeholder="Exchange Rate"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            required
          />

          <DialogFooter>
            <Button type="submit" className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all">
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyExchangeModal;