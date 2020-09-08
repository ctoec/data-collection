import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertProps } from '@ctoec/component-library';

type LocationType = Location & {
  state: {
    alerts: AlertProps[];
  };
};

// Push array of alerts to history state on page before
// E.g. history.push('new-path', { alerts: [{ ...alertProps }] });
// Optional additional alerts can be passed so that this hook handles all alert creation
export default (additionalAlerts: AlertProps[] = []) => {
  const location = useLocation() as LocationType;
  const alerts = (location.state ? location.state.alerts : []).concat(
    additionalAlerts
  );
  if (alerts.length) {
    window.scrollTo(0, 0);
  }
  return alerts.map((alertProps, i) => (
    <Alert {...alertProps} key={`alerts-${i}`} />
  ));
};
