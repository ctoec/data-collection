import { StepProps } from '@ctoec/component-library';
import React from 'react';
import {
  RecordFormProps,
  formSections,
  SECTION_KEYS,
  ChildInfoForm,
  ChildIdentifiersForm,
  FamilyAddressForm,
} from '../../components/Forms';
import { Child } from '../../shared/models';
import { EnrollmentFundingForm } from './EnrollmentFunding/Form';

const forms = [
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
  { key: SECTION_KEYS.DEMO, form: ChildInfoForm },
  { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  { key: SECTION_KEYS.ENROLLMENT, form: EnrollmentFundingForm },
];

/**
 * Util that determines which forms have errors for a particular child
 * and creates a formated string to display in the BatchEdit cards
 * below the name
 */
export const formatBatchEditPlaceholderString = (child: Child) => {
  const formsWithErrors = formSections.filter((section) =>
    section.hasError(child)
  );
  let errorStr = formsWithErrors
    .map(({ key, name, hasError }) => name)
    .join(', ');
  return errorStr;
};

export const listSteps = (child: Child) =>
  formSections
    .map(({ key, name, hasError }) => {
      const Form = forms.find((s) => s.key === key)?.form || (() => <></>);
      if (hasError(child)) {
        return {
          key,
          name,
          status: (props) =>
            hasError(props.child) ? 'incomplete' : 'complete',
          Form,
        } as StepProps<RecordFormProps>;
      }
    })
    .filter((step) => !!step) as StepProps<RecordFormProps>[];
