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
}) => {
  return (
    <>
      <Table<OrganizationSummary>
        id="site-summary-table"
        rowKey={(row) => row.id}
        fullWidth={true}
        data={orgs}
        columns={TableColumns()}
      />
    </>
  );
};

const TableColumns: () => Column<OrganizationSummary>[] = () => {
  const columns: Column<OrganizationSummary>[] = [
    {
      name: 'Name',
      sort: (row) => row.providerName,
      cell: ({ row }) => (
        <th scope="row">
          {/* Deactivate links until site/org detail pages are built */}
          {/* <Link to={`${pathname}/site/${row.id}`}>{row.siteName}</Link> */}
          {row.providerName}
        </th>
      ),
    },
    {
      name: 'Number of Sites',
      className: 'text-no-wrap',
      sort: (row) => row.siteCount,
      cell: ({ row }) => (
        <td>
          {/* Deactivate links until site/org detail pages are built */}
          {/* <Link to={`${pathname}/organization/${row.organizationId}`}> */}
          {row.siteCount ? row.siteCount : 0}
          {/* </Link> */}
        </td>
      ),
    },
    {
      name: 'Funding Spaces',
      // sort: (row) => row.fundingSpaces.length,
      cell: ({ row }) => (
        <td className="maxw-card-lg">
          {/* Deactivate links until site/org detail pages are built */}
          {/* <Link to={`${pathname}/organization/${row.organizationId}`}> */}
          {row.fundingSource
            ? row.fundingSource
                .split(',')
                .map((fs) =>
                  getStrippedFundingSourceName(
                    FundingSource[fs as keyof typeof FundingSource]
                  )
                )
                .join(', ')
            : ''}
        </td>
      ),
    },
  ];

  return columns;
};
