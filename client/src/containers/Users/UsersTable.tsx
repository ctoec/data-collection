// import { Column, Table } from '@ctoec/component-library';
import React from 'react';
import { UserSummary } from '../../shared/payloads/UsersResponse';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from 'carbon-components-react';

type UserTableProps = {
  users?: Array<UserSummary>;
};

export const UsersTable: React.FC<UserTableProps> = ({ users = [] }) => (
  <Table className="oec-table oec-table--full-width">
    <TableHead>
      <TableRow>
        <TableHeader className="oec-table__column-header" key="name">
          Name
        </TableHeader>
        <TableHeader className="oec-table__column-header" key="email">
          Email address
        </TableHeader>
        <TableHeader className="oec-table__column-header" key="organizations">
          Organizations(s)
        </TableHeader>
      </TableRow>
    </TableHead>
    <TableBody>
      {users.map((row) => (
        <TableRow key={row.id}>
          <TableCell key="name">{row.name}</TableCell>
          <TableCell key="email">{row.email}</TableCell>
          <TableCell key="organizations">{row.organizations}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
