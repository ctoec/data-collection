import { useEffect } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { drillReactNodeForText } from '../../../utils/getValidationStatus';
import { AlertProps } from '@ctoec/component-library';
import React from 'react';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';

export const useChildrenWithErrorsAlert = (
  isLoading: boolean,
  childrenWithErrorsCount: number,
  withdrawnChildrenCount: number,
  organizationId?: string
) => {
  const { alertElements, setAlerts, alerts } = useAlerts();
  const childrenWithErrorsAlert = getChildrenWithErrorsAlertProps(
    childrenWithErrorsCount,
    withdrawnChildrenCount,
    organizationId
  );
  useEffect(() => {
    if (isLoading || !childrenWithErrorsCount) {
      setAlerts([]);
      return;
    }

    // set alert if:
    // - no existing matching alert OR
    // - existing matching alert has different number (i.e. was displaying content for a different organization)
    const existingAlert = alerts.find(
      (a) => a.heading === childrenWithErrorsAlert.heading
    );
    const existingAlertText = drillReactNodeForText(existingAlert?.text);
    if (
      !existingAlert ||
      !existingAlertText.includes(`${childrenWithErrorsCount}`)
    ) {
      setAlerts([
        ...alerts.filter((a) => a.heading !== childrenWithErrorsAlert.heading),
        childrenWithErrorsAlert,
      ]);
    }
  }, [childrenWithErrorsCount, isLoading]);

  return { alertElements };
};

/**
 * Return props for the childrenWithErrors alert
 * @param numberOfChildrenWithErrors
 */
function getChildrenWithErrorsAlertProps(
  numberOfChildrenWithErrors: number,
  numberOfWithdrawnChildrenWithErrors: number,
  organizationId?: string
): AlertProps {
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
    type: 'warning',
  };
}
