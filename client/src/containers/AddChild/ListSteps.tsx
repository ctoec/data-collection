import { StepProps, Button } from '@ctoec/component-library';
import { EditFormProps } from '../../components/EditForms/types';
import React from 'react';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  FamilyInfoForm,
} from '../../components/EditForms';
import { NewFamilyIncome } from './NewFamilyIncome';
import { NewEnrollment } from './NewEnrollment';
import { History } from 'history';

export const listSteps: (_: any) => StepProps<EditFormProps>[] = (
  history: History
) => [
  {
    key: 'child-ident',
    name: 'Child identifiers',
    status: () => 'incomplete',
    EditComponent: () => (
      <Button
        appearance="unstyled"
        text={
          <>
            edit<span className="usa-sr-only"> child identifiers</span>
          </>
        }
        onClick={() => history.replace({ hash: 'child-ident' })}
      />
    ),
    Form: ChildIdentifiersForm,
  },
  {
    key: 'child-info',
    name: 'Child info',
    status: () => 'incomplete',
    EditComponent: () => (
      <Button
        appearance="unstyled"
        text={
          <>
            edit<span className="usa-sr-only"> child info</span>
          </>
        }
        onClick={() => history.replace({ hash: 'child-info' })}
      />
    ),
    Form: ChildInfoForm,
  },
  {
    key: 'family-address',
    name: 'Family address',
    status: () => 'incomplete',
    EditComponent: () => (
      <Button
        appearance="unstyled"
        text={
          <>
            edit<span className="usa-sr-only"> family address</span>
          </>
        }
        onClick={() => history.replace({ hash: 'family-address' })}
      />
    ),
    Form: FamilyInfoForm,
  },
  {
    key: 'family-income',
    name: 'Family income determination',
    status: () => 'incomplete',
    EditComponent: () => (
      <Button
        appearance="unstyled"
        text={
          <>
            edit
            <span className="usa-sr-only"> family income determination</span>
          </>
        }
        onClick={() => history.replace({ hash: 'family-income' })}
      />
    ),
    Form: NewFamilyIncome,
  },
  {
    key: 'enrollment',
    name: 'Enrollment and funding',
    status: () => 'incomplete',
    EditComponent: () => (
      <Button
        appearance="unstyled"
        text={
          <>
            edit<span className="usa-sr-only"> enrollment and funding</span>
          </>
        }
        onClick={() => history.replace({ hash: 'enrollment' })}
      />
    ),
    Form: NewEnrollment,
  },
];
