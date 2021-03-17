import { Column, Table } from '@ctoec/component-library';
import pluralize from 'pluralize';
import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
import { SiteSummary } from '../../shared/payloads/SummaryResponse';

type SiteSummaryTableProps = {
  headerText: string;
  sites: SiteSummary[];
  hideEnrollments?: boolean;
  showSubmissionDate?: boolean;
};

export const SiteSummaryTable: React.FC<SiteSummaryTableProps> = ({
  headerText,
  sites,
  hideEnrollments = false,
  showSubmissionDate = false,
}) => {
  return (
    <>
      <h3>
        {pluralize('site', sites.length, true)} with {headerText}
      </h3>
      <Table<SiteSummary>
        id="site-summary-table"
        rowKey={(row) => row.id}
        fullWidth={true}
        data={sites}
        columns={TableColumns(hideEnrollments, showSubmissionDate)}
      />
    </>
  );
};

const TableColumns: (_: boolean, __: boolean) => Column<SiteSummary>[] = (
  hideEnrollments?: boolean,
  showSubmissionDate?: boolean
) => {
  // const { pathname } = useLocation();
  const columns: Column<SiteSummary>[] = [
    {
      name: 'Site',
      sort: (row) => row.siteName,
      cell: ({ row }) => (
        <th scope="row">
          {/* Deactivate links until site/org detail pages are built */}
          {/* <Link to={`${pathname}/site/${row.id}`}>{row.siteName}</Link> */}
          {row.siteName}
        </th>
      ),
    },
    {
      name: 'Organization',
      sort: (row) => row.providerName,
      cell: ({ row }) => (
        <td>
          {/* Deactivate links until site/org detail pages are built */}
          {/* <Link to={`${pathname}/organization/${row.organizationId}`}> */}
          {row.providerName}
          {/* </Link> */}
        </td>
      ),
    },
  ];

  if (showSubmissionDate) {
    columns.push({
      name: 'Submission date',
      sort: (row) => row.submissionDate?.unix() || '',
      cell: ({ row }) => <td>{row.submissionDate?.format('MM/DD/YYYY')}</td>,
    });
  }

  if (!hideEnrollments) {
    columns.push({
      name: '# of enrollments',
      sort: (row) => row.totalEnrollments,
      cell: ({ row }) => <td>{row.totalEnrollments}</td>,
    });
  }

  return columns;
};
