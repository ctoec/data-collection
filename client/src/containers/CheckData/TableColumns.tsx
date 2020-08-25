import React from 'react';
import idx from 'idx';
import { Link } from 'react-router-dom';
import { Column, Button } from '@ctoec/component-library';
import { Child } from '../../shared/models';

const tableColumnClassName = 'text-pre text-center font-body-2xs';
export const tableColumns: () => Column<Child>[] = () => {
  return [
    {
      className: tableColumnClassName,
      name: 'Name',
      sort: (row) => row.lastName,
      cell: ({ row }) => {
        return (
          <td>
            <Link
              to={{
                pathname: `/edit-record/${row.id}`,
              }}
            >
              <Button
                className="text-no-wrap font-body-2xs"
                appearance="unstyled"
                text={`${row.firstName} ${row.lastName}`}
              />
            </Link>
          </td>
        );
      },
    },
    {
      className: tableColumnClassName,
      name: 'Birth Date',
      cell: ({ row }) => (
        <td>{row.birthdate ? row.birthdate.format('MM/DD/YYYY') : ''}</td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Age group',
      cell: ({ row }) => <td>{idx(row, (_) => _.enrollments[0].ageGroup)}</td>,
    },
    {
      className: tableColumnClassName,
      name: 'Funding type',
      cell: ({ row }) => (
        <td>
          {idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.source)}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Contract space',
      cell: ({ row }) => (
        <td>
          {idx(row, (_) => _.enrollments[0].fundings[0].fundingSpace.time)}
        </td>
      ),
    },
    {
      className: tableColumnClassName,
      name: 'Site',
      cell: ({ row }) => <td>{idx(row, (_) => _.enrollments[0].site.name)}</td>,
    },
    {
      className: tableColumnClassName,
      name: 'Enrollment date',
      cell: ({ row }) => (
        <td>{idx(row, (_) => _.enrollments[0].entry.format('MM/DD/YYYY'))}</td>
      ),
    },
  ];
};
