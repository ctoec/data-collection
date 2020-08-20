import { Column, Button } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import React from 'react';
import { TableRow } from './CheckData';

const tableColumnClassName = 'text-pre text-center font-body-2xs';
export const tableColumns: (_: number) => Column<TableRow>[] = (
  reportId: number
) => [
  {
    className: tableColumnClassName,
    name: 'Name',
    sort: (row) => row.child.lastName,
    cell: ({ row }) => (
      <td>
        <Link
          to={{
            pathname: `/edit-record/${row.child.id}`,
            state: {
              reportId: reportId,
              row: row,
            },
          }}
        >
          <Button
            className="text-no-wrap font-body-2xs"
            appearance="unstyled"
            text={`${row.child.firstName} ${row.child.lastName}`}
          />
        </Link>
      </td>
    ),
  },
  {
    className: tableColumnClassName,
    name: 'Birth Date',
    cell: ({ row }) => (
      <td>
        {row.child.birthdate ? row.child.birthdate.format('MM/DD/YYYY') : ''}
      </td>
    ),
  },
  {
    className: tableColumnClassName,
    name: 'Age group',
    cell: ({ row }) => <td>{row.enrollment?.ageGroup}</td>,
  },
  {
    className: tableColumnClassName,
    name: 'Funding type',
    cell: ({ row }) => <td>{row.funding?.fundingSpace.source}</td>,
  },
  {
    className: tableColumnClassName,
    name: 'Contract space',
    cell: ({ row }) => <td>{row.funding?.fundingSpace.time}</td>,
  },
  {
    className: tableColumnClassName,
    name: 'Site',
    cell: ({ row }) => <td>{row.site.name}</td>,
  },
  {
    className: tableColumnClassName,
    name: 'Enrollment date',
    cell: ({ row }) => <td>{row.enrollment?.entry?.format('MM/DD/YYYY')}</td>,
  },
];
