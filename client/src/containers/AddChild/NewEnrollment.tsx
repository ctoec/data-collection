import React, { useContext, useState } from 'react';
import { Enrollment } from '../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  AgeGroupField,
  FundingField,
} from '../EditRecord/Forms/EnrollmentFunding/Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../EditRecord/Forms/types';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost } from '../../utils/api';
import { useSites } from '../../hooks/useSites';
import { useFundingSpaces } from '../../hooks/useFundingSpaces';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import useIsMounted from '../../hooks/useIsMounted';

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
        <h3 className="font-heading-md margin-bottom-0">Site</h3>
        <SiteField<Enrollment>
          sites={sites}
          accessor={(data) => data.at('site')}
        />
        <h3 className="font-heading-md margin-bottom-0">Start date</h3>
        <EnrollmentStartDateField<Enrollment>
          accessor={(data) => data.at('entry')}
        />
        <h3 className="font-heading-md margin-bottom-0">Age group</h3>
        <AgeGroupField<Enrollment> accessor={(data) => data.at('ageGroup')} />
        <FundingField<Enrollment>
          fundingAccessor={(data) => data.at('fundings').at(0)}
          getEnrollment={(data) => data.value}
          fundingSpaces={fundingSpaces}
          reportingPeriods={reportingPeriods}
        />
        <FormSubmitButton
          text={saving ? 'Saving...' : 'Save'}
          disabled={saving}
        />
      </Form>
    </>
  );
};
