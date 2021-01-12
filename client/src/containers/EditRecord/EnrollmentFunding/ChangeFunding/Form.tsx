import React, { useContext, useState } from 'react';
import { Form, Button, FormSubmitButton } from '@ctoec/component-library';
import { ChangeFunding } from '../../../../shared/payloads';
import { NewFundingField } from '../../../../components/Forms/Enrollment/Fields';
import { ReportingPeriodField } from '../../../../components/Forms/Enrollment/Funding/Fields';
import { Enrollment, FundingSource } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';

type ChangeFundingFormProps = {
  orgId: number;
  afterSaveSuccess: () => void;
  afterSaveFailure: (err: any) => void;
  changeType: 'start' | 'end';
  enrollment: Enrollment;
  hideForm: () => void;
};

export const ChangeFundingForm: React.FC<ChangeFundingFormProps> = ({
  orgId,
  afterSaveSuccess,
  afterSaveFailure,
  changeType,
  enrollment,
  hideForm,
}) => {
  const [loading, setLoading] = useState(false);
  const { accessToken } = useContext(AuthenticationContext);
  const onSubmit = (updatedData: ChangeFunding) => {
    setLoading(true);
    apiPost(`enrollments/${enrollment.id}/change-funding`, updatedData, {
      accessToken,
      jsonParse: false,
    })
      .then(afterSaveSuccess)
      .catch(afterSaveFailure)
      .finally(() => setLoading(false));
  };

  const activeFunding = enrollment.fundings?.find(
    (f) => !f.lastReportingPeriod
  );

  if (activeFunding && !activeFunding.fundingSpace) {
    return (
      <div>
        <p>
          Add missing enrollment and/or funding formatoin before you can change
          funding.
        </p>
        <Button text="Cancel" appearance="outline" onClick={hideForm} />
      </div>
    );
  }

  return (
    <Form<ChangeFunding>
      id="change-funding-form"
      className="usa-form"
      data={{}}
      onSubmit={onSubmit}
    >
      {changeType === 'start' && (
        <NewFundingField<ChangeFunding>
          fundingAccessor={(data) => data.at('newFunding')}
          getEnrollment={() => enrollment}
          organizationId={orgId}
        />
      )}
      {!!activeFunding && (
        <ReportingPeriodField<ChangeFunding>
          accessor={(data) => data.at('oldFunding').at('lastReportingPeriod')}
          fundingSource={activeFunding.fundingSpace?.source as FundingSource} // This is known to have a value (check on line 44)
          isLast={true}
          label={`Last reporting period for current ${activeFunding.fundingSpace?.source} - ${activeFunding.fundingSpace?.time} funding`}
          optional={changeType === 'start'}
        />
      )}
      <div className="funding-form-buttons">
        <Button text="Cancel" appearance="outline" onClick={hideForm} />
        <FormSubmitButton
          text={
            loading
              ? changeType === 'end'
                ? 'Ending funding...'
                : 'Changing funding...'
              : changeType === 'end'
              ? 'End current funding'
              : 'Change current funding'
          }
          disabled={loading}
        />
      </div>
    </Form>
  );
};
