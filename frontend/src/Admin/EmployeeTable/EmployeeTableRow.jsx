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

  // Splitting name into first and last name
  const [FirstName, LastName] = data.name ? data.name.split(' ') : ['', ''];

  return (
    <TableRow className="hover:bg-blue-50">
      <TableCell className="py-3 px-1">{data._id}</TableCell>
      <TableCell className="py-3 px-1">{`${FirstName} ${LastName}`}</TableCell>
      <TableCell className="py-3 px-1">{data.EmpCode || 'N/A'}</TableCell>
      <TableCell className="py-3 px-1">{data.role || 'N/A'}</TableCell>
      <TableCell className="py-3 px-1">{data.level || 'N/A'}</TableCell>
      <TableCell className="py-3 px-1">{data.organisation || 'N/A'}</TableCell>
      <TableCell className="py-3 px-1">{data.Projects || 'N/A'}</TableCell>
      <TableCell className="py-3 px-1">{formatCurrency(data.CTCAnnual)}</TableCell>
      <TableCell className="py-3 px-1">{formatCurrency(data.CTCMonthly)}</TableCell>
      <TableCell className="py-3 px-1">{data.Status || 'N/A'}</TableCell>
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