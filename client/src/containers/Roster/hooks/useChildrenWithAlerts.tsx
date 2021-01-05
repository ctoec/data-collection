import { useEffect } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { AlertProps } from '@ctoec/component-library';
import React from 'react';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';
import { stringify } from 'query-string';
import { drillReactNodeForText } from '../../../utils/drillReactNodeForText';

export const useChildrenWithAlerts = (
  isLoading: boolean,
  childrenWithErrorsCount: number,
  withdrawnChildrenCount: number,
  opts: {
    alertType?: 'warning' | 'error';
    organizationId?: string;
  } = { alertType: 'warning' }
) => {
  const { alertElements, setAlerts, alerts } = useAlerts();
  const childrenWithErrorsAlert = getChildrenWithErrorsAlertProps(
    childrenWithErrorsCount,
    withdrawnChildrenCount,
    opts.alertType,
    opts.organizationId
  );
  useEffect(() => {
    if (isLoading) {
      // TODO: This line for some reason needs to exist so that Roster.test.tsx can
      // pass with the jestFunc() apiMock call, but it in theory shouldn't need to.
      // Investigate weirdness later.
      setAlerts([...alerts]);
      return;
    }

    // set alert if:
    // - no existing matching alert OR
    // - existing matching alert has different number (i.e. was displaying content for a different organization)
    const existingAlert = alerts.find(
      (a) => a.heading === childrenWithErrorsAlert.heading
    );
    const existingAlertText = drillReactNodeForText(existingAlert?.text);
    const otherAlerts = alerts.filter(
      (a) => a.heading !== childrenWithErrorsAlert.heading
    );

    if (!childrenWithErrorsCount) {
      // If there are no longer children with errors, we need to ditch that alert without overwriting alerts that may have come from other pages (ie. after delete child)
      setAlerts(otherAlerts);
      return;
    }

    if (
      !existingAlert ||
      !existingAlertText.includes(`${childrenWithErrorsCount}`)
    ) {
      setAlerts([...otherAlerts, childrenWithErrorsAlert]);
    }
  }, [childrenWithErrorsCount, isLoading, opts.alertType]);

  // If data is loading, we shouldn't display any alerts
  if (isLoading) return {};
  return { alertElements };
};

/**
 * Return props for the childrenWithErrors alert
 * @param numberOfChildrenWithErrors
 */
function getChildrenWithErrorsAlertProps(
  numberOfChildrenWithErrors: number,
  numberOfWithdrawnChildrenWithErrors: number,
  alertType: 'warning' | 'error' | undefined,
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
    type: alertType ? alertType : 'warning',
  };
}
