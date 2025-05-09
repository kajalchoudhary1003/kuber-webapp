import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash, ChevronDown } from 'lucide-react';
import axios from 'axios';
import RoleModal from '../../../Modal/EmployeeModal/RoleModal';
import OrganisationModal from '../../../Modal/EmployeeModal/OrganisationModal';
import LevelModal from '../../../Modal/EmployeeModal/LevelModal';
import CurrencyExchangeModal from '../../../Modal/EmployeeModal/CurrencyExchangeModal';
import CurrencyModal from '../../../Modal/EmployeeModal/CurrencyModal';
import BankDetailModal from '../../../Modal/EmployeeModal/BankDetailModal';
import ConfirmationModal from '../../../Modal/EmployeeModal/ConfirmationModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useYear } from '../../../contexts/YearContexts';

// API base URLs
const API_BASE_URL = 'http://localhost:5001/api/levels';
const ORGANISATION_API_BASE_URL = 'http://localhost:5001/api/organisations';
const ROLES_API_BASE_URL = 'http://localhost:5001/api/roles';
const CURRENCY_API_BASE_URL = 'http://localhost:5001/api/currencies';

// Fallback for useYear if context is not available
const useYearWithFallback = () => {
  try {
    return useYear() || { selectedYear: null, setSelectedYear: () => {} };
  } catch (e) {
    return { selectedYear: null, setSelectedYear: () => {} };
  }
};

// Dummy data for non-currency sections (to be replaced later if needed)
const dummyData = {
  financialYears: {
    financialYears: [
      {year:"2025"},
      {year:"2024"},
      { year: "2023" },
      { year: "2022" },
      { year: "2021" },
    ],
    total: 5,
  },
  exchangeRates: [
    {
      _id: "rate1",
      CurrencyFrom: { _id: "curr1", CurrencyName: "USD" },
      CurrencyTo: { _id: "curr2", CurrencyName: "EUR" },
      ExchangeRate: 0.85,
      Year: "2023",
    },
    {
      _id: "rate2",
      CurrencyFrom: { _id: "curr2", CurrencyName: "EUR" },
      CurrencyTo: { _id: "curr3", CurrencyName: "GBP" },
      ExchangeRate: 0.88,
      Year: "2023",
    },
  ],
  bankDetails: [
    {
      _id: "bank1",
      BankName: "Global Bank",
      AccountNumber: "1234567890",
      SwiftCode: "GBL12345",
      IfscCode: "GBL0001234",
    },
    {
      _id: "bank2",
      BankName: "National Bank",
      AccountNumber: "0987654321",
      SwiftCode: "NAT54321",
      IfscCode: "NAT0005678",
    },
  ],
};

