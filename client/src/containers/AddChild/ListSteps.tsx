import { StepProps, Button } from '@ctoec/component-library';
import React from 'react';

import { NewFamilyIncome } from './NewFamilyIncome';
import { NewEnrollment } from './NewEnrollment';
import { History } from 'history';
import { EditFormProps } from '../../components/Forms/types';
import {
  ChildIdentifiersForm,
  ChildInfoForm,
  doesChildIdFormHaveErrors,
  doesChildInfoFormHaveErrors,
  doesEnrollmentFormHaveErrors,
  doesFamilyAddressFormHaveErrors,
  doesFamilyIncomeFormHaveErrors,
  FamilyAddressForm,
} from '../../components/Forms';

export const listSteps: (_: any) => StepProps<EditFormProps>[] = (
  history: History
) => [
    {
      key: 'child-ident',
      name: 'Child identifiers',
      status: ({ child }) =>
        doesChildIdFormHaveErrors(child) ? 'incomplete' : 'complete',
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
      status: ({ child }) =>
        doesChildInfoFormHaveErrors(child) ? 'incomplete' : 'complete',
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
      status: ({ child }) =>
        doesFamilyAddressFormHaveErrors(child?.family)
          ? 'incomplete'
          : 'complete',
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
      Form: FamilyAddressForm,
    },
    {
      key: 'family-income',
      name: 'Family income determination',
      status: ({ child }) =>
        doesFamilyIncomeFormHaveErrors(child?.family) ? 'incomplete' : 'complete',
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
      status: ({ child }) =>
        doesEnrollmentFormHaveErrors(child) ? 'incomplete' : 'complete',
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
