import React from 'react';
import { Column } from '@ctoec/component-library';
import { IncompleteIcon } from '../../components/IncompleteIcon';
import { UploadPreviewRow } from './UploadPreviewRow';

/**
 * Tabular column formatter that displays a preview of a spreadsheet
 * given to batch upload.
 */
export const getPreviewTableColumns: () => Column<UploadPreviewRow>[] = () => {
  const columns: Column<UploadPreviewRow>[] = [
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
          <p>{row.missingInfo ? <IncompleteIcon /> : <></>}</p>
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
