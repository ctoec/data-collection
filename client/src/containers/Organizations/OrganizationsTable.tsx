import { Column, Table } from '@ctoec/component-library';
import React from 'react';
import { OrganizationSummary } from '../../shared/payloads/OrganizationsResponse';
import { FundingSource } from '../../shared/models/FundingSource';
import { getStrippedFundingSourceName } from '../../utils/getFundingSpaceDisplayName';

type OrganizationTableProps = {
  orgs?: Array<OrganizationSummary>;
};

export const OrganizationsTable: React.FC<OrganizationTableProps> = ({
  orgs = [],
}) => (
  <Table<OrganizationSummary>
    id="site-summary-table"
    rowKey={(row) => row.id}
    fullWidth={true}
    data={orgs}
    columns={TableColumns()}
  />
);

const TableColumns: () => Column<OrganizationSummary>[] = () => [
  {
    name: 'Name',
    sort: (row) => row.providerName,
    cell: ({ row }) => (
      <th scope="row">
        {/* Deactivate links until org detail pages are built */}
        {/* <Link to={`organization/${row.id}`}>{row.providerName}</Link> */}
        {row.providerName}
      </th>
    ),
  },
  {
    name: 'Number of Sites',
    className: 'text-no-wrap',
    sort: (row) => row.siteCount,
    cell: ({ row }) => <td>{row.siteCount ?? 0}</td>,
  },
  {
    name: 'Funding Spaces',
    cell: ({ row }) => (
      <td className="maxw-card-lg">
        {row?.fundingSource
          ?.split(',')
          .map((fs) =>
            getStrippedFundingSourceName(
              FundingSource[fs as keyof typeof FundingSource]
            )
          )
          .join(', ') ?? ''}
      </td>
    ),
  },
];
