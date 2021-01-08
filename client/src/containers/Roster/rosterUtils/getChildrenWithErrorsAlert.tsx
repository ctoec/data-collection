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
  numberOfChildrenWithErrors: number,
  numberOfWithdrawnChildrenWithErrors: number,
  alertType: 'warning' | 'error' | undefined,
  organizationId?: string
): AlertProps | undefined {
  if (!numberOfChildrenWithErrors && !numberOfWithdrawnChildrenWithErrors)
    return;
  let alertText = `You'll need to add required info for
        ${pluralize('record', numberOfChildrenWithErrors, true)} before
        submitting your data to OEC. Update with `;
  if (numberOfWithdrawnChildrenWithErrors > 0) {
    alertText = `You'll need to add required info for ${numberOfChildrenWithErrors} active ${pluralize(
      'record',
      numberOfChildrenWithErrors
    )} and ${numberOfWithdrawnChildrenWithErrors} withdrawn ${pluralize(
      'record',
      numberOfWithdrawnChildrenWithErrors
    )} before
        submitting your data to OEC. Update all records that need info with `;
  }
  return {
    text: (
      <span>
        {alertText}
        <Link
          className="usa-button usa-button--unstyled"
          to={`/batch-edit?${stringify({ organizationId })}`}
        >
          batch editing.
        </Link>
      </span>
    ),
    heading: 'Update roster before submitting',
    type: alertType ? alertType : 'warning',
  };
}
