
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

const ClientTableHeade = () => (
  <TableRow>
    <TableCell className="py-3 px-1">#</TableCell>
    <TableCell className="py-3 px-1">Client Name</TableCell>
    <TableCell className="py-3 px-1"> Contact person</TableCell>
    <TableCell className="py-3 px-1">Email</TableCell>
    <TableCell className="py-3 px-1">Reg. Address</TableCell>
    <TableCell className="py-3 px-1">Billing Currency</TableCell>
    <TableCell className="py-3 px-1">Actions</TableCell>
  </TableRow>
);

export default ClientTableHeade;
