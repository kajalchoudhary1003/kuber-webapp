// EmployeeTable.jsx
import React from 'react';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import Tableheader from './EmployeeTableHeader';
import TableRow from './EmployeeTableRow';

const EmployeeTable = ({ data, onEdit, onDelete, roles, levels, organisations }) => (
  <div className="p-4">
    <Table className="w-full mt-5">
      <TableHeader>
        <Tableheader />
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow
            key={index}
            data={row}
            onEdit={onEdit}
            onDelete={onDelete}
            roles={roles}
            levels={levels}
            organisations={organisations}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

export default EmployeeTable;