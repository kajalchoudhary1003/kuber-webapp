import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const EmployeeTableHeader = () => (
  <TableRow className="bg-[#EDEFF2] border-b border-[#9DA4B3]">
    <TableCell className="py-3 px-1 text-[16px] font-medium">Name</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Employee Code</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Role</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Level</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Organisation</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Projects</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">CTC Annual</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">CTC Monthly</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Status</TableCell>
    <TableCell className="py-3 px-1 text-[16px] font-medium">Actions</TableCell>
  </TableRow>
);

export default EmployeeTableHeader;