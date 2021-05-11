import { Column, Table } from '@ctoec/component-library';
import React from 'react';
import { UserSummary } from '../../shared/payloads/UsersResponse';
import { FundingSource } from '../../shared/models/FundingSource';
import { getStrippedFundingSourceName } from '../../utils/getFundingSpaceDisplayName';

type UserTableProps = {
  users?: Array<UserSummary>;
};

export const UsersTable: React.FC<UserTableProps> = ({ users = [] }) => (
  <Table<UserSummary>
    id="site-summary-table"
    rowKey={(row) => row.id}
    fullWidth={true}
    data={users}
    columns={TableColumns()}
  />
);

const TableColumns: () => Column<UserSummary>[] = () => {
  const columns: Column<UserSummary>[] = [
    {
      name: 'Name',
      sort: (row) => row.name,
      cell: ({ row }) => (
        <th scope="row">
          {/* Deactivate links until org detail pages are built */}
          {/* <Link to={`organization/${row.id}`}>{row.providerName}</Link> */}
          {row.name}
        </th>
      ),
    },
    {
      name: 'Email address',
      className: 'text-no-wrap',
      sort: (row) => (row.email ? row.email : ''),
      cell: ({ row }) => <td>{row.email ? row.email : ''}</td>,
    },
    {
      name: 'Organization(s)',
      // sort: (row) => row.fundingSpaces.length,
      cell: ({ row }) => <td className="maxw-card-lg">{row.organizations}</td>,
    },
  ];

  return columns;
};
