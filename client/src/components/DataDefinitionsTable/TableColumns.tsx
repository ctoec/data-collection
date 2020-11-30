import { Column } from '@ctoec/component-library';
import { ColumnMetadata } from '../../shared/models';
import React from 'react';
import { getRequiredTag } from './utils';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';
import ReactMarkdown from 'react-markdown';

export const TableColumns: Column<ColumnMetadata>[] = [
  {
    name: 'Field name',
    cell: ({ row }) =>
      row ? (
        <th scope="row">
          <span className="text-bold">{row.formattedName}</span>
        </th>
      ) : (
        <></>
      ),
  },
  {
    name: 'Required/ Optional',
    cell: ({ row }) =>
      row ? (
        <td>
          {getRequiredTag(row.requirementLevel)}
          {row.requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL && (
            <ReactMarkdown source={row.requirementString} />
          )}
        </td>
      ) : (
        <></>
      ),
  },
  {
    name: 'Definition',
    cell: ({ row }) =>
      row ? (
        <td>
          <ReactMarkdown source={row.definition} />
        </td>
      ) : (
        <></>
      ),
  },
  {
    name: 'Reason for collecting',
    cell: ({ row }) => (row ? <td> {row.reason} </td> : <></>),
  },
  {
    name: 'Format',
    cell: ({ row }) =>
      row ? (
        <td>
          <div>{row.format}</div>
          <div className="margin-top-1">Ex: {row.example}</div>
        </td>
      ) : (
        <></>
      ),
  },
];
