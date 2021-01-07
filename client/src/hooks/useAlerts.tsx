import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertProps } from '@ctoec/component-library';

type LocationType = Location & {
  state: {
    alerts: (AlertProps | undefined)[];
  };
};

// Push array of alerts to history state on page before
// E.g. history.push('new-path', { alerts: [{ ...alertProps }] });
// Optional additional alerts can be passed so that this hook handles all alert creation
export const useAlerts = (initialAlerts: AlertProps[] = []) => {
  const location = useLocation() as LocationType;
  const previousPageAlerts = location.state?.alerts || [];
  const [alerts, setAlerts] = useState([
    ...initialAlerts,
    ...previousPageAlerts,
  ]);

  if (alerts.length) {
    window.scrollTo(0, 0);
  }

  console.log('alerts', alerts);
  const alertElements = alerts
    .filter((alertProps) => !!alertProps)
    .map((alertProps, i) => (
      <Alert {...(alertProps as AlertProps)} key={`alerts-${i}`} />
    ));

  console.log('els', alertElements);
  return { alertElements, alerts, setAlerts };
};
