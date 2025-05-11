import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import EmployeeTableRow from './EmployeeTableRow';

const EmployeeTable = ({
  data,
  onEdit,
  onDelete,
  roles,
  levels,
  organisations,
  fetchRoleById,
  fetchLevelById,
  fetchOrganisationById
}) => {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="bg-[#EDEFF2] border-b border-[#9DA4B3]">
          {/* Removed ID column */}
          <TableCell className="py-3 px-1 text-[16px] font-medium">Name</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Employee Code</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Role</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Level</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Organisation</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Projects</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">CTC Annual</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">CTC Monthly</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Status</TableCell>
          <TableCell className="py-3 px-1 text-[16px] font-medium">Action</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            data={employee}
            onEdit={onEdit}
            onDelete={onDelete}
            fetchRoleById={fetchRoleById}
            fetchLevelById={fetchLevelById}
            fetchOrganisationById={fetchOrganisationById}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default EmployeeTable;
