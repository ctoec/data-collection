import { useEffect } from 'react';
import { useAlerts } from '../../../hooks/useAlerts';
import { drillReactNodeForText } from '../../../utils/getValidationStatus';
import { AlertProps } from '@ctoec/component-library';
import React from 'react';
import pluralize from 'pluralize';
import { Link } from 'react-router-dom';

export const useChildrenWithErrorsAlert = (
  isLoading: boolean,
  childrenWithErrorsCount: number
) => {
  const { alertElements, setAlerts, alerts } = useAlerts();
  const childrenWithErrorsAlert = getChildrenWithErrorsAlertProps(
    childrenWithErrorsCount
  );
  useEffect(() => {
    if (isLoading || !childrenWithErrorsAlert) {
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
  numberOfChildrenWithErrors: number
): AlertProps {
  return {
    text: (
      <span>
        You'll need to add required info for{' '}
        {pluralize('record', numberOfChildrenWithErrors, true)} before
        submitting your data to OEC. Update with{' '}
        <Link className="usa-button usa-button--unstyled" to="/batch-edit">
          batch editing.
        </Link>
      </span>
    ),
    heading: 'Update roster before submitting',
    type: 'warning',
  };
}
