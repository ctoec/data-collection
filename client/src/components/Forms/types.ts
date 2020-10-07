import { Child } from '../../shared/models';
import { Dispatch, SetStateAction } from 'react';
import { AlertProps } from '@ctoec/component-library';
import { HideErrors } from '../../hooks/useValidationErrors';

export type RecordFormProps = {
  record: Child | undefined;
  afterDataSave: () => void;
  setAlerts: Dispatch<SetStateAction<AlertProps[]>>;
  hideHeader?: boolean; // Header needs to be hidden in step list because it includes a header
  hideErrorsOnFirstLoad?: HideErrors;
  batchEditProps?: {
    showField: (_: string | string[], __: string[], record: Child) => boolean;
    SkipButton: JSX.Element;
  };
};
