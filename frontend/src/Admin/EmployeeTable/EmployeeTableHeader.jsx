import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmployeeTableHeader = () => (
  <TableRow className='bg-[#EDEFF2]'>
    <TableCell className="py-3 px-1">Name</TableCell>
    <TableCell className="py-3 px-1"> Emp. Code</TableCell>
    <TableCell className="py-3 px-1">Role</TableCell>
    <TableCell className="py-3 px-1">Level</TableCell>
    <TableCell className="py-3 px-1">Organisation</TableCell>
    <TableCell className="py-3 px-1">Projects</TableCell>
    <TableCell className="py-3 px-1">CTC/A</TableCell>
    <TableCell className="py-3 px-1">CTC/M</TableCell>
    <TableCell className="py-3 px-1">Status</TableCell>
    <TableCell className="py-3 px-1">Actions</TableCell>
  </TableRow>
);

export default EmployeeTableHeader;
