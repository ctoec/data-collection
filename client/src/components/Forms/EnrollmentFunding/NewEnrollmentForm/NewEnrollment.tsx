import React, { useContext, useState } from 'react';
import { Child, Enrollment } from '../../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  AgeGroupField,
  NewFundingField,
  CareModelField,
} from '../Fields';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { EditFormProps } from '../../types';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPost } from '../../../../utils/api';
import { useSites } from '../../../../hooks/useSites';
import useIsMounted from '../../../../hooks/useIsMounted';
import { useValidationErrors } from '../../../../hooks/useValidationErrors';
import { getCurrentEnrollment } from '../../../../utils/models';

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

  const enrollment = getCurrentEnrollment(child) || ({} as Enrollment);

  const onSubmit = (_enrollment: Enrollment) => {
    setErrorsHidden(false);
    setSaving(true);
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
        <CareModelField<Enrollment> accessor={(data) => data.at('model')} />
        <AgeGroupField<Enrollment> accessor={(data) => data.at('ageGroup')} />
        <NewFundingField<Enrollment>
          fundingAccessor={(data) => data.at('fundings').at(0)}
          getEnrollment={(data) => data.value}
          // Always has an organization because either modifies an
          // existing child, or creates a new one via org roster
          orgId={child.organization.id}
        />
        <FormSubmitButton
          text={saving ? 'Saving...' : 'Save'}
          disabled={saving}
        />
      </Form>
    </>
  );
};
