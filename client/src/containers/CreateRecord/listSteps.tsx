import { StepProps, Button } from '@ctoec/component-library';
import React from 'react';
import { History } from 'history';
import { RecordFormProps } from '../../components/Forms/types';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  FamilyAddressForm,
  EnrollmentForm,
  FamilyIncomeForm,
} from '../../components/Forms';
import {
  SECTION_KEYS,
  formSections,
} from '../../components/Forms/formSections';
import { UndefinableBoolean } from '../../shared/models';

export const newForms = [
  { key: SECTION_KEYS.IDENT, form: ChildIdentifiersForm },
  { key: SECTION_KEYS.DEMO, form: ChildInfoForm },
  { key: SECTION_KEYS.FAMILY, form: FamilyAddressForm },
  { key: SECTION_KEYS.INCOME, form: FamilyIncomeForm },
  { key: SECTION_KEYS.ENROLLMENT, form: EnrollmentForm },
];

export const listSteps: (_: any) => StepProps<RecordFormProps>[] = (
  history: History
) =>
  formSections.map(({ key, name, hasError }) => {
    const Form = newForms.find((s) => s.key === key)?.form || (() => <></>);
    return {
      key,
      name,
      status: ({ child }) => {
        return child && hasError(child) ? 'incomplete' : 'complete';
      },
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
