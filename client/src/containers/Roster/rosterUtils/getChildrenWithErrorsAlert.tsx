import React from 'react';
import { AlertProps } from '@ctoec/component-library';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

/**
 * Return props for the childrenWithErrors alert
 * @param numberOfChildrenWithErrors
 */
export function getChildrenWithErrorsAlert(
  activeErrorsCounts: number,
  withdrawnErrorsCounts: number,
  alertType: 'warning' | 'error' | undefined,
  organizationId?: string
): AlertProps | undefined {
  if (!activeErrorsCounts && !withdrawnErrorsCounts) return;
  let alertText = `Required information is missing for
        ${pluralize('record', activeErrorsCounts, true)}.`;
  if (withdrawnErrorsCounts > 0) {
    alertText = `Required information is missing for ${activeErrorsCounts} active ${pluralize(
      'record',
      activeErrorsCounts
    )} and ${withdrawnErrorsCounts} withdrawn ${pluralize(
      'record',
      withdrawnErrorsCounts
    )}.`;
  }
  return {
    text: (
      <>
        <div>{alertText}</div>
        <div>
          <Link
            className="usa-button usa-button--unstyled"
            to={`/batch-edit?${stringify({ organizationId })}`}
          >
            Add missing info
          </Link>
          &nbsp;to complete your enrollment data.
        </div>
      </>
    ),
    heading: 'Update your roster',
    type: alertType ? alertType : 'warning',
  };
}
