'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Disable foreign key checks temporarily
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    
    try {

      // Seed Currency
      await queryInterface.bulkInsert('Currency', [
      {
            "id": 1,
            "CurrencyCode": "USD",
            "CurrencyName": "US Dollar",
            "createdAt": "2025-05-09 06:01:21.883 +00:00",
            "updatedAt": "2025-05-09 06:01:21.883 +00:00"
      },
      {
            "id": 2,
            "CurrencyCode": "EUR",
            "CurrencyName": "Euro",
            "createdAt": "2025-05-09 06:01:21.883 +00:00",
            "updatedAt": "2025-05-09 06:01:21.883 +00:00"
      },
      {
            "id": 3,
            "CurrencyCode": "INR",
            "CurrencyName": "Indian Rupee",
            "createdAt": "2025-05-09 06:01:21.883 +00:00",
            "updatedAt": "2025-05-09 06:01:21.883 +00:00"
      }
], {});

      // Seed Role
      await queryInterface.bulkInsert('Role', [
      {
            "id": 1,
            "RoleName": "Software Engineer",
            "createdAt": "2025-05-09 06:01:21.876 +00:00",
            "updatedAt": "2025-05-09 06:01:21.876 +00:00"
      },
      {
            "id": 2,
            "RoleName": "Project Manager",
            "createdAt": "2025-05-09 06:01:21.876 +00:00",
            "updatedAt": "2025-05-09 06:01:21.876 +00:00"
      },
      {
            "id": 3,
            "RoleName": "Business Analyst",
            "createdAt": "2025-05-09 06:01:21.876 +00:00",
            "updatedAt": "2025-05-09 06:01:21.876 +00:00"
      },
      {
            "id": 4,
            "RoleName": "SDET",
            "createdAt": "2025-05-10 01:41:41.816 +00:00",
            "updatedAt": "2025-05-10 01:41:41.816 +00:00"
      }
], {});

      // Seed Level
      await queryInterface.bulkInsert('Level', [
      {
            "id": 1,
            "LevelName": "Junior",
            "createdAt": "2025-05-09 06:01:21.880 +00:00",
            "updatedAt": "2025-05-09 06:01:21.880 +00:00"
      },
      {
            "id": 2,
            "LevelName": "Mid",
            "createdAt": "2025-05-09 06:01:21.880 +00:00",
            "updatedAt": "2025-05-09 06:01:21.880 +00:00"
      },
      {
            "id": 3,
            "LevelName": "Senior",
            "createdAt": "2025-05-09 06:01:21.880 +00:00",
            "updatedAt": "2025-05-09 06:01:21.880 +00:00"
      },
      {
            "id": 4,
            "LevelName": "Lowrr",
            "createdAt": "2025-05-10 01:40:56.460 +00:00",
            "updatedAt": "2025-05-10 01:41:26.415 +00:00"
      }
], {});

      // Seed Organisation
      await queryInterface.bulkInsert('Organisation', [
      {
            "id": 1,
            "OrganisationName": "razorpay",
            "Abbreviation": "rpr",
            "RegNumber": "REG789012",
            "createdAt": "2025-05-09 06:01:21.868 +00:00",
            "updatedAt": "2025-05-09 06:19:50.691 +00:00",
            "deletedAt": null
      },
      {
            "id": 2,
            "OrganisationName": "Fetchpay",
            "Abbreviation": "fcp",
            "RegNumber": "REG12345",
            "createdAt": "2025-05-09 06:18:28.777 +00:00",
            "updatedAt": "2025-05-09 06:18:28.777 +00:00",
            "deletedAt": null
      },
      {
            "id": 3,
            "OrganisationName": "Xift",
            "Abbreviation": "xft",
            "RegNumber": "REG12349",
            "createdAt": "2025-05-09 06:18:44.702 +00:00",
            "updatedAt": "2025-05-09 06:18:44.702 +00:00",
            "deletedAt": null
      }
], {});

      // Seed CurrencyExchangeRate
      await queryInterface.bulkInsert('CurrencyExchangeRate', [
      {
            "id": 1,
            "CurrencyFromID": 1,
            "CurrencyToID": 3,
            "Rate": 82.5,
            "Year": 2024,
            "createdAt": "2025-05-09 06:01:21.896 +00:00",
            "updatedAt": "2025-05-09 06:01:21.896 +00:00"
      },
      {
            "id": 2,
            "CurrencyFromID": 2,
            "CurrencyToID": 3,
            "Rate": 89.75,
            "Year": 2024,
            "createdAt": "2025-05-09 06:01:21.896 +00:00",
            "updatedAt": "2025-05-09 06:01:21.896 +00:00"
      },
      {
            "id": 3,
            "CurrencyFromID": 1,
            "CurrencyToID": 2,
            "Rate": 80.123456,
            "Year": 2024,
            "createdAt": "2025-05-10 03:59:27.382 +00:00",
            "updatedAt": "2025-05-10 03:59:27.382 +00:00"
      },
      {
            "id": 4,
            "CurrencyFromID": 2,
            "CurrencyToID": 3,
            "Rate": 90.5,
            "Year": 2025,
            "createdAt": "2025-05-10 04:50:35",
            "updatedAt": "2025-05-10 04:50:35"
      },
      {
            "id": 5,
            "CurrencyFromID": 1,
            "CurrencyToID": 3,
            "Rate": 83.5,
            "Year": 2025,
            "createdAt": "2025-05-10 05:31:08.839 +00:00",
            "updatedAt": "2025-05-10 05:31:08.839 +00:00"
      }
], {});

      // Seed BankDetail
      await queryInterface.bulkInsert('BankDetail', [
      {
            "id": 1,
            "BankName": "HDFC Bank",
            "AccountNumber": "1234567890",
            "SwiftCode": "HDFCfd",
            "IFSC": "HDFC0001234",
            "createdAt": "2025-05-10 06:29:31.436 +00:00",
            "updatedAt": "2025-05-10 06:38:53.513 +00:00"
      },
      {
            "id": 2,
            "BankName": "State Bank of India",
            "AccountNumber": "987654321098",
            "SwiftCode": "SBININBBXXX",
            "IFSC": "SBIN0005678",
            "createdAt": "2025-05-10 06:29:54.301 +00:00",
            "updatedAt": "2025-05-10 06:29:54.301 +00:00"
      },
      {
            "id": 3,
            "BankName": "ICICI Bank",
            "AccountNumber": "112233445566",
            "SwiftCode": "ICICINBBXXX",
            "IFSC": "ICIC0004321",
            "createdAt": "2025-05-10 06:39:58.994 +00:00",
            "updatedAt": "2025-05-10 06:39:58.994 +00:00"
      },
      {
            "id": 4,
            "BankName": "DENA Bank",
            "AccountNumber": "112133445566",
            "SwiftCode": "DENABBXXX",
            "IFSC": "DENAC0004321",
            "createdAt": "2025-05-10 06:41:13.714 +00:00",
            "updatedAt": "2025-05-10 06:41:13.714 +00:00"
      }
], {});

      // Seed Client
      await queryInterface.bulkInsert('Client', [
      {
            "id": 1,
            "ClientName": "Acme Corporation",
            "Abbreviation": "ACME",
            "ContactPerson": "Alice Johnson",
            "Email": "alice@acme.com",
            "RegisteredAddress": "123 Business Ave, Suite 100",
            "BillingCurrencyID": 1,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "paymentLastUpdated": "2025-05-09 19:01:09.380 +00:00",
            "deletedAt": null,
            "createdAt": "2025-05-09 06:01:21.890 +00:00",
            "updatedAt": "2025-05-09 19:01:09.380 +00:00"
      },
      {
            "id": 2,
            "ClientName": "Global Enterprises",
            "Abbreviation": "GE",
            "ContactPerson": "Bob Wilson",
            "Email": "bob@globalent.com",
            "RegisteredAddress": "456 Corporate Blvd",
            "BillingCurrencyID": 2,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "paymentLastUpdated": null,
            "deletedAt": null,
            "createdAt": "2025-05-09 06:01:21.890 +00:00",
            "updatedAt": "2025-05-09 06:01:21.890 +00:00"
      },
      {
            "id": 3,
            "ClientName": "Tech Innovators Pvt Ltd",
            "Abbreviation": "TIPL",
            "ContactPerson": "Piyush Joshi",
            "Email": "piyush@globex.com",
            "RegisteredAddress": "123 Market Street, India",
            "BillingCurrencyID": 1,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "paymentLastUpdated": "2024-12-15 00:00:00.000 +00:00",
            "deletedAt": null,
            "createdAt": "2025-05-09 16:24:57.809 +00:00",
            "updatedAt": "2025-05-09 16:24:57.809 +00:00"
      },
      {
            "id": 4,
            "ClientName": "Tech Innovators Pvt Ltd",
            "Abbreviation": "TIPL",
            "ContactPerson": "Piyush Joshi",
            "Email": "piyush@globex.com",
            "RegisteredAddress": "123 Market Street, India",
            "BillingCurrencyID": 1,
            "OrganisationID": "681b9b550d4329f3ee3a08b4",
            "BankDetailID": "681ba2930d4329f3ee3a08d2",
            "paymentLastUpdated": "2024-12-15 00:00:00.000 +00:00",
            "deletedAt": null,
            "createdAt": "2025-05-09 18:10:36.101 +00:00",
            "updatedAt": "2025-05-09 18:10:36.101 +00:00"
      }
], {});

      // Seed Employee
      await queryInterface.bulkInsert('Employee', [
      {
            "id": 1,
            "FirstName": "John",
            "LastName": "Doe",
            "EmpCode": "EMP001",
            "RoleID": 1,
            "LevelID": 2,
            "OrganisationID": 1,
            "CTCAnnual": 75000,
            "CTCMonthly": 6250,
            "ContactNumber": "+1234567890",
            "Email": "john.doe@techsolutions.com",
            "Status": "Inactive",
            "deletedAt": null,
            "createdAt": "2025-05-09 06:01:21.888 +00:00",
            "updatedAt": "2025-05-10 09:21:12.051 +00:00"
      },
      {
            "id": 2,
            "FirstName": "Mia",
            "LastName": "Smith",
            "EmpCode": "EMP009",
            "RoleID": 1,
            "LevelID": 1,
            "OrganisationID": 2,
            "CTCAnnual": 1300000,
            "CTCMonthly": 108333.33,
            "ContactNumber": "+1234567890",
            "Email": "mia.smith@example.com",
            "Status": "Active",
            "deletedAt": null,
            "createdAt": "2025-05-09 06:01:21.888 +00:00",
            "updatedAt": "2025-05-09 06:37:53.494 +00:00"
      },
      {
            "id": 3,
            "FirstName": "Mallow",
            "LastName": "Brown",
            "EmpCode": "EMP005",
            "RoleID": 1,
            "LevelID": 1,
            "OrganisationID": 1,
            "CTCAnnual": 1200000,
            "CTCMonthly": 100000,
            "ContactNumber": "+1234567809",
            "Email": "mallow@example.com",
            "Status": "Active",
            "deletedAt": null,
            "createdAt": "2025-05-09 06:26:04.019 +00:00",
            "updatedAt": "2025-05-09 06:26:04.019 +00:00"
      }
], {});

      // Seed ClientEmployee
      await queryInterface.bulkInsert('ClientEmployee', [
      {
            "id": 2,
            "EmployeeID": 2,
            "ClientID": 2,
            "StartDate": "2023-02-01 00:00:00.000 +00:00",
            "EndDate": null,
            "MonthlyBilling": 9500,
            "Status": "Active",
            "createdAt": "2025-05-09 06:01:21.892 +00:00",
            "updatedAt": "2025-05-09 06:01:21.892 +00:00",
            "deletedAt": null
      },
      {
            "id": 3,
            "EmployeeID": 1,
            "ClientID": 1,
            "StartDate": "2024-01-01 00:00:00.000 +00:00",
            "EndDate": null,
            "MonthlyBilling": 1000,
            "Status": "Active",
            "createdAt": "2025-05-09 07:13:12.851 +00:00",
            "updatedAt": "2025-05-09 07:13:12.851 +00:00",
            "deletedAt": null
      },
      {
            "id": 4,
            "EmployeeID": 2,
            "ClientID": 1,
            "StartDate": "2024-01-01 00:00:00.000 +00:00",
            "EndDate": null,
            "MonthlyBilling": 1000,
            "Status": "Active",
            "createdAt": "2025-05-09 07:13:25.768 +00:00",
            "updatedAt": "2025-05-09 07:13:25.768 +00:00",
            "deletedAt": null
      },
      {
            "id": 5,
            "EmployeeID": 3,
            "ClientID": 2,
            "StartDate": "2024-01-01 00:00:00.000 +00:00",
            "EndDate": null,
            "MonthlyBilling": 1000,
            "Status": "Active",
            "createdAt": "2025-05-09 07:13:35.327 +00:00",
            "updatedAt": "2025-05-09 07:13:35.327 +00:00",
            "deletedAt": null
      },
      {
            "id": 7,
            "EmployeeID": 1,
            "ClientID": 2,
            "StartDate": "2024-01-01 00:00:00.000 +00:00",
            "EndDate": null,
            "MonthlyBilling": 1000,
            "Status": "Active",
            "createdAt": "2025-05-09 16:24:44.535 +00:00",
            "updatedAt": "2025-05-09 16:24:44.535 +00:00",
            "deletedAt": null
      }
], {});

      // Seed FinancialYear
      await queryInterface.bulkInsert('FinancialYear', [
      {
            "id": 1,
            "year": 2023
      },
      {
            "id": 2,
            "year": 2024
      },
      {
            "id": 3,
            "year": 2025
      },
      {
            "id": 4,
            "year": 2026
      },
      {
            "id": 5,
            "year": 2027
      }
], {});

      // Seed EmployeeCost
      await queryInterface.bulkInsert('EmployeeCost', [
      {
            "id": 1,
            "EmployeeID": 1,
            "Year": 2025,
            "Apr": 6250,
            "May": 6250,
            "Jun": 6250,
            "Jul": 6250,
            "Aug": 6250,
            "Sep": 6250,
            "Oct": 6250,
            "Nov": 6250,
            "Dec": 6250,
            "Jan": 6250,
            "Feb": 6250,
            "Mar": 6250,
            "createdAt": "2025-05-09 19:54:23.791 +00:00",
            "updatedAt": "2025-05-09 19:54:23.791 +00:00"
      },
      {
            "id": 2,
            "EmployeeID": 2,
            "Year": 2025,
            "Apr": 108333.33,
            "May": 108333.33,
            "Jun": 108333.33,
            "Jul": 108333.33,
            "Aug": 108333.33,
            "Sep": 108333.33,
            "Oct": 108333.33,
            "Nov": 108333.33,
            "Dec": 108333.33,
            "Jan": 108333.33,
            "Feb": 108333.33,
            "Mar": 108333.33,
            "createdAt": "2025-05-09 19:54:23.791 +00:00",
            "updatedAt": "2025-05-09 19:54:23.791 +00:00"
      },
      {
            "id": 3,
            "EmployeeID": 3,
            "Year": 2025,
            "Apr": 100000,
            "May": 100000,
            "Jun": 100000,
            "Jul": 100000,
            "Aug": 100000,
            "Sep": 100000,
            "Oct": 100000,
            "Nov": 100000,
            "Dec": 100000,
            "Jan": 100000,
            "Feb": 100000,
            "Mar": 100000,
            "createdAt": "2025-05-09 19:54:23.791 +00:00",
            "updatedAt": "2025-05-09 19:54:23.791 +00:00"
      },
      {
            "id": 4,
            "EmployeeID": 1,
            "Year": 2026,
            "Apr": 6250,
            "May": 6250,
            "Jun": 6250,
            "Jul": 6250,
            "Aug": 6250,
            "Sep": 6250,
            "Oct": 6250,
            "Nov": 6250,
            "Dec": 6250,
            "Jan": 6250,
            "Feb": 6250,
            "Mar": 6250,
            "createdAt": "2025-05-10 04:32:35.195 +00:00",
            "updatedAt": "2025-05-10 04:32:35.195 +00:00"
      },
      {
            "id": 5,
            "EmployeeID": 2,
            "Year": 2026,
            "Apr": 108333.33,
            "May": 108333.33,
            "Jun": 108333.33,
            "Jul": 108333.33,
            "Aug": 108333.33,
            "Sep": 108333.33,
            "Oct": 108333.33,
            "Nov": 108333.33,
            "Dec": 108333.33,
            "Jan": 108333.33,
            "Feb": 108333.33,
            "Mar": 108333.33,
            "createdAt": "2025-05-10 04:32:35.195 +00:00",
            "updatedAt": "2025-05-10 04:32:35.195 +00:00"
      },
      {
            "id": 6,
            "EmployeeID": 3,
            "Year": 2026,
            "Apr": 100000,
            "May": 100000,
            "Jun": 100000,
            "Jul": 100000,
            "Aug": 100000,
            "Sep": 100000,
            "Oct": 100000,
            "Nov": 100000,
            "Dec": 100000,
            "Jan": 100000,
            "Feb": 100000,
            "Mar": 100000,
            "createdAt": "2025-05-10 04:32:35.195 +00:00",
            "updatedAt": "2025-05-10 04:32:35.195 +00:00"
      },
      {
            "id": 7,
            "EmployeeID": 1,
            "Year": 2027,
            "Apr": 6250,
            "May": 6250,
            "Jun": 6250,
            "Jul": 6250,
            "Aug": 6250,
            "Sep": 6250,
            "Oct": 6250,
            "Nov": 6250,
            "Dec": 6250,
            "Jan": 6250,
            "Feb": 6250,
            "Mar": 6250,
            "createdAt": "2025-05-10 07:39:04.916 +00:00",
            "updatedAt": "2025-05-10 07:39:04.916 +00:00"
      },
      {
            "id": 8,
            "EmployeeID": 2,
            "Year": 2027,
            "Apr": 108333.33,
            "May": 108333.33,
            "Jun": 108333.33,
            "Jul": 108333.33,
            "Aug": 108333.33,
            "Sep": 108333.33,
            "Oct": 108333.33,
            "Nov": 108333.33,
            "Dec": 108333.33,
            "Jan": 108333.33,
            "Feb": 108333.33,
            "Mar": 108333.33,
            "createdAt": "2025-05-10 07:39:04.916 +00:00",
            "updatedAt": "2025-05-10 07:39:04.916 +00:00"
      },
      {
            "id": 9,
            "EmployeeID": 3,
            "Year": 2027,
            "Apr": 100000,
            "May": 100000,
            "Jun": 100000,
            "Jul": 100000,
            "Aug": 100000,
            "Sep": 100000,
            "Oct": 100000,
            "Nov": 100000,
            "Dec": 100000,
            "Jan": 100000,
            "Feb": 100000,
            "Mar": 100000,
            "createdAt": "2025-05-10 07:39:04.916 +00:00",
            "updatedAt": "2025-05-10 07:39:04.916 +00:00"
      }
], {});

      // Seed BillingDetail
      await queryInterface.bulkInsert('BillingDetail', [
      {
            "id": 1,
            "EmployeeID": 1,
            "ClientID": 1,
            "Year": 2024,
            "Apr": 8500,
            "May": 8500,
            "Jun": 8000,
            "Jul": 0,
            "Aug": 0,
            "Sep": 0,
            "Oct": 0,
            "Nov": 0,
            "Dec": 0,
            "Jan": 0,
            "Feb": 0,
            "Mar": 0,
            "createdAt": "2025-05-09 06:01:21.901 +00:00",
            "updatedAt": "2025-05-09 07:28:39.272 +00:00"
      },
      {
            "id": 2,
            "EmployeeID": 2,
            "ClientID": 2,
            "Year": 2024,
            "Apr": 100000,
            "May": 9500,
            "Jun": 9500,
            "Jul": 0,
            "Aug": 123456,
            "Sep": 0,
            "Oct": 0,
            "Nov": 0,
            "Dec": 0,
            "Jan": 0,
            "Feb": 0,
            "Mar": 0,
            "createdAt": "2025-05-09 06:01:21.901 +00:00",
            "updatedAt": "2025-05-09 08:17:15.052 +00:00"
      },
      {
            "id": 3,
            "EmployeeID": 2,
            "ClientID": 1,
            "Year": 2024,
            "Apr": 8000,
            "May": 8000,
            "Jun": 8000,
            "Jul": 8000,
            "Aug": 8000,
            "Sep": 8000,
            "Oct": 8000,
            "Nov": 8000,
            "Dec": 8000,
            "Jan": 8000,
            "Feb": 8000,
            "Mar": 8000,
            "createdAt": "2025-05-09 07:25:56.148 +00:00",
            "updatedAt": "2025-05-09 07:25:56.148 +00:00"
      },
      {
            "id": 4,
            "EmployeeID": 3,
            "ClientID": 2,
            "Year": 2024,
            "Apr": 8000,
            "May": 8000,
            "Jun": 8000,
            "Jul": 16000,
            "Aug": 8000,
            "Sep": 8000,
            "Oct": 8000,
            "Nov": 8000,
            "Dec": 8000,
            "Jan": 8000,
            "Feb": 8000,
            "Mar": 8000,
            "createdAt": "2025-05-09 07:26:13.095 +00:00",
            "updatedAt": "2025-05-09 07:26:13.095 +00:00"
      },
      {
            "id": 5,
            "EmployeeID": 1,
            "ClientID": 1,
            "Year": 2025,
            "Apr": 8000,
            "May": 8000,
            "Jun": 8000,
            "Jul": 8000,
            "Aug": 8000,
            "Sep": 8000,
            "Oct": 8000,
            "Nov": 8000,
            "Dec": 8000,
            "Jan": 8000,
            "Feb": 8000,
            "Mar": 8000,
            "createdAt": "2025-05-09 19:54:23.785 +00:00",
            "updatedAt": "2025-05-09 19:54:23.785 +00:00"
      },
      {
            "id": 6,
            "EmployeeID": 2,
            "ClientID": 2,
            "Year": 2025,
            "Apr": 9500,
            "May": 9500,
            "Jun": 9500,
            "Jul": 9500,
            "Aug": 9500,
            "Sep": 9500,
            "Oct": 9500,
            "Nov": 9500,
            "Dec": 9500,
            "Jan": 9500,
            "Feb": 9500,
            "Mar": 9500,
            "createdAt": "2025-05-09 19:54:23.785 +00:00",
            "updatedAt": "2025-05-09 19:54:23.785 +00:00"
      },
      {
            "id": 8,
            "EmployeeID": 2,
            "ClientID": 1,
            "Year": 2025,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-09 19:54:23.785 +00:00",
            "updatedAt": "2025-05-09 19:54:23.785 +00:00"
      },
      {
            "id": 9,
            "EmployeeID": 3,
            "ClientID": 2,
            "Year": 2025,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-09 19:54:23.785 +00:00",
            "updatedAt": "2025-05-09 19:54:23.785 +00:00"
      },
      {
            "id": 10,
            "EmployeeID": 1,
            "ClientID": 2,
            "Year": 2025,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-09 19:54:23.785 +00:00",
            "updatedAt": "2025-05-09 19:54:23.785 +00:00"
      },
      {
            "id": 12,
            "EmployeeID": 1,
            "ClientID": 1,
            "Year": 2026,
            "Apr": 8000,
            "May": 8000,
            "Jun": 8000,
            "Jul": 8000,
            "Aug": 8000,
            "Sep": 8000,
            "Oct": 8000,
            "Nov": 8000,
            "Dec": 8000,
            "Jan": 8000,
            "Feb": 8000,
            "Mar": 8000,
            "createdAt": "2025-05-10 04:32:35.187 +00:00",
            "updatedAt": "2025-05-10 04:32:35.187 +00:00"
      },
      {
            "id": 13,
            "EmployeeID": 2,
            "ClientID": 2,
            "Year": 2026,
            "Apr": 9500,
            "May": 9500,
            "Jun": 9500,
            "Jul": 9500,
            "Aug": 9500,
            "Sep": 9500,
            "Oct": 9500,
            "Nov": 9500,
            "Dec": 9500,
            "Jan": 9500,
            "Feb": 9500,
            "Mar": 9500,
            "createdAt": "2025-05-10 04:32:35.187 +00:00",
            "updatedAt": "2025-05-10 04:32:35.187 +00:00"
      },
      {
            "id": 15,
            "EmployeeID": 2,
            "ClientID": 1,
            "Year": 2026,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 04:32:35.187 +00:00",
            "updatedAt": "2025-05-10 04:32:35.187 +00:00"
      },
      {
            "id": 16,
            "EmployeeID": 3,
            "ClientID": 2,
            "Year": 2026,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 04:32:35.187 +00:00",
            "updatedAt": "2025-05-10 04:32:35.187 +00:00"
      },
      {
            "id": 17,
            "EmployeeID": 1,
            "ClientID": 2,
            "Year": 2026,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 04:32:35.187 +00:00",
            "updatedAt": "2025-05-10 04:32:35.187 +00:00"
      },
      {
            "id": 19,
            "EmployeeID": 1,
            "ClientID": 1,
            "Year": 2027,
            "Apr": 8000,
            "May": 8000,
            "Jun": 8000,
            "Jul": 8000,
            "Aug": 8000,
            "Sep": 8000,
            "Oct": 8000,
            "Nov": 8000,
            "Dec": 8000,
            "Jan": 8000,
            "Feb": 8000,
            "Mar": 8000,
            "createdAt": "2025-05-10 07:39:04.911 +00:00",
            "updatedAt": "2025-05-10 07:39:04.911 +00:00"
      },
      {
            "id": 20,
            "EmployeeID": 2,
            "ClientID": 2,
            "Year": 2027,
            "Apr": 9500,
            "May": 9500,
            "Jun": 9500,
            "Jul": 9500,
            "Aug": 9500,
            "Sep": 9500,
            "Oct": 9500,
            "Nov": 9500,
            "Dec": 9500,
            "Jan": 9500,
            "Feb": 9500,
            "Mar": 9500,
            "createdAt": "2025-05-10 07:39:04.911 +00:00",
            "updatedAt": "2025-05-10 07:39:04.911 +00:00"
      },
      {
            "id": 22,
            "EmployeeID": 2,
            "ClientID": 1,
            "Year": 2027,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 07:39:04.911 +00:00",
            "updatedAt": "2025-05-10 07:39:04.911 +00:00"
      },
      {
            "id": 23,
            "EmployeeID": 3,
            "ClientID": 2,
            "Year": 2027,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 07:39:04.911 +00:00",
            "updatedAt": "2025-05-10 07:39:04.911 +00:00"
      },
      {
            "id": 24,
            "EmployeeID": 1,
            "ClientID": 2,
            "Year": 2027,
            "Apr": 1000,
            "May": 1000,
            "Jun": 1000,
            "Jul": 1000,
            "Aug": 1000,
            "Sep": 1000,
            "Oct": 1000,
            "Nov": 1000,
            "Dec": 1000,
            "Jan": 1000,
            "Feb": 1000,
            "Mar": 1000,
            "createdAt": "2025-05-10 07:39:04.911 +00:00",
            "updatedAt": "2025-05-10 07:39:04.911 +00:00"
      }
], {});

      // Seed Invoice
      await queryInterface.bulkInsert('Invoices', [
      {
            "id": 1,
            "ClientID": 1,
            "BillingCurrencyID": 1,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "1.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:22.968 +00:00",
            "createdAt": "2025-05-09 17:28:22.969 +00:00",
            "updatedAt": "2025-05-09 17:28:23.063 +00:00",
            "deletedAt": null
      },
      {
            "id": 2,
            "ClientID": 2,
            "BillingCurrencyID": 2,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "2.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:23.064 +00:00",
            "createdAt": "2025-05-09 17:28:23.064 +00:00",
            "updatedAt": "2025-05-09 17:28:23.080 +00:00",
            "deletedAt": null
      },
      {
            "id": 3,
            "ClientID": 1,
            "BillingCurrencyID": 1,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "3.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:25.969 +00:00",
            "createdAt": "2025-05-09 17:28:25.969 +00:00",
            "updatedAt": "2025-05-09 17:28:25.990 +00:00",
            "deletedAt": null
      },
      {
            "id": 4,
            "ClientID": 2,
            "BillingCurrencyID": 2,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "4.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:25.992 +00:00",
            "createdAt": "2025-05-09 17:28:25.992 +00:00",
            "updatedAt": "2025-05-09 17:28:26.012 +00:00",
            "deletedAt": null
      },
      {
            "id": 5,
            "ClientID": 1,
            "BillingCurrencyID": 1,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "5.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:27.110 +00:00",
            "createdAt": "2025-05-09 17:28:27.110 +00:00",
            "updatedAt": "2025-05-09 17:28:27.143 +00:00",
            "deletedAt": null
      },
      {
            "id": 6,
            "ClientID": 2,
            "BillingCurrencyID": 2,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "6.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:27.147 +00:00",
            "createdAt": "2025-05-09 17:28:27.147 +00:00",
            "updatedAt": "2025-05-09 17:28:27.163 +00:00",
            "deletedAt": null
      },
      {
            "id": 7,
            "ClientID": 1,
            "BillingCurrencyID": 1,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "7.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:28.022 +00:00",
            "createdAt": "2025-05-09 17:28:28.022 +00:00",
            "updatedAt": "2025-05-09 17:28:28.040 +00:00",
            "deletedAt": null
      },
      {
            "id": 8,
            "ClientID": 2,
            "BillingCurrencyID": 2,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "8.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:28:28.042 +00:00",
            "createdAt": "2025-05-09 17:28:28.042 +00:00",
            "updatedAt": "2025-05-09 17:28:28.058 +00:00",
            "deletedAt": null
      },
      {
            "id": 9,
            "ClientID": 1,
            "BillingCurrencyID": 1,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Generated",
            "PdfPath": "9.pdf",
            "InvoicedOn": null,
            "GeneratedOn": "2025-05-09 17:31:24.512 +00:00",
            "createdAt": "2025-05-09 17:31:24.512 +00:00",
            "updatedAt": "2025-05-09 17:31:24.553 +00:00",
            "deletedAt": null
      },
      {
            "id": 10,
            "ClientID": 2,
            "BillingCurrencyID": 2,
            "Year": 2024,
            "Month": 3,
            "TotalAmount": 0,
            "OrganisationID": 1,
            "BankDetailID": 1,
            "Status": "Sent",
            "PdfPath": "10.pdf",
            "InvoicedOn": "2025-05-09 18:25:37.714 +00:00",
            "GeneratedOn": "2025-05-09 17:31:24.555 +00:00",
            "createdAt": "2025-05-09 17:31:24.555 +00:00",
            "updatedAt": "2025-05-09 18:25:37.715 +00:00",
            "deletedAt": null
      }
], {});

      // Seed Ledger
      await queryInterface.bulkInsert('Ledger', [
      {
            "id": 1,
            "ClientID": 1,
            "Date": "2024-04-01 00:00:00.000 +00:00",
            "Amount": 8000,
            "Balance": 3000,
            "createdAt": "2025-05-09 06:01:21.905 +00:00",
            "updatedAt": "2025-05-09 19:01:09.383 +00:00"
      },
      {
            "id": 2,
            "ClientID": 2,
            "Date": "2024-04-01 00:00:00.000 +00:00",
            "Amount": 9500,
            "Balance": 9500,
            "createdAt": "2025-05-09 06:01:21.905 +00:00",
            "updatedAt": "2025-05-09 06:01:21.905 +00:00"
      }
], {});

      // Seed PaymentTracker
      await queryInterface.bulkInsert('PaymentTracker', [
      {
            "id": 1,
            "ClientID": 1,
            "ReceivedDate": "2024-05-01 00:00:00.000 +00:00",
            "Amount": 8000,
            "Remark": "April 2024 payment",
            "createdAt": "2025-05-09 06:01:21.904 +00:00",
            "updatedAt": "2025-05-09 06:01:21.904 +00:00"
      },
      {
            "id": 2,
            "ClientID": 2,
            "ReceivedDate": "2024-05-01 00:00:00.000 +00:00",
            "Amount": 9500,
            "Remark": "April 2024 payment",
            "createdAt": "2025-05-09 06:01:21.904 +00:00",
            "updatedAt": "2025-05-09 06:01:21.904 +00:00"
      },
      {
            "id": 3,
            "ClientID": 1,
            "ReceivedDate": "2024-03-20 10:00:00.000 +00:00",
            "Amount": 5000,
            "Remark": "Payment for March 2024 invoices",
            "createdAt": "2025-05-09 18:56:22.834 +00:00",
            "updatedAt": "2025-05-09 18:56:22.834 +00:00"
      },
      {
            "id": 4,
            "ClientID": 1,
            "ReceivedDate": "2024-04-20 10:00:00.000 +00:00",
            "Amount": 5000,
            "Remark": "Payment for March 2024 invoices",
            "createdAt": "2025-05-09 19:00:58.567 +00:00",
            "updatedAt": "2025-05-09 19:00:58.567 +00:00"
      },
      {
            "id": 5,
            "ClientID": 1,
            "ReceivedDate": "2024-05-20 10:00:00.000 +00:00",
            "Amount": 5000,
            "Remark": "Payment for March 2024 invoices",
            "createdAt": "2025-05-09 19:01:01.708 +00:00",
            "updatedAt": "2025-05-09 19:01:01.708 +00:00"
      },
      {
            "id": 6,
            "ClientID": 1,
            "ReceivedDate": "2024-06-20 10:00:00.000 +00:00",
            "Amount": 5000,
            "Remark": "Payment for March 2024 invoices",
            "createdAt": "2025-05-09 19:01:05.263 +00:00",
            "updatedAt": "2025-05-09 19:01:05.263 +00:00"
      },
      {
            "id": 7,
            "ClientID": 1,
            "ReceivedDate": "2024-07-20 10:00:00.000 +00:00",
            "Amount": 5000,
            "Remark": "Payment for March 2024 invoices",
            "createdAt": "2025-05-09 19:01:09.378 +00:00",
            "updatedAt": "2025-05-09 19:01:09.378 +00:00"
      }
], {});

      // Seed ReconciliationNote
      await queryInterface.bulkInsert('ReconciliationNote', [
      {
            "id": 1,
            "note": "April 2024 reconciliation completed for Acme Corp",
            "createdAt": "2025-05-09 06:01:21.906 +00:00",
            "updatedAt": "2025-05-09 06:01:21.906 +00:00"
      },
      {
            "id": 2,
            "note": "April 2024 reconciliation completed for Global Enterprises",
            "createdAt": "2025-05-09 06:01:21.907 +00:00",
            "updatedAt": "2025-05-09 06:01:21.907 +00:00"
      }
], {});

    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Disable foreign key checks temporarily
    await queryInterface.sequelize.query('PRAGMA foreign_keys = OFF;');
    
    try {

      // Remove ReconciliationNote data
      await queryInterface.bulkDelete('ReconciliationNote', null, {});

      // Remove PaymentTracker data
      await queryInterface.bulkDelete('PaymentTracker', null, {});

      // Remove Ledger data
      await queryInterface.bulkDelete('Ledger', null, {});

      // Remove Invoice data
      await queryInterface.bulkDelete('Invoices', null, {});

      // Remove BillingDetail data
      await queryInterface.bulkDelete('BillingDetail', null, {});

      // Remove EmployeeCost data
      await queryInterface.bulkDelete('EmployeeCost', null, {});

      // Remove FinancialYear data
      await queryInterface.bulkDelete('FinancialYear', null, {});

      // Remove ClientEmployee data
      await queryInterface.bulkDelete('ClientEmployee', null, {});

      // Remove Employee data
      await queryInterface.bulkDelete('Employee', null, {});

      // Remove Client data
      await queryInterface.bulkDelete('Client', null, {});

      // Remove BankDetail data
      await queryInterface.bulkDelete('BankDetail', null, {});

      // Remove CurrencyExchangeRate data
      await queryInterface.bulkDelete('CurrencyExchangeRate', null, {});

      // Remove Organisation data
      await queryInterface.bulkDelete('Organisation', null, {});

      // Remove Level data
      await queryInterface.bulkDelete('Level', null, {});

      // Remove Role data
      await queryInterface.bulkDelete('Role', null, {});

      // Remove Currency data
      await queryInterface.bulkDelete('Currency', null, {});

    } finally {
      // Re-enable foreign key checks
      await queryInterface.sequelize.query('PRAGMA foreign_keys = ON;');
    }
  }
};