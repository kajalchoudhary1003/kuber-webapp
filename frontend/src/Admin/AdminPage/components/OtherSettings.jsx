import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash, ChevronDown } from 'lucide-react';
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


// Fallback for useYear if context is not available
const useYearWithFallback = () => {
  try {
    return useYear() || { selectedYear: null, setSelectedYear: () => {} };
  } catch (e) {
    return { selectedYear: null, setSelectedYear: () => {} };
  }
};



// Dummy data to simulate backend responses
const dummyData = {
  financialYears: {
    financialYears: [
      { year: "2023" },
      { year: "2022" },
      { year: "2021" },
    ],
    total: 5, // Simulate more years available for "Show More"
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
  roles: [
    { _id: "role1", RoleName: "Developer" },
    { _id: "role2", RoleName: "Manager" },
    { _id: "role3", RoleName: "Designer" },
  ],
  levels: [
    { _id: "level1", LevelName: "Junior" },
    { _id: "level2", LevelName: "Senior" },
    { _id: "level3", LevelName: "Lead" },
  ],
  organisations: [
    {
      _id: "org1",
      OrganisationName: "Tech Corp",
      Abbreviation: "TC",
      RegNumber: "123456",
    },
    {
      _id: "org2",
      OrganisationName: "Innovate Ltd",
      Abbreviation: "IL",
      RegNumber: "789012",
    },
  ],
  currencies: [
    { _id: "curr1", CurrencyCode: "USD", CurrencyName: "United States Dollar" },
    { _id: "curr2", CurrencyCode: "EUR", CurrencyName: "Euro" },
    { _id: "curr3", CurrencyCode: "GBP", CurrencyName: "British Pound" },
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

export const OtherSettings = () => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data with dummy data
        setExchangeRates(dummyData.exchangeRates);
        setEmployeeRoles(dummyData.roles);
        setEmployeeLevels(dummyData.levels);
        setOrganisations(dummyData.organisations);
        setCurrencies(dummyData.currencies);
        setBankDetails(dummyData.bankDetails);
        setFinancialYears((prevYears) => {
          const newYears = dummyData.financialYears.financialYears.map((year) => year.year);
          const uniqueYears = [...new Set([...prevYears, ...newYears])];
          setShowMoreAvailable(uniqueYears.length < dummyData.financialYears.total);
          return uniqueYears;
        });
        setTotalYears(dummyData.financialYears.total);

        if (dummyData.financialYears.financialYears.length > 0 && page === 1) {
          setSelectedYear(dummyData.financialYears.financialYears[0].year);
        }
      } catch (error) {
        console.error('Error setting dummy data:', error);
      }
    };

    fetchData();
  }, [setSelectedYear, page]);

  useEffect(() => {
    const fetchExchangeRatesForYear = async () => {
      try {
        if (!selectedYear) {
          setExchangeRates([]);
          return;
        }
        // Filter dummy exchange rates by selected year
        const filteredRates = dummyData.exchangeRates.filter((rate) => rate.Year === selectedYear);
        setExchangeRates(filteredRates);
      } catch (error) {
        console.error('Error fetching dummy exchange rates:', error);
      }
    };

    fetchExchangeRatesForYear();
  }, [selectedYear]);

  const handleAddExchangeRate = () => {
    if (!selectedYear) {
      return;
    }
    setCurrencyExchangeModalMode('create');
    setCurrencyExchangeModalData(null);
    setCurrencyExchangeModalOpen(true);
  };

  const handleEditExchangeRate = (rate) => {
    if (!rate || !rate.CurrencyFrom || !rate.CurrencyTo) {
      return;
    }
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
        CurrencyFrom: dummyData.currencies.find((c) => c._id === exchangeRate.CurrencyFromID),
        CurrencyTo: dummyData.currencies.find((c) => c._id === exchangeRate.CurrencyToID),
      };

      if (exchangeRate.id) {
        const updatedRate = { ...exchangeRateWithYear, _id: exchangeRate.id };
        updateExchangeRate(updatedRate);
      } else {
        const newRate = { ...exchangeRateWithYear, _id: `rate${Math.random().toString(36).substring(2, 9)}` };
        addExchangeRate(newRate);
      }

      // Update exchange rates for the selected year
      const filteredRates = dummyData.exchangeRates
        .filter((rate) => rate.Year === selectedYear && rate._id !== exchangeRate.id)
        .concat(exchangeRate.id ? [{ ...exchangeRateWithYear, _id: exchangeRate.id }] : [{ ...exchangeRateWithYear, _id: `rate${Math.random().toString(36).substring(2, 9)}` }]);
      setExchangeRates(filteredRates);
      setCurrencyExchangeModalOpen(false);
    } catch (error) {
      console.error('Error submitting exchange rate:', error);
    }
  };

  const deleteExchangeRate = async (exchangeRateId) => {
    try {
      setExchangeRates((prevExchangeRates) =>
        prevExchangeRates.filter((rate) => rate._id !== exchangeRateId)
      );
    } catch (error) {
      console.error('Error deleting exchange rate:', error);
    }
  };

  const addExchangeRate = (rate) => {
    setExchangeRates((prevRates) => [...prevRates, rate]);
  };

  const updateExchangeRate = (updatedRate) => {
    setExchangeRates((prevRates) =>
      prevRates.map((rate) => (rate._id === updatedRate._id ? updatedRate : rate))
    );
  };

  const handleAddEmployeeRole = () => {
    setRoleModalMode('create');
    setRoleModalData(null);
    setRoleModalOpen(true);
  };

  const handleEditEmployeeRole = (role) => {
    setRoleModalMode('edit');
    setRoleModalData({ id: role._id, RoleName: role.RoleName });
    setRoleModalOpen(true);
  };

  const handleRoleSubmit = async (role) => {
    try {
      if (role.id) {
        const updatedRole = { ...role, _id: role.id };
        updateRole(updatedRole);
      } else {
        const newRole = { ...role, _id: `role${Math.random().toString(36).substring(2, 9)}` };
        addRole(newRole);
      }
    } catch (error) {
      console.error('Error submitting role:', error);
    }
  };

  const addRole = (role) => {
    setEmployeeRoles((prevRoles) => [...prevRoles, role]);
  };

  const updateRole = (updatedRole) => {
    setEmployeeRoles((prevRoles) =>
      prevRoles.map((role) => (role._id === updatedRole._id ? updatedRole : role))
    );
  };

  const deleteRole = async (roleId) => {
    try {
      setEmployeeRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const handleAddOrganisation = () => {
    setOrganisationModalMode('create');
    setOrganisationModalData(null);
    setOrganisationModalOpen(true);
  };

  const handleEditOrganisation = (organisation) => {
    setOrganisationModalMode('edit');
    setOrganisationModalData({
      id: organisation._id,
      OrganisationName: organisation.OrganisationName,
      Abbreviation: organisation.Abbreviation,
      RegNumber: organisation.RegNumber,
    });
    setOrganisationModalOpen(true);
  };

  const handleOrganisationSubmit = async (organisation) => {
    try {
      if (organisation.id) {
        const updatedOrganisation = { ...organisation, _id: organisation.id };
        updateOrganisation(updatedOrganisation);
      } else {
        const newOrganisation = { ...organisation, _id: `org${Math.random().toString(36).substring(2, 9)}` };
        addOrganisation(newOrganisation);
      }
    } catch (error) {
      console.error('Error submitting organisation:', error);
    }
  };

  const addOrganisation = (organisation) => {
    setOrganisations((prevOrganisations) => [...prevOrganisations, organisation]);
  };

  const updateOrganisation = (updatedOrganisation) => {
    setOrganisations((prevOrganisations) =>
      prevOrganisations.map((org) => (org._id === updatedOrganisation._id ? updatedOrganisation : org))
    );
  };

  const deleteOrganisation = async (organisationId) => {
    try {
      setOrganisations((prevOrganisations) =>
        prevOrganisations.filter((org) => org._id !== organisationId)
      );
    } catch (error) {
      console.error('Error deleting organisation:', error);
    }
  };

  const handleAddEmployeeLevel = () => {
    setLevelModalMode('create');
    setLevelModalData(null);
    setLevelModalOpen(true);
  };

  const handleEditEmployeeLevel = (level) => {
    setLevelModalMode('edit');
    setLevelModalData({ id: level._id, LevelName: level.LevelName });
    setLevelModalOpen(true);
  };

  const handleLevelSubmit = async (level) => {
    try {
      if (level.id) {
        const updatedLevel = { ...level, _id: level.id };
        updateLevel(updatedLevel);
      } else {
        const newLevel = { ...level, _id: `level${Math.random().toString(36).substring(2, 9)}` };
        addLevel(newLevel);
      }
    } catch (error) {
      console.error('Error submitting level:', error);
    }
  };

  const addLevel = (level) => {
    setEmployeeLevels((prevLevels) => [...prevLevels, level]);
  };

  const updateLevel = (updatedLevel) => {
    setEmployeeLevels((prevLevels) =>
      prevLevels.map((level) => (level._id === updatedLevel._id ? updatedLevel : level))
    );
  };

  const deleteLevel = async (levelId) => {
    try {
      setEmployeeLevels((prevLevels) => prevLevels.filter((level) => level._id !== levelId));
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  const handleAddCurrency = () => {
    setCurrencyModalMode('create');
    setCurrencyModalData(null);
    setCurrencyModalOpen(true);
  };

  const handleEditCurrency = (currency) => {
    setCurrencyModalMode('edit');
    setCurrencyModalData({
      id: currency._id,
      CurrencyCode: currency.CurrencyCode,
      CurrencyName: currency.CurrencyName,
    });
    setCurrencyModalOpen(true);
  };

  const handleCurrencySubmit = async (currency) => {
    try {
      if (currency.id) {
        const updatedCurrency = { ...currency, _id: currency.id };
        updateCurrency(updatedCurrency);
      } else {
        const newCurrency = { ...currency, _id: `curr${Math.random().toString(36).substring(2, 9)}` };
        addCurrency(newCurrency);
      }
    } catch (error) {
      console.error('Error submitting currency:', error);
    }
  };

  const addCurrency = (currency) => {
    setCurrencies((prevCurrencies) => [...prevCurrencies, currency]);
  };

  const updateCurrency = (updatedCurrency) => {
    setCurrencies((prevCurrencies) =>
      prevCurrencies.map((currency) => (currency._id === updatedCurrency._id ? updatedCurrency : currency))
    );
  };

  const deleteCurrency = async (currencyId) => {
    try {
      setCurrencies((prevCurrencies) => prevCurrencies.filter((currency) => currency._id !== currencyId));
    } catch (error) {
      console.error('Error deleting currency:', error);
    }
  };

  const handleAddBankDetail = () => {
    setBankDetailModalMode('create');
    setBankDetailModalData(null);
    setBankDetailModalOpen(true);
  };

  const handleEditBankDetail = (bankDetail) => {
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
      if (bankDetail.id) {
        const updatedBankDetail = { ...bankDetail, _id: bankDetail.id };
        updateBankDetail(updatedBankDetail);
      } else {
        const newBankDetail = { ...bankDetail, _id: `bank${Math.random().toString(36).substring(2, 9)}` };
        addBankDetail(newBankDetail);
      }
    } catch (error) {
      console.error('Error submitting bank detail:', error);
    }
  };

  const addBankDetail = (bankDetail) => {
    setBankDetails((prevBankDetails) => [...prevBankDetails, bankDetail]);
  };

  const updateBankDetail = (updatedBankDetail) => {
    setBankDetails((prevBankDetails) =>
      prevBankDetails.map((bankDetail) => (bankDetail._id === updatedBankDetail._id ? updatedBankDetail : bankDetail))
    );
  };

  const deleteBankDetail = async (bankDetailId) => {
    try {
      setBankDetails((prevBankDetails) =>
        prevBankDetails.filter((bankDetail) => bankDetail._id !== bankDetailId)
      );
    } catch (error) {
      console.error('Error deleting bank detail:', error);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleAddUpcomingYear = () => {
    setRandomCode(Math.random().toString(36).substring(2, 8));
    setModalOpen(true);
  };

  const confirmAddUpcomingYear = async () => {
    try {
      const newYear = (parseInt(financialYears[0]) + 1).toString();
      setFinancialYears((prevYears) => [newYear, ...prevYears]);
      setSelectedYear(newYear);
    } catch (error) {
      console.error('Error adding financial year:', error);
    }
    setModalOpen(false);
  };

  const backupDatabase = async () => {
    try {
      // Simulate backup
    } catch (error) {
      console.error('Unexpected error during database backup:', error);
    }
  };

  const restoreDatabase = async () => {
    try {
      // Simulate restore
    } catch (error) {
      console.error('Unexpected error during database restore:', error);
    }
  };

  const handleShowMoreYears = (event) => {
    event.stopPropagation();
    setPage((prevPage) => prevPage + 1);
    // Simulate adding more years
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
          <h2 className="text-2xl text-blue-900 font-semibold">Financial Year</h2>
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
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-full"
            >
              Add Financial Year
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-sm p-8 mb-5">
        <div className="flex justify-between items-center w-full mb-0">
          <h2 className="text-2xl text-blue-900 font-semibold">Backup and Restore</h2>
          <div className="flex gap-2.5">
            <Button onClick={backupDatabase} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Backup Database
            </Button>
            <Button onClick={restoreDatabase} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Restore Database
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-blue-900 font-semibold">Employee Levels</h2>
            <Button onClick={handleAddEmployeeLevel} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Level
            </Button>
          </div>
          {employeeLevels.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeLevels.map((level) => (
                  <TableRow key={level._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {level._id}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {level.LevelName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={() => handleEditEmployeeLevel(level)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteLevel(level._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-blue-900 font-semibold">Employee Roles</h2>
            <Button onClick={handleAddEmployeeRole} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Role
            </Button>
          </div>
          {employeeRoles.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeRoles.map((role) => (
                  <TableRow key={role._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {role._id}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {role.RoleName}
                    </TableCell>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      <button
                        className="text-gray-500 hover:text-blue-500 mx-1"
                        title="Edit"
                        onClick={() => handleEditEmployeeRole(role)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteRole(role._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-blue-900 font-semibold">Organisations</h2>
            <Button onClick={handleAddOrganisation} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Organisation
            </Button>
          </div>
          {organisations.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Abbreviation</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Reg. Number</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organisations.map((org) => (
                  <TableRow key={org._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {org._id}
                    </TableCell>
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
                        onClick={() => handleEditOrganisation(org)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-gray-500 hover:text-red-500 mx-1"
                        title="Delete"
                        onClick={() => deleteOrganisation(org._id)}
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-black font-normal">Bank Details</h2>
            <Button onClick={handleAddBankDetail} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Bank Detail
            </Button>
          </div>
          {bankDetails.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
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
                      {detail._id}
                    </TableCell>
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
                        onClick={() => handleEditBankDetail(detail)}
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
          )}
        </div>
      </div>

      <div className="flex justify-between w-full gap-5">
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-blue-900 font-semibold">Currencies</h2>
            <Button onClick={handleAddCurrency} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Currency
            </Button>
          </div>
          {currencies.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Code</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Name</TableHead>
                  <TableHead className="text-center text-sm font-semibold text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency._id}>
                    <TableCell className="text-center text-sm text-black border-b-2 border-gray-100">
                      {currency._id}
                    </TableCell>
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
                        onClick={() => handleEditCurrency(currency)}
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
          )}
        </div>
        <div className="flex-1 bg-white rounded-3xl shadow-sm p-8 mb-5 max-h-[300px] overflow-y-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl text-blue-900 font-semibold">Currency Exchange Rate</h2>
            <Button onClick={handleAddExchangeRate} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full">
              Add New Exchange Rate
            </Button>
          </div>
          {exchangeRates.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-center text-sm font-semibold text-black">ID</TableHead>
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
                      {rate._id}
                    </TableCell>
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
                        onClick={() => handleEditExchangeRate(rate)}
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
          )}
        </div>
      </div>

      <RoleModal
        open={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        mode={roleModalMode}
        initialData={roleModalData}
        onSubmit={handleRoleSubmit}
      />
      <OrganisationModal
        open={organisationModalOpen}
        onClose={() => setOrganisationModalOpen(false)}
        mode={organisationModalMode}
        initialData={organisationModalData}
        onSubmit={handleOrganisationSubmit}
      />
      <LevelModal
        open={levelModalOpen}
        onClose={() => setLevelModalOpen(false)}
        mode={levelModalMode}
        initialData={levelModalData}
        onSubmit={handleLevelSubmit}
      />
      <CurrencyExchangeModal
        open={currencyExchangeModalOpen}
        onClose={() => setCurrencyExchangeModalOpen(false)}
        mode={currencyExchangeModalMode}
        initialData={currencyExchangeModalData}
        onSubmit={handleExchangeRateSubmit}
        currencies={currencies}
      />
      <CurrencyModal
        open={currencyModalOpen}
        onClose={() => setCurrencyModalOpen(false)}
        mode={currencyModalMode}
        initialData={currencyModalData}
        onSubmit={handleCurrencySubmit}
      />
      <BankDetailModal
        open={bankDetailModalOpen}
        onClose={() => setBankDetailModalOpen(false)}
        mode={bankDetailModalMode}
        initialData={bankDetailModalData}
        onSubmit={handleBankDetailSubmit}
      />
      <ConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAddUpcomingYear}
        randomCode={randomCode}
      />
    </div>
  );
};

export default OtherSettings;