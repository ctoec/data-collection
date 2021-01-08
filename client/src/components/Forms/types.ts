import { Child, ObjectWithValidationErrors } from '../../shared/models';
import { HideErrors } from '../../hooks/useValidationErrors';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';
import { HeadingLevel } from '../Heading';

export type RecordFormProps = {
  child: Child | undefined;
  afterSaveSuccess: () => void;
  setAlerts: Dispatch<SetStateAction<(AlertProps | undefined)[]>>;
  topHeadingLevel: HeadingLevel;
  hideHeader?: boolean; // Header needs to be hidden in step list because the step list includes a header
  hideErrors?: HideErrors;
  showFieldOrFieldset?: (
    formData: ObjectWithValidationErrors | undefined,
    fields: string[]
  ) => boolean;
  AdditionalButton?: JSX.Element; // Optional 'Cancel' (for forms in cards or card expansions) or 'Skip' (for forms in BatchEdit steplist) button
};
