import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Alert, AlertProps } from '@ctoec/component-library';

type LocationType = Location & {
  state: {
    alerts: (AlertProps | undefined)[];
  };
};

// Push array of alerts to history state on page before
// E.g. history.push('new-path', { alerts: [{ ...alertProps }] });
// Optional additional alerts can be passed so that this hook handles all alert creation
export const useAlerts = () => {
  const { state } = useLocation() as LocationType;
  const history = useHistory();
  const previousPageAlerts = state?.alerts ?? [];
  const [alerts, setAlerts] = useState(previousPageAlerts);

  // Destroy the Location state for future loads
  // TODO: jj: We should refactor away from using Location state like this
  if (state?.alerts?.length) {
    history.replace({ ...history.location, state: { ...state, alerts: [] } });
  }

  if (alerts.length) {
    window.scrollTo(0, 0);
  }

  const alertElements = alerts
    .filter((alertProps) => !!alertProps)
    .map((alertProps, i) => (
      <Alert {...(alertProps as AlertProps)} key={`alerts-${i}`} />
    ));

  return [alertElements, setAlerts] as const;
};
