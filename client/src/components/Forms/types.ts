import { Child } from '../../shared/models';
import { HideErrors } from '../../hooks/useValidationErrors';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';

export type EditFormProps = {
  child: Child | undefined;
  afterSaveSuccess: () => void;
  // afterSaveFailure: (err: any) => void;
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
  hideHeader?: boolean; // Header needs to be hidden in step list because the step list includes a header
  hideErrorsOnFirstLoad?: HideErrors;
  showField?: (
    formData: any,
    fields: string[],
    allFormFields: string[]
  ) => boolean;
  AdditionalButton?: JSX.Element;
};
