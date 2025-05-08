
import React, { createContext, useContext, useState, useEffect } from 'react';

const YearContext = createContext();

// Static data for financial years
const staticFinancialYears = [
  { year: '2022' },
  { year: '2023' },
  { year: '2024' },
];

export const YearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestYear = () => {
      try {
        // Simulate fetching the latest year from static data
        if (staticFinancialYears && staticFinancialYears.length > 0) {
          const latestYear = staticFinancialYears[staticFinancialYears.length - 1].year;
          setSelectedYear(latestYear);
          localStorage.setItem('selectedYear', latestYear);
        } else {
          setSelectedYear('');
          localStorage.removeItem('selectedYear');
        }
      } catch (error) {
        console.error('Error setting the latest year:', error);
        setError('Failed to set financial year');
      } finally {
        setLoading(false);
      }
    };

    const fetchStoredYear = () => {
      const storedYear = localStorage.getItem('selectedYear');
      if (storedYear) {
        // Check if stored year exists in static data
        const exists = staticFinancialYears.some(year => year.year === storedYear);
        if (exists) {
          setSelectedYear(storedYear);
          setLoading(false);
        } else {
          fetchLatestYear();
        }
      } else {
        fetchLatestYear();
      }
    };

    fetchStoredYear();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      localStorage.setItem('selectedYear', selectedYear);
    } else {
      localStorage.removeItem('selectedYear');
    }
  }, [selectedYear]);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear, loading, error }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => useContext(YearContext);
