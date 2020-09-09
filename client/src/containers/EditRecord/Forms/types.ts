import { Child, ReportingPeriod } from '../../../shared/models';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';

export type EditFormProps = {
  child: Child | undefined;
  onSuccess: () => void;
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
  reportingPeriods?: ReportingPeriod[];
  hideHeader?: boolean;
  // Header needs to be hidden in step list because the step list includes a header
};
