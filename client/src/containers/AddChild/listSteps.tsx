import { StepProps, Button } from '@ctoec/component-library';
import React from 'react';
import { NewFamilyIncome } from './NewFamilyIncome';
import { NewEnrollment } from './NewEnrollment';
import { History } from 'history';
import { EditFormProps } from '../../components/Forms/types';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  FamilyAddressForm,
} from '../../components/Forms';
import { commonFormStepInfo, TAB_IDS } from '../../components/Forms/commonFormStepInfo';

export const newForms = [
  { key: TAB_IDS.IDENT, form: ChildIdentifiersForm },
  { key: TAB_IDS.DEMO, form: ChildInfoForm },
  { key: TAB_IDS.FAMILY, form: FamilyAddressForm },
  { key: TAB_IDS.INCOME, form: NewFamilyIncome },
  { key: TAB_IDS.ENROLLMENT, form: NewEnrollment },
]

// TODO: FIX TYPING
export const listSteps: (_: any) => StepProps<EditFormProps>[] = (
  history: History
) => commonFormStepInfo.map(({ key, name, status }) => ({
  key,
  name,
  status: ({ child }) => child && status(child) ? 'incomplete' : 'complete',
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
  Form: newForms.find(s => s.key === key)?.form,
}))
