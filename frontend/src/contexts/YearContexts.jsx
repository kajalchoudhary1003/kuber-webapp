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

  // Fetch financial years only once on mount
  useEffect(() => {
    const fetchFinancialYears = async () => {
      try {
        const response = await axios.get(`${FINANCIAL_YEAR_API_BASE_URL}?page=1&limit=100`);
        const years = response.data.financialYears.map((year) => year.year);
        setFinancialYears(years);
        
        // Only set a new year if there's no year selected
        if (!selectedYear && years.length > 0) {
          const latestYear = years[0]; // Assuming sorted DESC
          setSelectedYear(latestYear);
          localStorage.setItem('selectedYear', latestYear);
        }
      } catch (error) {
        console.error('Error fetching financial years:', error);
        setError('Failed to fetch financial years');
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialYears();
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
    } else {
      console.error('Invalid year selected:', year);
    }
  };

  return (
    <YearContext.Provider value={{ 
      selectedYear, 
      setSelectedYear: updateSelectedYear, 
      loading, 
      error, 
      financialYears 
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