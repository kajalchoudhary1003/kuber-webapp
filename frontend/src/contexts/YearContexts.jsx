import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const YearContext = createContext();
const FINANCIAL_YEAR_API_BASE_URL = 'http://localhost:5001/api/financial-years';

export const YearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await axios.get(`${FINANCIAL_YEAR_API_BASE_URL}?page=1&limit=100`);
        const years = response.data.financialYears.map((year) => year.year);
        if (years.length > 0) {
          const latestYear = years[0]; // Assuming sorted DESC
          const storedYear = localStorage.getItem('selectedYear');
          const selected = storedYear && years.includes(storedYear) ? storedYear : latestYear;
          setSelectedYear(selected);
          localStorage.setItem('selectedYear', selected);
        } else {
          setSelectedYear('');
          localStorage.removeItem('selectedYear');
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
        setError('Failed to fetch financial years');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialYears();
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
export { YearContext }; // Add this export