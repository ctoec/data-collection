import React, { useContext, useState } from 'react';
import { Enrollment } from '../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  AgeGroupField,
  FundingField,
} from '../../components/EditForms/EnrollmentFunding/Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../../components/EditForms/types';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost } from '../../utils/api';
import { useSites } from '../../hooks/useSites';
import { useFundingSpaces } from '../../hooks/useFundingSpaces';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import useIsMounted from '../../hooks/useIsMounted';
import { CareForKidsField } from '../../components/EditForms/CareForKids/CareForKidsField';

// This is separate from the other enrollment forms because they're pretty complicated
// Maybe we should try to reconcile though?
export const NewEnrollment = ({ child, onSuccess }: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);
  const enrollment =
    (child?.enrollments || []).find((e) => !e.exit) || ({} as Enrollment);

  if (!child) {
    throw new Error('Child info rendered without child');
  }

  const onSubmit = (_enrollment: Enrollment) => {
    setSaving(true);
    if (!Object.values(_enrollment).reduce((a, b) => a || b)) {
      // If all of the values are null or undefined, don't block
      onSuccess();
      return;
    }
    apiPost(
      `children/${child.id}/change-enrollment`,
      { newEnrollment: _enrollment },
      {
        accessToken,
        jsonParse: false,
      }
    )
      .then(onSuccess)
      .catch((err) => {
        console.log(err);
      })
      .finally(() => (isMounted() ? setSaving(false) : null));
  };

  // TODO: should these all be in some shared context rather than in hooks?
  const { sites } = useSites();
  const { fundingSpaces } = useFundingSpaces();
  const { reportingPeriods } = useReportingPeriods();

  return (
    <>
      <Form<Enrollment>
        id="change-enrollment-form"
        className="usa-form"
        data={enrollment}
        onSubmit={onSubmit}
      >
        <SiteField<Enrollment>
          sites={sites}
          accessor={(data) => data.at('site')}
        />
        <EnrollmentStartDateField<Enrollment>
          accessor={(data) => data.at('entry')}
        />
        <AgeGroupField<Enrollment> accessor={(data) => data.at('ageGroup')} />
        <FundingField<Enrollment>
          fundingAccessor={(data) => data.at('fundings').at(0)}
          getEnrollment={(data) => data.value}
          fundingSpaces={fundingSpaces}
          reportingPeriods={reportingPeriods}
        />
        <CareForKidsField />
        <FormSubmitButton
          text={saving ? 'Saving...' : 'Save'}
          disabled={saving}
        />
      </Form>
    </>
  );
};
