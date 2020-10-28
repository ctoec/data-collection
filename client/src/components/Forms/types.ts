import { Child, ObjectWithValidationErrors } from '../../shared/models';
import { HideErrors } from '../../hooks/useValidationErrors';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';

export type RecordFormProps = {
  child: Child | undefined;
  afterSaveSuccess: () => void;
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
  hideHeader?: boolean; // Header needs to be hidden in step list because the step list includes a header
  hideErrorsOnFirstLoad?: HideErrors;
  showFieldOrFieldset?: (
    formData: ObjectWithValidationErrors | undefined,
    fields: string[]
  ) => boolean;
  AdditionalButton?: JSX.Element; // Optional 'Cancel' (for forms in cards or card expansions) or 'Skip' (for forms in BatchEdit steplist) button
};
