import { Child, ReportingPeriod } from '../../../shared/models';

export type EditFormProps = {
  child: Child | undefined;
  onSuccess: () => void;
  reportingPeriods?: ReportingPeriod[];
};
