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
      name: '# of records with errors',
      sort: (row) => row.property || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.count}</p>
        </th>
      ),
    },
  ];
  return columns;
};