const OtherSettings = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [employeeRoles, setEmployeeRoles] = useState([]);
  const [employeeLevels, setEmployeeLevels] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState('create');
  const [roleModalData, setRoleModalData] = useState(null);

  const [organisationModalOpen, setOrganisationModalOpen] = useState(false);
  const [organisationModalMode, setOrganisationModalMode] = useState('create');
  const [organisationModalData, setOrganisationModalData] = useState(null);

  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [levelModalMode, setLevelModalMode] = useState('create');
  const [levelModalData, setLevelModalData] = useState(null);

  const [currencyExchangeModalOpen, setCurrencyExchangeModalOpen] = useState(false);
  const [currencyExchangeModalMode, setCurrencyExchangeModalMode] = useState('create');
  const [currencyExchangeModalData, setCurrencyExchangeModalData] = useState(null);

  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [currencyModalMode, setCurrencyModalMode] = useState('create');
  const [currencyModalData, setCurrencyModalData] = useState(null);

  const [bankDetailModalOpen, setBankDetailModalOpen] = useState(false);
  const [bankDetailModalMode, setBankDetailModalMode] = useState('create');
  const [bankDetailModalData, setBankDetailModalData] = useState(null);

  const [financialYears, setFinancialYears] = useState([]);
  const { selectedYear, setSelectedYear } = useYearWithFallback();

  const [page, setPage] = useState(1);
  const limit = 2;
  const [totalYears, setTotalYears] = useState(0);
  const [showMoreAvailable, setShowMoreAvailable] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [randomCode, setRandomCode] = useState('');
  const buttonRef = useRef(null);

  // Fetch levels from backend
  const fetchLevels = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setEmployeeLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch levels. Please check if the backend server is running.'
      );
    }
  };

  // Fetch organisations from backend
  const fetchOrganisations = async () => {
    try {
      const response = await axios.get(ORGANISATION_API_BASE_URL);
      setOrganisations(response.data);
    } catch (error) {
      console.error('Error fetching organisations:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch organisations. Please check if the backend server is running.'
      );
    }
  };

  // Fetch roles from backend
  const fetchRoles = async () => {
    try {
      const response = await axios.get(ROLES_API_BASE_URL);
      setEmployeeRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch roles. Please check if the backend server is running.'
      );
    }
  };

  // Fetch currencies from backend
  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(CURRENCY_API_BASE_URL);
      // Map backend data to frontend format
      const formattedCurrencies = response.data.map(currency => ({
        _id: currency.id,
        CurrencyCode: currency.Code,
        CurrencyName: currency.Name,
        Symbol: currency.Symbol,
        IsActive: currency.IsActive
      }));
      setCurrencies(formattedCurrencies);
    } catch (error) {
      console.error('Error fetching currencies:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch currencies. Please check if the backend server is running.'
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch levels, organisations, roles, and currencies from backend
        await fetchLevels();
        await fetchOrganisations();
        await fetchRoles();
        await fetchCurrencies();

        // Non-currency dummy data (to be replaced later if needed)
        setExchangeRates(dummyData.exchangeRates);
        setBankDetails(dummyData.bankDetails);

        const newYears = dummyData.financialYears.financialYears.map((year) => year.year);
        const uniqueYears = [...new Set([...financialYears, ...newYears])];
        setFinancialYears(uniqueYears);
        setShowMoreAvailable(uniqueYears.length < dummyData.financialYears.total);
        setTotalYears(dummyData.financialYears.total);

        if (dummyData.financialYears.financialYears.length > 0 && page === 1 && !selectedYear) {
          setSelectedYear(dummyData.financialYears.financialYears[0].year);
        }
      } catch (error) {
        console.error('Error setting data:', error);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const fetchExchangeRatesForYear = async () => {
      try {
        if (!selectedYear) {
          setExchangeRates([]);
          return;
        }
        const filteredRates = dummyData.exchangeRates.filter((rate) => rate.Year === selectedYear);
        setExchangeRates(filteredRates);
      } catch (error) {
        console.error('Error fetching dummy exchange rates:', error);
      }
    };

    fetchExchangeRatesForYear();
  }, [selectedYear]);

  const handleAddExchangeRate = (event) => {
    event.stopPropagation();
    if (!selectedYear) {
      console.error('No financial year selected');
      alert('Please select a financial year first.');
      return;
    }
    console.log('Opening CurrencyExchangeModal in create mode');
    setCurrencyExchangeModalMode('create');
    setCurrencyExchangeModalData(null);
    setCurrencyExchangeModalOpen(true);
  };

  const handleEditExchangeRate = (rate, event) => {
    event.stopPropagation();
    if (!rate || !rate.CurrencyFrom || !rate.CurrencyTo) {
      console.error('Invalid exchange rate data:', rate);
      return;
    }
    console.log('Opening CurrencyExchangeModal in edit mode with:', rate);
    setCurrencyExchangeModalMode('edit');
    setCurrencyExchangeModalData({
      id: rate._id,
      CurrencyFromID: rate.CurrencyFrom._id,
      CurrencyToID: rate.CurrencyTo._id,
      ExchangeRate: parseFloat(rate.ExchangeRate),
    });
    setCurrencyExchangeModalOpen(true);
  };

  const handleExchangeRateSubmit = async (exchangeRate) => {
    try {
      if (!exchangeRate.CurrencyFromID || !exchangeRate.CurrencyToID || !exchangeRate.ExchangeRate || !selectedYear) {
        throw new Error('All fields are required, including financial year.');
      }

      const exchangeRateWithYear = {
        CurrencyFromID: exchangeRate.CurrencyFromID,
        CurrencyToID: exchangeRate.CurrencyToID,
        ExchangeRate: parseFloat(exchangeRate.ExchangeRate),
        Year: selectedYear,
        CurrencyFrom: currencies.find((c) => c._id === exchangeRate.CurrencyFromID),
        CurrencyTo: currencies.find((c) => c._id === exchangeRate.CurrencyToID),
      };

      if (exchangeRate.id) {
        const updatedRate = { ...exchangeRateWithYear, _id: exchangeRate.id };
        setExchangeRates((prevRates) =>
          prevRates.map((rate) => (rate._id === updatedRate._id ? updatedRate : rate))
        );
      } else {
        const newRate = { ...exchangeRateWithYear, _id: `rate${Math.random().toString(36).substring(2, 9)}` };
        setExchangeRates((prevRates) => [...prevRates, newRate]);
      }
      setCurrencyExchangeModalOpen(false);
    } catch (error) {
      console.error('Error submitting exchange rate:', error);
      alert('Failed to submit exchange rate. Please try again.');
    }
  };

  const deleteExchangeRate = async (exchangeRateId) => {
    try {
      console.log('Deleting exchange rate:', exchangeRateId);
      setExchangeRates((prevExchangeRates) =>
        prevExchangeRates.filter((rate) => rate._id !== exchangeRateId)
      );
    } catch (error) {
      console.error('Error deleting exchange rate:', error);
    }
  };

  const handleAddEmployeeRole = (event) => {
    event.stopPropagation();
    console.log('Opening RoleModal in create mode');
    setRoleModalMode('create');
    setRoleModalData(null);
    setRoleModalOpen(true);
  };

  const handleEditEmployeeRole = (role, event) => {
    event.stopPropagation();
    console.log('Opening RoleModal in edit mode with:', role);
    setRoleModalMode('edit');
    setRoleModalData({ id: role.id, RoleName: role.RoleName });
    setRoleModalOpen(true);
  };

  const handleRoleSubmit = async (role) => {
    console.log('Handling role submit:', role);
    try {
      if (!role.RoleName) {
        throw new Error('Role name is required');
      }
      if (role.id) {
        // Update existing role
        const response = await axios.put(`${ROLES_API_BASE_URL}/${role.id}`, {
          RoleName: role.RoleName,
        });
        setEmployeeRoles((prevRoles) =>
          prevRoles.map((r) => (r.id === role.id ? response.data : r))
        );
      } else {
        // Create new role
        const response = await axios.post(ROLES_API_BASE_URL, {
          RoleName: role.RoleName,
        });
        setEmployeeRoles((prevRoles) => [...prevRoles, response.data]);
      }
      setRoleModalOpen(false);
    } catch (error) {
      console.error('Error submitting role:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.status === 404
          ? 'Role not found'
          : error.response?.status === 400
            ? error.response?.data?.error || 'Invalid role data'
            : 'Failed to submit role. ';
      alert(errorMessage);
    }
  };

  const deleteRole = async (roleId) => {
    console.log('Deleting role:', roleId);
    try {
      await axios.delete(`${ROLES_API_BASE_URL}/${roleId}`);
      setEmployeeRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
    } catch (error) {
      console.error('Error deleting role:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.status === 404
          ? 'Role not found'
          : error.response?.status === 400
            ? error.response?.data?.error || 'Cannot delete role'
            : 'Failed to delete role.';
      alert(errorMessage);
    }
  };

  const handleAddOrganisation = (event) => {
    event.stopPropagation();
    console.log('Opening OrganisationModal in create mode');
    setOrganisationModalMode('create');
    setOrganisationModalData(null);
    setOrganisationModalOpen(true);
  };

  const handleEditOrganisation = (organisation, event) => {
    event.stopPropagation();
    console.log('Opening OrganisationModal in edit mode with:', organisation);
    setOrganisationModalMode('edit');
    setOrganisationModalData({
      id: organisation.id,
      OrganisationName: organisation.OrganisationName,
      Abbreviation: organisation.Abbreviation,
      RegNumber: organisation.RegNumber,
    });
    setOrganisationModalOpen(true);
  };

  const handleOrganisationSubmit = async (organisation) => {
    try {
      console.log('Submitting organisation:', organisation);
      if (organisation.id) {
        // Update existing organisation
        const response = await axios.put(`${ORGANISATION_API_BASE_URL}/${organisation.id}`, {
          OrganisationName: organisation.OrganisationName,
          Abbreviation: organisation.Abbreviation,
          RegNumber: organisation.RegNumber,
        });
        setOrganisations((prevOrganisations) =>
          prevOrganisations.map((org) =>
            org.id === organisation.id ? response.data : org
          )
        );
      } else {
        // Create new organisation
        const response = await axios.post(ORGANISATION_API_BASE_URL, {
          OrganisationName: organisation.OrganisationName,
          Abbreviation: organisation.Abbreviation,
          RegNumber: organisation.RegNumber,
        });
        setOrganisations((prevOrganisations) => [
          ...prevOrganisations,
          response.data,
        ]);
      }
      setOrganisationModalOpen(false);
    } catch (error) {
      console.error('Error submitting organisation:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to submit organisation. Please check if the backend server is running.'
      );
    }
  };

  const deleteOrganisation = async (organisationId) => {
    try {
      console.log('Deleting organisation:', organisationId);
      await axios.delete(`${ORGANISATION_API_BASE_URL}/${organisationId}`);
      setOrganisations((prevOrganisations) =>
        prevOrganisations.filter((org) => org.id !== organisationId)
      );
    } catch (error) {
      console.error('Error deleting organisation:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to delete organisation. Please check if the backend server is running.'
      );
    }
  };

  const handleAddEmployeeLevel = (event) => {
    event.stopPropagation();
    console.log('Opening LevelModal in create mode');
    setLevelModalMode('create');
    setLevelModalData(null);
    setLevelModalOpen(true);
  };

  const handleEditEmployeeLevel = (level, event) => {
    event.stopPropagation();
    console.log('Opening LevelModal in edit mode with:', level);
    setLevelModalMode('edit');
    setLevelModalData({ id: level.id, LevelName: level.LevelName });
    setLevelModalOpen(true);
  };

  const handleLevelSubmit = async (level) => {
    try {
      console.log('Handling level submit:', level);
      if (!level.LevelName) {
        throw new Error('Level name is required');
      }
      if (level.id) {
        await axios.put(`${API_BASE_URL}/${level.id}`, { LevelName: level.LevelName });
        console.log('Level updated:', level);
      } else {
        await axios.post(API_BASE_URL, { LevelName: level.LevelName });
        console.log('Level created:', level);
      }
      await fetchLevels();
      setLevelModalOpen(false);
    } catch (error) {
      console.error('Error submitting level:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to submit level. Please check if the backend server is running.'
      );
    }
  };

  const deleteLevel = async (levelId) => {
    try {
      console.log('Deleting level:', levelId);
      await axios.delete(`${API_BASE_URL}/${levelId}`);
      await fetchLevels();
    } catch (error) {
      console.error('Error deleting level:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert(
        error.response?.data?.error ||
        error.message ||
        'Failed to delete level. Please check if the backend server is running.'
      );
    }
  };

  const handleAddCurrency = (event) => {
    event.stopPropagation();
    console.log('Opening CurrencyModal in create mode');
    setCurrencyModalMode('create');
    setCurrencyModalData(null);
    setCurrencyModalOpen(true);
  };

  const handleEditCurrency = (currency, event) => {
    event.stopPropagation();
    console.log('Opening CurrencyModal in edit mode with:', currency);
    setCurrencyModalMode('edit');
    setCurrencyModalData({
      id: currency._id,
      CurrencyCode: currency.CurrencyCode,
      CurrencyName: currency.CurrencyName,
      Symbol: currency.Symbol,
    });
    setCurrencyModalOpen(true);
  };

  const handleCurrencySubmit = async (currency) => {
    try {
      console.log('Submitting currency:', currency);
      // Map frontend data to backend format
      const currencyData = {
        Code: currency.CurrencyCode,
        Name: currency.CurrencyName,
        Symbol: currency.Symbol || '$', // Default symbol if not provided
      };

      let response;
      if (currency.id) {
        // Update existing currency
        response = await axios.put(`${CURRENCY_API_BASE_URL}/${currency.id}`, currencyData);
      } else {
        // Create new currency
        response = await axios.post(CURRENCY_API_BASE_URL, currencyData);
      }

      // Map response data to frontend format
      const updatedCurrency = {
        _id: response.data.id,
        CurrencyCode: response.data.Code,
        CurrencyName: response.data.Name,
        Symbol: response.data.Symbol,
        IsActive: response.data.IsActive,
      };

      if (currency.id) {
        setCurrencies((prevCurrencies) =>
          prevCurrencies.map((c) => (c._id === updatedCurrency._id ? updatedCurrency : c))
        );
      } else {
        setCurrencies((prevCurrencies) => [...prevCurrencies, updatedCurrency]);
      }

      setCurrencyModalOpen(false);
    } catch (error) {
      console.error('Error submitting currency:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.status === 404
          ? 'Currency not found'
          : error.response?.status === 409
            ? 'Currency code already exists'
            : error.response?.status === 400
              ? error.response?.data?.error || 'Invalid currency data'
              : 'Failed to submit currency. Please check if the backend server is running.';
      alert(errorMessage);
    }
  };

  const deleteCurrency = async (currencyId) => {
    try {
      console.log('Deleting currency:', currencyId);
      await axios.delete(`${CURRENCY_API_BASE_URL}/${currencyId}`);
      setCurrencies((prevCurrencies) => prevCurrencies.filter((currency) => currency._id !== currencyId));
    } catch (error) {
      console.error('Error deleting currency:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.status === 404
          ? 'Currency not found'
          : error.response?.status === 400
            ? error.response?.data?.error || 'Cannot delete currency'
            : 'Failed to delete currency. Please check if the backend server is running.';
      alert(errorMessage);
    }
  };

  const handleAddBankDetail = (event) => {
    event.stopPropagation();
    console.log('Opening BankDetailModal in create mode');
    setBankDetailModalMode('create');
    setBankDetailModalData(null);
    setBankDetailModalOpen(true);
  };

  const handleEditBankDetail = (bankDetail, event) => {
    event.stopPropagation();
    console.log('Opening BankDetailModal in edit mode with:', bankDetail);
    setBankDetailModalMode('edit');
    setBankDetailModalData({
      id: bankDetail._id,
      BankName: bankDetail.BankName,
      AccountNumber: bankDetail.AccountNumber,
      SwiftCode: bankDetail.SwiftCode,
      IfscCode: bankDetail.IfscCode,
    });
    setBankDetailModalOpen(true);
  };

  const handleBankDetailSubmit = async (bankDetail) => {
    try {
      console.log('Submitting bank detail:', bankDetail);
      if (bankDetail.id) {
        const updatedBankDetail = { ...bankDetail, _id: bankDetail.id };
        setBankDetails((prevBankDetails) =>
          prevBankDetails.map((b) => (b._id === updatedBankDetail._id ? updatedBankDetail : b))
        );
      } else {
        const newBankDetail = { ...bankDetail, _id: `bank${Math.random().toString(36).substring(2, 9)}` };
        setBankDetails((prevBankDetails) => [...prevBankDetails, newBankDetail]);
      }
      setBankDetailModalOpen(false);
    } catch (error) {
      console.error('Error submitting bank detail:', error);
      alert('Failed to submit bank detail. Please try again.');
    }
  };

  const deleteBankDetail = async (bankDetailId) => {
    try {
      console.log('Deleting bank detail:', bankDetailId);
      setBankDetails((prevBankDetails) =>
        prevBankDetails.filter((bankDetail) => bankDetail._id !== bankDetailId)
      );
    } catch (error) {
      console.error('Error deleting bank detail:', error);
    }
  };

  const handleYearChange = (year) => {
    console.log('Changing financial year to:', year);
    setSelectedYear(year);
  };

  const handleAddUpcomingYear = (event) => {
    event.stopPropagation();
    console.log('Opening ConfirmationModal for adding financial year');
    setRandomCode(Math.random().toString(36).substring(2, 8));
    setModalOpen(true);
  };

  const confirmAddUpcomingYear = async () => {
    try {
      console.log('Adding new financial year');
      const newYear = (parseInt(financialYears[0]) + 1).toString();
      setFinancialYears((prevYears) => [newYear, ...prevYears]);
      setSelectedYear(newYear);
    } catch (error) {
      console.error('Error adding financial year:', error);
      alert('Failed to add financial year. Please try again.');
    }
    setModalOpen(false);
  };

  const backupDatabase = async () => {
    try {
      console.log('Backing up database');
      // Simulate backup
    } catch (error) {
      console.error('Unexpected error during database backup:', error);
      alert('Failed to backup database. Please try again.');
    }
  };

  const restoreDatabase = async () => {
    try {
      console.log('Restoring database');
      // Simulate restore
    } catch (error) {
      console.error('Unexpected error during database restore:', error);
      alert('Failed to restore database. Please try again.');
    }
  };

  const handleShowMoreYears = (event) => {
    event.stopPropagation();
    console.log('Showing more financial years');
    setPage((prevPage) => prevPage + 1);
    setFinancialYears((prevYears) => {
      const newYears = [...prevYears, `202${3 - prevYears.length}`];
      setShowMoreAvailable(newYears.length < dummyData.financialYears.total);
      return newYears;
    });
  };

  const formatYear = (year) => {
    const nextYear = parseInt(year) + 1;
    return `${year}-${nextYear}`;
  };

  return (
    <div className="flex flex-col items-center p-5">
      <div className="w-full bg-white rounded-3xl shadow-sm p-8 mb-5">
        <div className="flex justify-between items-center w-full mb-0">
          <h2 className="text-xl font-semibold">Financial Year</h2>
          <div className="flex gap-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[120px] px-5 py-2.5 rounded-full border-gray-300 bg-white text-black hover:border-blue-500 transition-colors flex items-center justify-between"
                  ref={buttonRef}
                >
                  {selectedYear ? formatYear(selectedYear) : 'Select Year'}
                  <ChevronDown className="ml-2" size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: buttonRef.current ? buttonRef.current.offsetWidth : 'auto' }}>
                {financialYears.map((year, index) => (
                  <DropdownMenuItem key={`${year}-${index}`} onClick={() => handleYearChange(year)}>
                    {formatYear(year)}
                  </DropdownMenuItem>
                ))}
                {showMoreAvailable && (
                  <DropdownMenuItem onClick={handleShowMoreYears}>Show More</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={handleAddUpcomingYear}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add Financial Year
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-sm p-8 mb-5">
        <div className="flex justify-between items-center w-full mb-0">
          <h2 className="text-xl font-semibold">Backup and Restore</h2>
          <div className="flex gap-2.5">
            <Button onClick={backupDatabase} className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full">
              Backup Database
            </Button>
            <Button onClick={restoreDatabase} className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full">
              Restore Database
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Employee Levels</h2>
            <Button
              onClick={handleAddEmployeeLevel}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Level
            </Button>
          </div>
          {employeeLevels.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeLevels.map((level) => (
                  <TableRow key={level.id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {level.LevelName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditEmployeeLevel(level, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteLevel(level.id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No levels available.</p>
          )}
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Employee Roles</h2>
            <Button
              onClick={handleAddEmployeeRole}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Role
            </Button>
          </div>
          {employeeRoles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {role.RoleName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditEmployeeRole(role, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteRole(role.id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No roles available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Organisations</h2>
            <Button
              onClick={handleAddOrganisation}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Organisation
            </Button>
          </div>
          {organisations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Abbreviation</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Reg. Number</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organisations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {org.OrganisationName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {org.Abbreviation}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {org.RegNumber}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditOrganisation(org, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteOrganisation(org.id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No organisations available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Bank Details</h2>
            <Button
              onClick={handleAddBankDetail}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Bank Detail
            </Button>
          </div>
          {bankDetails.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Bank Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Account Number</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Swift Code</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">IFSC Code</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bankDetails.map((detail) => (
                  <TableRow key={detail._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {detail.BankName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {detail.AccountNumber}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {detail.SwiftCode}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {detail.IfscCode}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditBankDetail(detail, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteBankDetail(detail._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No bank details available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Currencies</h2>
            <Button
              onClick={handleAddCurrency}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Currency
            </Button>
          </div>
          {currencies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Code</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {currency.CurrencyCode}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {currency.CurrencyName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditCurrency(currency, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteCurrency(currency._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No currencies available.</p>
          )}
        </div>
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">Currency Exchange Rate</h2>
            <Button
              onClick={handleAddExchangeRate}
              className="bg-blue-500 text-white cursor-pointer hover:bg-blue-500/90 rounded-full"
            >
              Add New Exchange Rate
            </Button>
          </div>
          {exchangeRates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">Currency From</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Currency To</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Exchange Rate</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRates.map((rate) => (
                  <TableRow key={rate._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {rate.CurrencyFrom?.CurrencyName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {rate.CurrencyTo?.CurrencyName || 'N/A'}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {parseFloat(rate.ExchangeRate)}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={(event) => handleEditExchangeRate(rate, event)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteExchangeRate(rate._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-sm text-gray-500">No exchange rates available.</p>
          )}
        </div>
      </div>

      <RoleModal
        open={roleModalOpen}
        onClose={() => {
          console.log('Closing RoleModal');
          setRoleModalOpen(false);
        }}
        mode={roleModalMode}
        initialData={roleModalData}
        onSubmit={handleRoleSubmit}
      />
      <OrganisationModal
        open={organisationModalOpen}
        onClose={() => {
          console.log('Closing OrganisationModal');
          setOrganisationModalOpen(false);
        }}
        mode={organisationModalMode}
        initialData={organisationModalData}
        onSubmit={handleOrganisationSubmit}
      />
      <LevelModal
        open={levelModalOpen}
        onClose={() => {
          console.log('Closing LevelModal');
          setLevelModalOpen(false);
        }}
        mode={levelModalMode}
        initialData={levelModalData}
        onSubmit={handleLevelSubmit}
      />
      <CurrencyExchangeModal
        open={currencyExchangeModalOpen}
        onClose={() => {
          console.log('Closing CurrencyExchangeModal');
          setCurrencyExchangeModalOpen(false);
        }}
        mode={currencyExchangeModalMode}
        initialData={currencyExchangeModalData}
        onSubmit={handleExchangeRateSubmit}
        currencies={currencies}
      />
      <CurrencyModal
        open={currencyModalOpen}
        onClose={() => {
          console.log('Closing CurrencyModal');
          setCurrencyModalOpen(false);
        }}
        mode={currencyModalMode}
        initialData={currencyModalData}
        onSubmit={handleCurrencySubmit}
      />
      <BankDetailModal
        open={bankDetailModalOpen}
        onClose={() => {
          console.log('Closing BankDetailModal');
          setBankDetailModalOpen(false);
        }}
        mode={bankDetailModalMode}
        initialData={bankDetailModalData}
        onSubmit={handleBankDetailSubmit}
      />
      <ConfirmationModal
        open={modalOpen}
        onClose={() => {
          console.log('Closing ConfirmationModal');
          setModalOpen(false);
        }}
        onConfirm={confirmAddUpcomingYear}
        randomCode={randomCode}
      />
    </div>
  );
};

export default OtherSettings;