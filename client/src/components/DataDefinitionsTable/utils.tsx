import React from 'react';
import cx from 'classnames';
import { Tag } from '@ctoec/component-library';
import {
  TEMPLATE_REQUIREMENT_LEVELS,
  TEMPLATE_SECTIONS,
} from '../../shared/constants';
import { ColumnMetadata, Organization, Site } from '../../shared/models';
import { DATA_DEF_COLUMN_NAMES } from './TableColumns';

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

export const getMarkdownStyledFormatOptionsList = (formatString: string) => {
  const match = formatString.match(/^(One of:)/);
  if (match) {
    // Strip the leading 'One of:'
    return (
      formatString
        .replace(match[0], '')
        // then split by expected ', ' string
        .split(', ')
        // prepend markdown list character
        .map((li) => `- ${li}`)
        // then re-combine into two-space + new-line separated markdown list
        .join('  \n')
    );
  }

  return formatString;
};

export type EnhancedColumnMetadata = ColumnMetadata & {
  columnFormatters?: {
    [key in DATA_DEF_COLUMN_NAMES]?: (
      row: EnhancedColumnMetadata
    ) => React.ReactElement;
  };
};

export const getSiteFormatters = (sites: Site[]) => ({
  [DATA_DEF_COLUMN_NAMES.format]: () => (
    <td>
      Text, one of:
      <div className="margin-top-1">
        <ul>
          {sites.map((s) => (
            <li key={s.siteName}>{s.siteName}</li>
          ))}
        </ul>
      </div>
    </td>
  ),
});

export const getProviderFormatters = (organizations?: Organization[]) => ({
  [DATA_DEF_COLUMN_NAMES.format]: () => {
    if (!organizations?.length) {
      return <></>;
    }
    if (organizations?.length === 1) {
      return (
        <td>
          Text:
          <div className="margin-top-1">{organizations[0].providerName}</div>
        </td>
      );
    }
    return (
      <td>
        Text:
        <div className="margin-top-1">
          <ul>
            {organizations?.map((o) => (
              <li key={o.providerName}>{o.providerName}</li>
            ))}
          </ul>
        </div>
      </td>
    );
  },
});
