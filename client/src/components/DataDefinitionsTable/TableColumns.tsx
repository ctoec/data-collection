import { Column, Alert } from '@ctoec/component-library';
import cx from 'classnames';
import { ColumnMetadata } from '../../shared/models';
import React from 'react';
import {
  getRequiredTag,
  isFirstReportingPeriodRow,
  isFirstReportingPeriodAlertRow,
} from './utils';
import { TEMPLATE_REQUIREMENT_LEVELS } from '../../shared/constants';
import ReactMarkdown from 'react-markdown';

export const TableColumns: (_: boolean) => Column<ColumnMetadata>[] = (
  addFirstReportingPeriodAlert: boolean
) => [
  {
    name: 'Field name',
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
    name: 'Required/ Optional',
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
    name: 'Definition',
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
    name: 'Reason for collecting',
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
    name: 'Format',
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
          <ReactMarkdown source={row.format} />
          {!!row.example && (
            <div className="margin-top-1">Ex: {row.example}</div>
          )}
        </td>
      ),
    width: '20%',
  },
];
