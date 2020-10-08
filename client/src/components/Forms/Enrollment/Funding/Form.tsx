import React, { useState, useContext } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Funding, Child } from '../../../../shared/models';
import { ContractSpaceField, ReportingPeriodField } from './Fields';
import { EditFormProps } from '../../types';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../../utils/api';
import {
  getCurrentEnrollment,
  getCurrentFunding,
} from '../../../../utils/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

const fundingFields = [
  'fundingSpace',
  'firstReportingPeriod',
  'lastReportingPeriod',
];
export const doesFundingFormHaveErrors = (
  child?: Child,
  enrollmentId?: number,
  fundingId?: number
) => {
  if (enrollmentId && fundingId) {
    const funding = child?.enrollments
      ?.find((enrollment) => enrollment.id === enrollmentId)
      ?.fundings?.find((funding) => funding.id === fundingId);
    return funding
      ? !!getValidationStatusForFields(funding, fundingFields)
      : false;
  }
  return false;
};

type FundingFormProps = {
  id: string;
  enrollmentId: number;
  fundingId: number;
  submitButtonText?: string;
  CancelButton?: JSX.Element;
} & EditFormProps;

export const FundingForm: React.FC<FundingFormProps> = ({
  id,
  child,
  enrollmentId,
  fundingId,
  submitButtonText = 'Save',
  CancelButton,
  setAlerts,
  afterSaveSuccess,
  showField = () => true,
}) => {
  if (!child) {
    throw new Error('Funding form rendered without child');
  }

  const enrollment = enrollmentId
    ? child.enrollments?.find((e) => e.id === enrollmentId)
    : getCurrentEnrollment(child);

  if (!enrollment) {
    throw new Error('Funding form rendered without enrollment');
  }

  const funding = fundingId
    ? enrollment?.fundings?.find((f) => f.id === fundingId)
    : getCurrentFunding({ enrollment });

  if (!funding) {
    throw new Error('Funding form rendered without funding');
  }

  const { accessToken } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const onSubmit = (updatedData: Funding) => {
    setLoading(true);
    apiPut(`/enrollments/${enrollmentId}/fundings/${fundingId}`, updatedData, {
      accessToken,
    })
      .then(afterSaveSuccess)
      .catch((err) => {
        console.log(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save funding',
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form<Funding>
      id={id}
      className="usa-form"
      data={funding}
      onSubmit={onSubmit}
    >
      {showField(funding, ['fundingSpace'], []) && (
        <ContractSpaceField<Funding>
          ageGroup={enrollment.ageGroup}
          fundingSource={funding.fundingSpace.source}
          organizationId={enrollment.site.organization.id}
          accessor={(data) => data.at('fundingSpace')}
        />
      )}
      {showField(funding, ['firstReportingPeriod'], []) && (
        <ReportingPeriodField<Funding>
          fundingSource={funding.fundingSpace.source}
          accessor={(data) => data.at('firstReportingPeriod')}
        />
      )}
      {showField(funding, ['lastReportingPeriod'], []) && (
        <ReportingPeriodField<Funding>
          fundingSource={funding.fundingSpace.source}
          accessor={(data) => data.at('lastReportingPeriod')}
          isLast={true}
        />
      )}
      {CancelButton}
      <FormSubmitButton
        text={loading ? 'Saving...' : submitButtonText}
        disabled={loading}
      />
    </Form>
  );
};
