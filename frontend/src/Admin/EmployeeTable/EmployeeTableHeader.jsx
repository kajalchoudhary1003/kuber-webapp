import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmployeeTableHeader = () => (
  <TableRow className="bg-[#EDEFF2] border-b border-[#9DA4B3]">
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Name</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Employee Code</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Role</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Level</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Organisation</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Projects</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">CTC Annual</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">CTC Monthly</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Status</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium text-center">Actions</TableCell>
  </TableRow>
);

export default EmployeeTableHeader;
