import React from 'react';
import { StepProps, Button } from '@ctoec/component-library';
import {
  EditFormProps,
  SECTION_KEYS,
  formSections,
  // ChildIdentifiersForm,
  // ChildInfoForm,
  // FamilyAddressForm,
} from '../../components/Forms';
import { EnrollmentFundingForm } from './EnrollmentFunding/Form';
import { Child } from '../../shared/models';

const forms = [{ key: SECTION_KEYS.ENROLLMENT, form: EnrollmentFundingForm }];

export const listSteps = (child: Child) =>
  formSections
    .filter((s) => s.key === SECTION_KEYS.ENROLLMENT)
    .map(({ key, name, hasError }) => {
      const Form = forms.find((s) => s.key === key)?.form || (() => <></>);
      if (hasError(child)) {
        return {
          key,
          name,
          status: (props) =>
            hasError(props.child) ? 'incomplete' : 'complete',
          Form,
        } as StepProps<EditFormProps>;
      }
    })
    .filter((step) => !!step) as StepProps<EditFormProps>[];
