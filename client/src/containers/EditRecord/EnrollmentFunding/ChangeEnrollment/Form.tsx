import React, { useContext, useState } from 'react';
import {
  Form,
  ExpandCard,
  Button,
  FormSubmitButton,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { Enrollment, Child } from '../../../../shared/models';
import {
  SiteField,
  EnrollmentStartDateField,
  CareModelField,
  AgeGroupField,
  NewFundingField,
} from '../../../../components/Forms/Enrollment/Fields';
import { ReportingPeriodField } from '../../../../components/Forms/Enrollment/Funding/Fields';
import UserContext from '../../../../contexts/UserContext/UserContext';
import { apiPost } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';

type ChangeEnrollmentFormProps = {
  afterSaveSuccess: () => void;
  afterSaveFailure: (err: any) => void;
  child: Child;
  currentEnrollment?: Enrollment;
};

export const ChangeEnrollmentForm: React.FC<ChangeEnrollmentFormProps> = ({
  afterSaveSuccess,
  afterSaveFailure,
  child,
  currentEnrollment,
}) => {
  const { user } = useContext(UserContext);
  const sites = (user?.sites || []).filter(
    (site) => site.organization.id === child.organization?.id
  );

  const { accessToken } = useContext(AuthenticationContext);

  const [loading, setLoading] = useState(false);
  const onSubmit = (updatedData: ChangeEnrollment) => {
    setLoading(true);
    apiPost(`children/${child.id}/change-enrollment`, updatedData, {
      accessToken,
      jsonParse: false,
    })
      .then(afterSaveSuccess)
      .catch(afterSaveFailure)
      .finally(() => setLoading(false));
  };

  const activeFunding = currentEnrollment?.fundings?.find(
    (f) => !f.lastReportingPeriod
  );
  return (
    <Form<ChangeEnrollment>
      id="change-enrollment-form"
      className="usa-form"
      data={{ newEnrollment: {} as Enrollment }}
      onSubmit={onSubmit}
    >
      <SiteField<ChangeEnrollment>
        sites={sites}
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <EnrollmentStartDateField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <CareModelField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <AgeGroupField<ChangeEnrollment>
        enrollmentAccessor={(data) => data.at('newEnrollment')}
      />
      <NewFundingField<ChangeEnrollment>
        fundingAccessor={(data) =>
          data.at('newEnrollment').at('fundings').at(0)
        }
        getEnrollment={(data) => data.at('newEnrollment').value}
      />

      {!!currentEnrollment && (
        <>
          <h3>Previous enrollment</h3>
          {activeFunding && (
            <ReportingPeriodField<ChangeEnrollment>
              accessor={(data) =>
                data.at('oldEnrollment').at('funding').at('lastReportingPeriod')
              }
              fundingSource={activeFunding.fundingSpace?.source}
              isLast={true}
              optional={true}
              label={`Last reporting period for current ${activeFunding.fundingSpace?.source} - ${activeFunding.fundingSpace?.time} funding`}
            />
          )}
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
