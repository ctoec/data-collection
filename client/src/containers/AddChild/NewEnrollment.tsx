import React, { useContext, useState } from 'react';
import { Child, Enrollment } from '../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  AgeGroupField,
  FundingField,
} from '../../components/Forms/EnrollmentFunding/Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../../components/Forms/types';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost } from '../../utils/api';
import { useSites } from '../../hooks/useSites';
import { useFundingSpaces } from '../../hooks/useFundingSpaces';
import { useReportingPeriods } from '../../hooks/useReportingPeriods';
import useIsMounted from '../../hooks/useIsMounted';
import { CareForKidsField } from '../../components/Forms/CareForKids/CareForKidsField';
import { useValidationErrors } from '../../hooks/useValidationErrors';

// This is separate from the other enrollment forms because they're pretty complicated
// Maybe we should try to reconcile though?
export const NewEnrollment = ({
  child: inputChild,
  afterDataSave,
  hideErrorsOnFirstLoad = false,
}: EditFormProps) => {
  const { accessToken } = useContext(AuthenticationContext);
  const isMounted = useIsMounted();
  const [saving, setSaving] = useState(false);

  if (!inputChild) {
    throw new Error('Child info rendered without child');
  }

  const { obj: child, setErrorsHidden } = useValidationErrors<Child>(
    inputChild,
    hideErrorsOnFirstLoad
  );

  const enrollment =
    (child?.enrollments || []).find((e) => !e.exit) || ({} as Enrollment);

  const onSubmit = (_enrollment: Enrollment) => {
    setErrorsHidden(false);
    setSaving(true);
    if (!Object.values(_enrollment).every((value) => !value)) {
      // If all of the values are null or undefined, don't block
      afterDataSave();
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
      .then(afterDataSave)
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
