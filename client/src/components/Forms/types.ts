import { Child, ReportingPeriod } from '../../shared/models';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';
import { HideErrors } from '../../hooks/useValidationErrors';

export type EditFormProps = {
  child: Child | undefined;
  afterDataSave: () => void;
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
  reportingPeriods?: ReportingPeriod[];
  hideHeader?: boolean;
  hideErrorsOnFirstLoad?: HideErrors;
  // Header needs to be hidden in step list because the step list includes a header
};
