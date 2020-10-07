import { StepProps, Button } from '@ctoec/component-library';
import React from 'react';
import { History } from 'history';
import { EditFormProps } from '../../components/Forms/types';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  FamilyAddressForm,
  EnrollmentForm,
} from '../../components/Forms';
import { NewFamilyIncome } from '../../components/Forms/FamilyIncome/NewFamilyIncome/NewFamilyIncome';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';

export const newForms = [
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
  { key: SECTION_KEYS.DEMO, form: ChildInfoForm },
  { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  { key: SECTION_KEYS.INCOME, form: NewFamilyIncome },
  { key: SECTION_KEYS.ENROLLMENT, form: EnrollmentForm },
];

export const listSteps: (_: any) => StepProps<EditFormProps>[] = (
  history: History
) =>
  formSections.map(({ key, name, status }) => {
    const Form = newForms.find((s) => s.key === key)?.form || (() => <></>);
    return {
      key,
      name,
      status: ({ child }) =>
        child && status(child) ? 'incomplete' : 'complete',
      EditComponent: () => (
        <Button
          appearance="unstyled"
          text={
            <>
              edit<span className="usa-sr-only">{` ${name}`}</span>
            </>
          }
          onClick={() => history.replace({ hash: key })}
        />
      ),
      Form,
    };
  });
