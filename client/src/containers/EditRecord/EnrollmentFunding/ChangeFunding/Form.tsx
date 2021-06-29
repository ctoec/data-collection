import React, { useContext, useState } from 'react';
import { Form, Button, FormSubmitButton } from '@ctoec/component-library';
import { ChangeFundingRequest } from '../../../../shared/payloads';
import { NewFundingField } from '../../../../components/Forms/Enrollment/Fields';
import { Enrollment } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { getCurrentFunding } from '../../../../utils/models';
import { FundingEndDateField } from '../../../../components/Forms/Enrollment/Funding/Fields/FundingEndDate';

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
  const onSubmit = (updatedData: ChangeFundingRequest) => {
    setLoading(true);
    apiPost(`enrollments/${enrollment.id}/change-funding`, updatedData, {
      accessToken,
      jsonParse: false,
    })
      .then(afterSaveSuccess)
      .catch(afterSaveFailure)
      .finally(() => setLoading(false));
  };

  const activeFunding = getCurrentFunding({ enrollment: enrollment }) 
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
    <Form<ChangeFundingRequest>
      id="change-funding-form"
      className="usa-form"
      data={{}}
      onSubmit={onSubmit}
    >
      {changeType === 'start' && (
        <NewFundingField<ChangeFundingRequest>
          fundingAccessor={(data) => data.at('newFunding')}
          getEnrollment={() => enrollment}
          organizationId={orgId}
        />
      )}
      {!!activeFunding && (
				<FundingEndDateField<ChangeFundingRequest>
					fundingAccessor={(data) => data.at('oldFunding')}	
				/>
      )}
      <div className="display-flex flex-align-center">
        <Button text="Cancel" appearance="outline" onClick={hideForm} />
        <div className="margin-top-1">
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
      </div>
    </Form>
  );
};
