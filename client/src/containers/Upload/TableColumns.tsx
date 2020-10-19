import React from 'react';
import { Column } from '@ctoec/component-library';
import { ErrorObjectForTable } from './Upload';

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
