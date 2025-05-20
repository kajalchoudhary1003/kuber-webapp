// API Configuration
const API_BASE_URL = '/api';  // This will be proxied through Nginx

export const API_ENDPOINTS = {

  // API Base URL
  API_BASE_URL: API_BASE_URL,
  // Financial Years
  FINANCIAL_YEARS: `${API_BASE_URL}/financial-years`,
  
  // Clients
  CLIENTS: `${API_BASE_URL}/clients`,
  
  // Client Employees
  CLIENT_EMPLOYEES: `${API_BASE_URL}/client-employees`,
  
  // Employees
  EMPLOYEES: `${API_BASE_URL}/employees`,
  
  // Employee Cost
  EMPLOYEE_COST: `${API_BASE_URL}/employee-cost`,
  
  // Roles
  ROLES: `${API_BASE_URL}/roles`,
  
  // Levels
  LEVELS: `${API_BASE_URL}/levels`,
  
  // Organisations
  ORGANISATIONS: `${API_BASE_URL}/organisations`,
  
  // Currencies
  CURRENCIES: `${API_BASE_URL}/currencies`,
  
  // Exchange Rates
  EXCHANGE_RATES: `${API_BASE_URL}/exchange-rates`,
  
  // Bank Details
  BANK_DETAILS: `${API_BASE_URL}/bank-details`,
  
  // Billing
  BILLING: `${API_BASE_URL}/billing`,
  
  // Invoices
  INVOICES: `${API_BASE_URL}/invoices`,
  
  // Ledger
  LEDGER: `${API_BASE_URL}/ledger`,
  
  // Client Balance
  CLIENT_BALANCE: `${API_BASE_URL}/client-balance`,
  
  // Payment Tracker
  PAYMENT_TRACKER: `${API_BASE_URL}/payment-tracker`,
  
  // Profitability
  PROFITABILITY: `${API_BASE_URL}/profitability`,

  // Backup and Restore
  BACKUP: `${API_BASE_URL}/backup`,
  
};

export default API_ENDPOINTS