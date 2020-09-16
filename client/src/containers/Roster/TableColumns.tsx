import React from 'react';
import idx from 'idx';
import { Link } from 'react-router-dom';
import { Column } from '@ctoec/component-library';
import { Child } from '../../shared/models';

const tableColumnClassName = 'text-pre text-center font-body-2xs';
const tableRowClassName = 'font-body-2xs';
export const tableColumns: (_?: boolean) => Column<Child>[] = (
  includeOrg?: boolean
) => {
  const longColumnWidthPercent = includeOrg ? 20 : 25;
  const shortColumnWidthPercent = 10;

  const columns: Column<Child>[] = [
    {
      className: tableColumnClassName,
      name: 'Name',
      sort: (row) => row.lastName,
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => {
        return (
          <th scope="row" className={tableRowClassName}>
            <Link
              className="usa-button usa-button--unstyled font-body-2xs text-no-wrap" // set font size again to override font size from usa-button
              to={{
                pathname: `/edit-record/${row.id}`,
              }}
            >
              {row.lastName}, {row.firstName}
            </Link>
          </th>
        );
      },
    },
    {
      className: tableColumnClassName,
      name: 'Birth Date',
      sort: (row) => row.birthdate?.unix() || 0,
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {row.birthdate ? row.birthdate.format('MM/DD/YYYY') : ''}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Funding type',
      sort: (row) =>
        idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.source) || '',
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.source)}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Contract space',
      sort: (row) =>
        idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.time) || '',
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.time)}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Site',
      sort: (row) => idx(row, (_) => _.enrollments[0].site.name) || '',
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td
          className={`${tableRowClassName} ellipsis-wrap-text ellipsis-wrap-text--tight`}
        >
          {idx(row, (_) => _.enrollments[0].site.name)} which is too long
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Enrollment date',
      sort: (row) => idx(row, (_) => _.enrollments[0].entry.unix()) || 0,
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {idx(row, (_) => _.enrollments[0].entry.format('MM/DD/YYYY'))}
        </td>
      ),
    },
  ];

  if (includeOrg)
    columns.splice(4, 0, {
      className: tableColumnClassName,
      name: 'Organization',
      sort: (row) =>
        idx(row, (_) => _.enrollments[0].site.organization.name) || '',
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td
          className={`${tableRowClassName} ellipsis-wrap-text ellipsis-wrap-text--tight`}
        >
          {idx(row, (_) => _.enrollments[0].site.organization.name)}
        </td>
      ),
    });

  return columns;
};
