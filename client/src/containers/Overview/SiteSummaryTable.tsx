import { Column, Table } from '@ctoec/component-library';
import pluralize from 'pluralize';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiteSummary } from '../../shared/payloads/SummaryResponse';

type SiteSummaryTableProps = {
  headerText: string;
  sites: SiteSummary[];
  hideEnrollments?: boolean;
};

export const SiteSummaryTable: React.FC<SiteSummaryTableProps> = ({
  headerText,
  sites,
  hideEnrollments = true,
}) => {
  return (
    <>
      <h3>
        {pluralize('site', sites.length, true)} with {headerText}
      </h3>
      <Table<SiteSummary>
        id="site-summary-table"
        rowKey={(row) => row.id}
        data={sites}
        columns={TableColumns(hideEnrollments)}
      />
    </>
  );
};

const TableColumns: (_: boolean) => Column<SiteSummary>[] = (
  hideEnrollments?: boolean
) => {
  const { pathname } = useLocation();
  const columns: Column<SiteSummary>[] = [
    {
      name: 'Site',
      sort: (row) => row.name,
      cell: ({ row }) => (
        <th scope="row">
          <Link to={`${pathname}/site/${row.id}`}>{row.name}</Link>
        </th>
      ),
    },
    {
      name: 'Organization',
      sort: (row) => row.organizationName,
      cell: ({ row }) => (
        <td>
          <Link to={`${pathname}/organization/${row.organizationId}`}>
            {row.organizationId}
          </Link>
        </td>
      ),
    },
  ];

  if (!hideEnrollments) {
    columns.push({
      name: '# of enrollments',
      sort: (row) => row.totalEnrollments,
      cell: ({ row }) => <td>{row.totalEnrollments}</td>,
    });
  }

  return columns;
};
