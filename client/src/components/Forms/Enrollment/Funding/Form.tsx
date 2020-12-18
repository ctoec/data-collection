import React, { useState, useContext } from 'react';
import { Form, FormSubmitButton } from '@ctoec/component-library';
import { Funding, Child } from '../../../../shared/models';
import { ContractSpaceField, ReportingPeriodField } from './Fields';
import { RecordFormProps } from '../../types';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { apiPut } from '../../../../utils/api';
import {
  getCurrentEnrollment,
  getCurrentFunding,
} from '../../../../utils/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { NewFundingField } from '../Fields';
import { useValidationErrors } from '../../../../hooks/useValidationErrors';

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
} & RecordFormProps;

export const FundingForm: React.FC<FundingFormProps> = ({
  id,
  child,
  enrollmentId,
  fundingId,
  AdditionalButton,
  setAlerts,
  afterSaveSuccess,
  hideErrorsOnFirstLoad,
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

  // TODO: is an additional funding still created when a user enters incomplete info in create child, then enters different info and saves?
  // If so it's maybe bc we're not using the right funding here to fill in the info the second time around/not updating the right funding
  const funding = fundingId
    ? enrollment?.fundings?.find((f) => f.id === fundingId)
    : getCurrentFunding({ enrollment });

  if (!funding) {
    throw new Error('Funding form rendered without funding');
  }

  const { errorsHidden, setErrorsHidden } = useValidationErrors(
    hideErrorsOnFirstLoad
  );

  const { accessToken } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const onSubmit = (updatedData: Funding) => {
    setLoading(true);
    apiPut(`/enrollments/${enrollmentId}/fundings/${fundingId}`, updatedData, {
      accessToken,
    })
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Unable to save funding',
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
        setErrorsHidden(false);
      });
  };

  // If the funding has a funding space, render
  // the normal edit funding form (where only contract space,
  // first and last reporting periods are editable).
  // If the funding does NOT have a funding space, render
  // a form containing the "new funding" field, to enable
  // the user to select a funding source, contract space
  // and reporting periods
  return funding.fundingSpace ? (
    <Form<Funding>
      id={id}
      className="usa-form"
      data={funding}
      onSubmit={onSubmit}
      hideStatus={errorsHidden}
    >
      <ContractSpaceField<Funding>
        ageGroup={enrollment.ageGroup}
        fundingSource={funding.fundingSpace.source}
        organizationId={child.organization.id}
      />
      <ReportingPeriodField<Funding>
        fundingSource={funding.fundingSpace.source}
        accessor={(data) => data.at('firstReportingPeriod')}
        showStatus
      />
      {/* Only display last reporting period field if a value already exists */}
      {!!funding.lastReportingPeriod && (
        <ReportingPeriodField<Funding>
          fundingSource={funding.fundingSpace.source}
          accessor={(data) => data.at('lastReportingPeriod')}
          isLast={true}
          showStatus
        />
      )}
      {AdditionalButton}
      <FormSubmitButton
        text={loading ? 'Saving...' : 'Save'}
        disabled={loading}
      />
    </Form>
  ) : (
    <Form<Funding>
      id={id}
      className="usa-form"
      data={funding}
      onSubmit={onSubmit}
      hideStatus={errorsHidden}
    >
      <NewFundingField<Funding>
        getEnrollment={() => enrollment}
        organizationId={child.organization.id}
        isEdit={true}
      />
      {AdditionalButton}
      <FormSubmitButton
        text={loading ? 'Saving...' : 'Save'}
        disabled={loading}
      />
    </Form>
  );
};
