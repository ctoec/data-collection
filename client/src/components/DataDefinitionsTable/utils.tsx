import React from 'react';
import cx from 'classnames';
import { Tag } from '@ctoec/component-library';
import {
  TEMPLATE_REQUIREMENT_LEVELS,
  TEMPLATE_SECTIONS,
} from '../../shared/constants';
import { ColumnMetadata } from '../../shared/models';

export const getRequiredTag = (requirementLevel: string) => (
  <Tag
    text={requirementLevel}
    className={cx(
      'required-tag',
      {
        'required-tag--required':
          requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.REQUIRED,
      },
      {
        'required-tag--conditional':
          requirementLevel === TEMPLATE_REQUIREMENT_LEVELS.CONDITIONAL,
      }
    )}
  />
);

const FIRST_REPORTING_PERIOD_ALERT_NAME = 'firstReportingPeriodAlert';
export const FIRST_REPORTING_PERIOD_ALERT_ROW = {
  propertyName: FIRST_REPORTING_PERIOD_ALERT_NAME,
  section: TEMPLATE_SECTIONS.ENROLLMENT_FUNDING,
} as ColumnMetadata;

export const isFirstReportingPeriodRow = (row: ColumnMetadata) =>
  !!row.propertyName.match(/firstreporting/i);

export const isFirstReportingPeriodAlertRow = (row: ColumnMetadata) =>
  row.propertyName === FIRST_REPORTING_PERIOD_ALERT_NAME;
