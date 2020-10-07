import { StepProps, Button } from '@ctoec/component-library';
import React from 'react';
import { History } from 'history';
import { RecordFormProps } from '../../components/Forms/types';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  FamilyAddressForm,
} from '../../components/Forms';
import { NewEnrollment } from '../../components/Forms/EnrollmentFunding/NewEnrollmentForm/NewEnrollment';
import { NewFamilyIncome } from '../../components/Forms/FamilyIncome/NewFamilyIncome/NewFamilyIncome';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import { Child } from '../../shared/models';

export const newForms = [
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
  // { key: SECTION_KEYS.DEMO, form: ChildInfoForm },
  // { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  // { key: SECTION_KEYS.INCOME, form: NewFamilyIncome },
  // { key: SECTION_KEYS.ENROLLMENT, form: NewEnrollment },
];

export const listSteps = (
  record: Child,
  setActiveStep: (stepKey: string) => void
) =>
  formSections
    .map(({ key, name, hasErrors }) => {
      const Form = newForms.find((s) => s.key === key)?.form || (() => <></>);
      const hasMissingInfo = hasErrors(record);
      if (hasMissingInfo) {
        return {
          key,
          name,
          // TODO: WHY THE F is this "props" object actually the child record???????
          status: (props) => {
            return hasErrors((props as any) as Child)
              ? 'incomplete'
              : 'complete';
          },
          Form,
          EditComponent: () => (
            <Button
              appearance="unstyled"
              text={
                <>
                  edit<span className="usa-sr-only"> {` ${name}`}</span>
                </>
              }
              onClick={() => setActiveStep(key)}
            />
          ),
        } as StepProps<RecordFormProps>;
      }
    })
    .filter((step) => !!step) as StepProps<RecordFormProps>[];
