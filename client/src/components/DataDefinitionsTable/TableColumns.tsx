import React from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import { Column, Alert } from '@ctoec/component-library';
import {
  getRequiredTag,
  isFirstReportingPeriodRow,
  isFirstReportingPeriodAlertRow,
  getMarkdownStyledFormatOptionsList,
  EnhancedColumnMetadata,
} from './utils';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';

export enum DATA_DEF_COLUMN_NAMES {
  fieldName = 'Field name',
  requiredOptional = 'Required/ Optional',
  definition = 'Definition',
  reason = 'Reason for collecting',
  format = 'Format'
}

export const TableColumns: (_: boolean) => Column<EnhancedColumnMetadata>[] = (
  addFirstReportingPeriodAlert: boolean
) => [
    {
      name: DATA_DEF_COLUMN_NAMES.fieldName,
      cell: ({ row }) =>
        !row ? (
          <></>
        ) : isFirstReportingPeriodAlertRow(row) ? (
          <td colSpan={5}>
            <Alert
              type="info"
              text="Record 07/2020 for any child whose funding began in or before July 2020."
            />
          </td>
        ) : (
              <th
                scope="row"
                className={cx({
                  'hide-bottom-border':
                    isFirstReportingPeriodRow(row) && addFirstReportingPeriodAlert,
                })}
              >
                <span className="text-bold">{row.formattedName}</span>
              </th>
            ),
      width: '18%',
    },
    {
      name: DATA_DEF_COLUMN_NAMES.requiredOptional,
      cell: ({ row }) =>
        !row || isFirstReportingPeriodAlertRow(row) ? (
          <></>
        ) : (
            <td
              className={cx({
                'hide-bottom-border':
                  isFirstReportingPeriodRow(row) && addFirstReportingPeriodAlert,
              })}
            >
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
        !row || isFirstReportingPeriodAlertRow(row) ? (
          <></>
        ) : (
            <td
              className={cx({
                'hide-bottom-border':
                  isFirstReportingPeriodRow(row) && addFirstReportingPeriodAlert,
              })}
            >
              <ReactMarkdown source={row.definition} />
            </td>
          ),
      width: '24%',
    },
    {
      name: DATA_DEF_COLUMN_NAMES.reason,
      cell: ({ row }) =>
        !row || isFirstReportingPeriodAlertRow(row) ? (
          <></>
        ) : (
            <td
              className={cx({
                'hide-bottom-border':
                  isFirstReportingPeriodRow(row) && addFirstReportingPeriodAlert,
              })}
            >
              {row.reason}
            </td>
          ),
      width: '20%',
    },
    {
      name: DATA_DEF_COLUMN_NAMES.format,
      cell: ({ row }) =>
        !row || isFirstReportingPeriodAlertRow(row) ? (
          <></>
        ) : (
            <td
              className={cx({
                'hide-bottom-border':
                  isFirstReportingPeriodRow(row) && addFirstReportingPeriodAlert,
              })}
            >
              <ReactMarkdown
                source={getMarkdownStyledFormatOptionsList(row.format)}
              />
              {!!row.example && (
                <div className="margin-top-1">Ex: {row.example}</div>
              )}
            </td>
          ),
      width: '20%',
    },
  ];
