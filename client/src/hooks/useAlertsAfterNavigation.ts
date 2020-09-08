import { useLocation } from "react-router-dom";
import { AlertProps } from "@ctoec/component-library";

type LocationType = Location & {
  state: {
    alerts: AlertProps[];
  };
};

// Push array of alerts to history state on page before
// E.g. history.push('new-path', { alerts: [{ ...alertProps }] });
export default () => {
  const location = useLocation() as LocationType;
  const alerts = location.state ? location.state.alerts : [];
  if (alerts.length) {
    window.scrollTo(0, 0);
  }
  return alerts;
}