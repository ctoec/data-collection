import { Column } from '@ctoec/component-library';
import React from 'react';
import { EnrollmentColumnError } from '../../shared/payloads';

export const misingInfoTableColumns: () => Column<EnrollmentColumnError>[] = () => {
  const columns: Column<EnrollmentColumnError>[] = [
    {
      name: 'Column name',
      sort: (row) => row.column || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.formattedName}</p>
        </th>
      ),
    },
    {
      name: '# of errors',
      sort: (row) => row.column || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.errorCount}</p>
        </th>
      ),
    },
    {
      name: 'Child records with errors',
      sort: (row) => row.column || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>
            {row.affectedRows.length > 5
              ? row.affectedRows.slice(0, 5).join(', ') +
                ', and ' +
                (row.affectedRows.length - 5).toString() +
                ' more'
              : row.affectedRows.join(', ')}
          </p>
        </th>
      ),
    },
  ];
  return columns;
};
