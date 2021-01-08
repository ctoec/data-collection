import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Column } from '@ctoec/component-library';
import {
  getRequiredTag,
  getMarkdownStyledFormatOptionsList,
  EnhancedColumnMetadata,
} from './utils';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';
import { capitalizeFirstLetter } from '../../utils/formatters/sentenceCase';

export enum DATA_DEF_COLUMN_NAMES {
  fieldName = 'Field name',
  requiredOptional = 'Required/ Optional',
  definition = 'Definition',
  reason = 'Reason for collecting',
  format = 'Format',
}

export const TableColumns: Column<EnhancedColumnMetadata>[] = [
  {
    name: DATA_DEF_COLUMN_NAMES.fieldName,
    cell: ({ row }) =>
      !row ? (
        <></>
      ) : (
        <th scope="row">
          <span className="text-bold">
            {capitalizeFirstLetter(row.formattedName)}
          </span>
        </th>
      ),
    width: '18%',
  },
  {
    name: DATA_DEF_COLUMN_NAMES.requiredOptional,
    cell: ({ row }) =>
      !row ? (
        <></>
      ) : (
        <td>
          {getRequiredTag(row.requirementLevel)}
          {row.requirementLevel !== TEMPLATE_REQUIREMENT_LEVELS.OPTIONAL &&
            row.requirementString && (
              <ReactMarkdown source={row.requirementString} />
            )}
        </td>
      ),
    width: '20%',
  },
  {
    name: DATA_DEF_COLUMN_NAMES.definition,
    cell: ({ row }) =>
      !row ? (
        <></>
      ) : (
        <td>
          <ReactMarkdown source={row.definition} />
        </td>
      ),
    width: '24%',
  },
  {
    name: DATA_DEF_COLUMN_NAMES.reason,
    cell: ({ row }) => (!row ? <></> : <td>{row.reason}</td>),
    width: '20%',
  },
  {
    name: DATA_DEF_COLUMN_NAMES.format,
    cell: ({ row }) => {
      if (!row) return <></>;
      const columnFormatter =
        row.columnFormatters?.[DATA_DEF_COLUMN_NAMES.format];
      if (columnFormatter) {
        return columnFormatter(row);
      }
      return (
        <td>
          <ReactMarkdown
            source={getMarkdownStyledFormatOptionsList(row.format)}
          />
          {!!row.example && (
            <div className="margin-top-1">Ex: {row.example}</div>
          )}
        </td>
      );
    },
    width: '20%',
  },
];
