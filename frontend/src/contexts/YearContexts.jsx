import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const YearContext = createContext();
const FINANCIAL_YEAR_API_BASE_URL = 'http://localhost:5001/api/financial-years';

export const YearProvider = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(() => {
    // Initialize from localStorage if available
    const storedYear = localStorage.getItem('selectedYear');
    return storedYear || '';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialYears, setFinancialYears] = useState([]);

  const refreshFinancialYears = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${FINANCIAL_YEAR_API_BASE_URL}?page=1&limit=100`);
      const years = response.data.financialYears.map((year) => year.year);
      setFinancialYears(years);
      
      // If current selected year is not in the new list, select the latest year
      if (!years.includes(selectedYear) && years.length > 0) {
        const latestYear = years[0];
        setSelectedYear(latestYear);
        localStorage.setItem('selectedYear', latestYear);
      }
    } catch (error) {
      console.error('Error refreshing financial years:', error);
      setError('Failed to refresh financial years');
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial years only once on mount
  useEffect(() => {
    refreshFinancialYears();
  }, []); // Empty dependency array - only run once on mount

  // Update localStorage whenever selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      localStorage.setItem('selectedYear', selectedYear);
    }
  }, [selectedYear]);

  // Custom setSelectedYear function to ensure validation
  const updateSelectedYear = (year) => {
    if (financialYears.includes(year)) {
      setSelectedYear(year);
      localStorage.setItem('selectedYear', year);
    } else {
      console.error('Invalid year selected:', year);
    }
  };

  // Add a new year to the list
  const addNewYear = (year) => {
    setFinancialYears(prev => [year, ...prev]);
    setSelectedYear(year);
    localStorage.setItem('selectedYear', year);
  };

  return (
    <YearContext.Provider value={{ 
      selectedYear, 
      setSelectedYear: updateSelectedYear, 
      loading, 
      error, 
      financialYears,
      refreshFinancialYears,
      addNewYear
    }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYear = () => {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error('useYear must be used within a YearProvider');
  }
  return context;
};