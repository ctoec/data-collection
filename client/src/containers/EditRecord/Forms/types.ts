import { Child, ReportingPeriod } from '../../../shared/models';

export type EditFormProps = {
  child: Child | undefined;
  onSuccess: () => void;
  reportingPeriods?: ReportingPeriod[];
  hideHeader?: boolean;
  // Header needs to be hidden in step list because the step list includes a header
};
