import { useEffect, useState, useContext } from 'react';
import { apiGet } from '../utils/api';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import { ReportingPeriod } from '../shared/models';

export function useReportingPeriods(_reportingPeriods?: ReportingPeriod[]) {
  // Get site options for new enrollments
  const { accessToken } = useContext(AuthenticationContext);
  const [reportingPeriods, setReportingPeriods] = useState<ReportingPeriod[]>(
    _reportingPeriods || []
  );
  useEffect(() => {
    // Only run if reporting periods have not been provided as a prop
    // This is silly but you can't run hooks conditionally
    // And having this here allows us to reuse components and avoid extraneous network requests
    if (!_reportingPeriods) {
      apiGet('reporting-periods', { accessToken }).then((_reportingPeriods) =>
        setReportingPeriods(_reportingPeriods || [])
      );
    }
  }, [accessToken]);

  return { reportingPeriods };
}
