import { StepProps } from '@ctoec/component-library';
import React from 'react';
import {
  RecordFormProps,
  formSections,
  SECTION_KEYS,
} from '../../components/Forms';
import { Child } from '../../shared/models';
import { EnrollmentFundingForm } from './EnrollmentFunding/Form';

const forms = [
  { key: SECTION_KEYS.ENROLLMENT, form: EnrollmentFundingForm },
  { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
];

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