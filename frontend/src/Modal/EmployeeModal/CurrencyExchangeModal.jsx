'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setCurrencyFrom(initialData.CurrencyFromID?.toString() || '');
      setCurrencyTo(initialData.CurrencyToID?.toString() || '');
      setExchangeRate(initialData.ExchangeRate?.toString() || '');
    } else {
      setCurrencyFrom('');
      setCurrencyTo('');
      setExchangeRate('');
    }
    setError('');
  }, [open, mode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!currencyFrom || !currencyTo) {
      setError('Please select both Currency From and Currency To.');
      return;
    }
    if (!exchangeRate || isNaN(parseFloat(exchangeRate)) || parseFloat(exchangeRate) <= 0) {
      setError('Please enter a valid positive Exchange Rate.');
      return;
    }
    if (currencyFrom === currencyTo) {
      setError('Currency From and Currency To cannot be the same.');
      return;
    }

    onSubmit({
      id: initialData?.id,
      CurrencyFromID: parseInt(currencyFrom),
      CurrencyToID: parseInt(currencyTo),
      ExchangeRate: parseFloat(exchangeRate),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white border-none w-full">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Exchange Rate' : 'Create Exchange Rate'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Currency From</label>
              <Select value={currencyFrom} onValueChange={setCurrencyFrom} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Currency From" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none shadow-md">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.CurrencyCode} - {currency.CurrencyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Currency To</label>
              <Select value={currencyTo} onValueChange={setCurrencyTo} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Currency To" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none shadow-md">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.id} value={currency.id.toString()}>
                      {currency.CurrencyCode} - {currency.CurrencyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Exchange Rate</label>
            <Input
              type="number"
              step="0.000001"
              placeholder="Exchange Rate"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              required
              min="0.000001"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 rounded-3xl px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-white hover:text-blue-500 hover:border-blue-500 border-2 border-blue-500 rounded-3xl px-6 py-2 transition-all"
            >
              {mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CurrencyExchangeModal;