import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';

const EmployeeTableRow = ({ data, onEdit, onDelete, roles, levels, organisations }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/employee-detail/${data._id}`);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Log the data for debugging
  console.log('Employee Data:', data);
  console.log('Roles:', roles);
  console.log('Levels:', levels);
  console.log('Organisations:', organisations);

  // Map IDs to names using the correct field names from the backend
 const roleName = roles.find((role) => role._id === data.role)?.RoleName || 'N/A';
  const levelName = levels.find((level) => level._id === data.level)?.LevelName || 'N/A';
  const organisationName = organisations.find((org) => org._id === data.organisation)?.OrganisationName || 'N/A';

  // Log the mapped values for debugging
  console.log('Role ID:', data.role, 'Mapped Role Name:', roleName);
  console.log('Level ID:', data.level, 'Mapped Level Name:', levelName);
  console.log('Organisation ID:', data.organisation, 'Mapped Organisation Name:', organisationName);

  return (
    <TableRow className="hover:bg-blue-50">
      <TableCell className="py-3 px-1">{data._id}</TableCell>
      <TableCell className="py-3 px-1">{`${data.FirstName} ${data.LastName}`}</TableCell>
      <TableCell className="py-3 px-1">{data.EmpCode}</TableCell>
      <TableCell className="py-3 px-1">{roleName}</TableCell>
      <TableCell className="py-3 px-1">{levelName}</TableCell>
      <TableCell className="py-3 px-1">{organisationName}</TableCell>
      <TableCell className="py-3 px-1">{data.Projects}</TableCell>
      <TableCell className="py-3 px-1">{formatCurrency(data.CTCAnnual)}</TableCell>
      <TableCell className="py-3 px-1">{formatCurrency(data.CTCMonthly)}</TableCell>
      <TableCell className="py-3 px-1">{data.Status}</TableCell>
      <TableCell className="py-3 px-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-blue-600 mr-2"
          title="View Employee"
          onClick={handleViewClick}
        >
          <Eye className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-teal-500 mr-2"
          title="Edit Employee"
          onClick={() => onEdit(data)}
        >
          <Edit className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-500"
          title="Delete Employee"
          onClick={() => onDelete(data._id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default EmployeeTableRow;