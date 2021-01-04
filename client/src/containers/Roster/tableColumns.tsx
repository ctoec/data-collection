import React from 'react';
import idx from 'idx';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import { Column } from '@ctoec/component-library';
import { Child } from '../../shared/models';
import { IncompleteIcon } from '../../components/IncompleteIcon';
import { nameFormatter } from '../../utils/formatters';

export enum ColumnNames {
  NAME = 'Name',
  MISSING = 'Missing info',
  BIRTHDATE = 'Birthdate',
  FUNDING_SOURCE = 'Funding type',
  FUNDING_TIME = 'Space type',
  SITE = 'Site',
  ORGANIZATION = 'Organization',
  ENTRY = 'Enrollment date',
  EXIT = 'Withdrawal date',
}

const tableColumnClassName = 'text-pre text-center font-body-2xs';
const tableRowClassName = 'font-body-2xs';
export const tableColumns: (
  excludeColumns?: ColumnNames[]
) => Column<Child>[] = (excludeColumns = []) => {
  const numberOfColumns =
    Object.keys(ColumnNames).length - excludeColumns?.length;
  const longColumnWidthPercent = numberOfColumns > 7 ? 20 : 25;
  const shortColumnWidthPercent = 10;

  const columns: Column<Child>[] = [
    {
      className: tableColumnClassName,
      name: ColumnNames.NAME,
      sort: (row) => row?.lastName || '',
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => (
        <th scope="row" className={tableRowClassName}>
          <Link
            className="usa-button usa-button--unstyled font-body-2xs text-no-wrap" // set font size again to override font size from usa-button
            to={{
              pathname: `/edit-record/${row?.id}`,
            }}
          >
            {nameFormatter(row, { lastNameFirst: true })}{' '}
          </Link>
        </th>
      ),
    },
    {
      className: cx(tableColumnClassName, 'break-spaces'),
      name: ColumnNames.MISSING,
      width: `${shortColumnWidthPercent}%`,
      sort: (row) =>
        !row?.validationErrors || !row?.validationErrors.length ? 1 : 0,
      cell: ({ row }) => {
        return (
          <td className={tableRowClassName}>
            {!!row?.validationErrors && !!row?.validationErrors.length && (
              <Link to={`/batch-edit/${row?.id}`}>
                <IncompleteIcon />
              </Link>
            )}
          </td>
        );
      },
    },
    {
      className: tableColumnClassName,
      name: ColumnNames.BIRTHDATE,
      sort: (row) => row?.birthdate?.unix() || 0,
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {row?.birthdate ? row?.birthdate.format('MM/DD/YYYY') : ''}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: ColumnNames.FUNDING_SOURCE,
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
      name: ColumnNames.FUNDING_TIME,
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
      name: ColumnNames.SITE,
      sort: (row) => idx(row, (_) => _.enrollments[0].site.siteName) || '',
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td
          className={`${tableRowClassName} ellipsis-wrap-text ellipsis-wrap-text--tight`}
        >
          {idx(row, (_) => _.enrollments[0].site.siteName)}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: ColumnNames.ORGANIZATION,
      sort: (row) =>
        idx(row, (_) => _.enrollments[0].site.organization.providerName) || '',
      width: `${longColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td
          className={`${tableRowClassName} ellipsis-wrap-text ellipsis-wrap-text--tight`}
        >
          {idx(row, (_) => _.enrollments[0].site.organization.providerName)}
        </td>
      ),
    },
    {
      className: cx(tableColumnClassName, 'break-spaces'),
      name: ColumnNames.ENTRY,
      sort: (row) => idx(row, (_) => _.enrollments[0].entry.unix()) || 0,
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {idx(row, (_) => _.enrollments[0].entry.format('MM/DD/YYYY'))}
        </td>
      ),
    },
    {
      className: cx(tableColumnClassName, 'break-spaces'),
      name: ColumnNames.EXIT,
      sort: (row) => idx(row, (_) => _.enrollments[0].exit.unix()) || 0,
      width: `${shortColumnWidthPercent}%`,
      cell: ({ row }) => (
        <td className={tableRowClassName}>
          {idx(row, (_) => _.enrollments[0].exit.format('MM/DD/YYYY'))}
        </td>
      ),
    },
  ];

  return columns.filter(
    (c: Column<Child>) => !excludeColumns.includes(c.name as ColumnNames)
  );
};
