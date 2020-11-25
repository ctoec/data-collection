import React from 'react';
import { Column } from '@ctoec/component-library';
import { ErrorObjectForTable } from './ErrorObjectForTable';

/**
 * Tabular column formatter that displays a dictionary of
 * counts of validation errors as a formatted table within
 * a batch upload modal.
 */
export const tableColumns: () => Column<ErrorObjectForTable>[] = () => {
  const columns: Column<ErrorObjectForTable>[] = [
    {
      name: 'Column name',
      sort: (row) => row.property || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.formattedName}</p>
        </th>
      ),
    },
    {
      name: '# of errors',
      sort: (row) => row.property || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.count}</p>
        </th>
      ),
    },
    {
      name: 'Child records with errors',
      sort: (row) => row.property || '',
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
