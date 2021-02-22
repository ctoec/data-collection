import React from 'react';
import { Column } from '@ctoec/component-library';
import { UploadPreviewTableObject } from './UploadPreviewTableObject';
import { IncompleteIcon } from '../../components/IncompleteIcon';

/**
 * Tabular column formatter that displays a preview of a spreadsheet
 * given to batch upload.
 */
export const getPreviewTableColumns: () => Column<UploadPreviewTableObject>[] = () => {
  const columns: Column<UploadPreviewTableObject>[] = [
    {
      name: 'Name',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.name}</p>
        </th>
      ),
    },
    {
      name: 'Upload Type',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.tags.join(', ')}</p>
        </th>
      ),
    },
    {
      name: 'Missing Info',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.missingfInfo ? <IncompleteIcon /> : <></>}</p>
        </th>
      ),
    },
    {
      name: 'Birth Date',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.birthDate}</p>
        </th>
      ),
    },
    {
      name: 'Funding Type',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.fundingSource}</p>
        </th>
      ),
    },
    {
      name: 'Space Type',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.spaceType}</p>
        </th>
      ),
    },
    {
      name: 'Site',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.site}</p>
        </th>
      ),
    },
    {
      name: 'Enrollment Date',
      sort: (row) => row.name || '',
      cell: ({ row }) => (
        <th scope="row" className="font-body-2xs">
          <p>{row.enrollmentDate}</p>
        </th>
      ),
    },
  ];
  return columns;
};
