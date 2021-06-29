import React, { useContext, useState } from 'react';
import {
  Form,
  ExpandCard,
  Button,
  FormSubmitButton,
} from '@ctoec/component-library';
import { ChangeEnrollmentRequest } from '../../../../shared/payloads';
import { Enrollment, Child } from '../../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  CareModelField,
  AgeGroupField,
  NewFundingField,
} from '../../../../components/Forms/Enrollment/Fields';
import UserContext from '../../../../contexts/UserContext/UserContext';
import { apiPost } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Heading, HeadingLevel } from '../../../../components/Heading';
import { nameFormatter } from '../../../../utils/formatters';
import { getCurrentFunding } from '../../../../utils/models';
import { FundingEndDateField } from '../../../../components/Forms/Enrollment/Funding/Fields/FundingEndDate';

export type ChangeEnrollmentFormProps = {
  afterSaveSuccess: () => void;
  afterSaveFailure: (err: any) => void;
  child: Child;
  currentEnrollment?: Enrollment;
  topHeadingLevel: HeadingLevel;
};

export const ChangeEnrollmentForm: React.FC<ChangeEnrollmentFormProps> = ({
  afterSaveSuccess,
  afterSaveFailure,
  child,
  currentEnrollment,
  topHeadingLevel,
}) => {
  const { user } = useContext(UserContext);
  const sites = (user?.sites || []).filter(
    (site) => site.organizationId === child.organization?.id
  );

  const { accessToken } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(false);
  const onSubmit = (updatedData: ChangeEnrollmentRequest) => {
    setLoading(true);

    apiPost(`children/${child.id}/change-enrollment`, updatedData, {
      accessToken,
      jsonParse: false,
    })
      .then(afterSaveSuccess)
      .catch(afterSaveFailure)
      .finally(() => setLoading(false));
  };

  const activeFunding = getCurrentFunding({ enrollment: currentEnrollment })

  if (activeFunding && !activeFunding?.fundingSpace) {
    return (
      <div>
        <p>
          Add missing enrollment and/or funding information before you can
          change {nameFormatter(child, { firstOnly: true })}'s enrollment
        </p>
        <ExpandCard>
          <Button text="Cancel" appearance="outline" />
        </ExpandCard>
      </div>
    );
  }

  return (
    <Form<ChangeEnrollmentRequest>
      id="change-enrollment-form"
      className="usa-form"
      data={{ newEnrollment: {} as Enrollment }}
      onSubmit={onSubmit}
    >
      <Heading level={topHeadingLevel} className="margin-top-2 margin-bottom-2">
        New enrollment
      </Heading>
      <SiteField<ChangeEnrollmentRequest>
        sites={sites}
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <EnrollmentStartDateField<ChangeEnrollmentRequest>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <CareModelField<ChangeEnrollmentRequest>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <AgeGroupField<ChangeEnrollmentRequest>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <NewFundingField<ChangeEnrollmentRequest>
        fundingAccessor={(data) =>
          data.at('newEnrollment').at('fundings').at(0)
        }
        getEnrollment={(data) => data.at('newEnrollment').value}
        organizationId={child.organization.id}
      />

      {!!currentEnrollment && activeFunding && (
        <>
          <Heading level={topHeadingLevel}>Previous enrollment</Heading>
					<FundingEndDateField<ChangeEnrollmentRequest>
						fundingAccessor={(data) => data.at('oldEnrollment').at('funding')}
					/>
        </>
      )}

      <ExpandCard>
        <Button text="Cancel" appearance="outline" />
      </ExpandCard>
      <FormSubmitButton
        text={loading ? 'Chaging enrollment...' : 'Change enrollment'}
        disabled={loading}
      />
    </Form>
  );
};
