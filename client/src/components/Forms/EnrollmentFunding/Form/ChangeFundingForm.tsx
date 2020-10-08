import React, { useContext, useState } from 'react';
import { Enrollment } from '../../../../shared/models';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { ChangeFunding } from '../../../../shared/payloads/ChangeFunding';
import { apiPost } from '../../../../utils/api';
import {
  Card,
  Button,
  Form,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { ReportingPeriodField, NewFundingField } from '../Fields';

type ChangeFundingFormProps = {
  enrollment: Enrollment;
  orgId: number;
  afterDataSave: () => void;
};

/**
 * Component for gathering user input to change enrollment's funding.
 * Uses a ChangeFunding data object to enable the user to provide
 * new funding data and/or last reporting period for previously current
 * funding, based on user's chosen action (start new funding vs end current funding)
 */
export const ChangeFundingForm: React.FC<ChangeFundingFormProps> = ({
  enrollment,
  orgId,
  afterDataSave,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onSubmit = (changeFunding: ChangeFunding) => {
    setLoading(true);
    apiPost(`enrollments/${enrollment.id}/change-funding`, changeFunding, {
      accessToken,
      jsonParse: false,
    })
      .then(() => {
        setError(undefined);
        setVisibleForm(undefined);
        afterDataSave();
      })
      .catch((err) => {
        console.log(err);
        setError(
          'Unable to change funding. Make sure all required information is provided'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [visibleForm, setVisibleForm] = useState<'end' | 'start'>();

  const activeFunding = (enrollment.fundings || []).find(
    (f) => !f.lastReportingPeriod
  );
  return (
    <>
      {!!visibleForm && (
        <Card>
          <>
            <h3>
              {visibleForm === 'end' ? 'End current funding' : 'Change funding'}
            </h3>
            {error && <Alert type="error" text={error} />}
            <Form<ChangeFunding>
              id="change-funding-form"
              className="usa-form"
              data={{}}
              onSubmit={onSubmit}
            >
              {visibleForm === 'start' && (
                <NewFundingField<ChangeFunding>
                  fundingAccessor={(data) => data.at('newFunding')}
                  getEnrollment={() => enrollment}
                  orgId={orgId}
                />
              )}
              {!!activeFunding && (
                <ReportingPeriodField<ChangeFunding>
                  accessor={(data) =>
                    data.at('oldFunding').at('lastReportingPeriod')
                  }
                  fundingSource={activeFunding.fundingSpace.source}
                  isLast={true}
                  label={`Last reporting period for current ${activeFunding.fundingSpace?.source} - ${activeFunding.fundingSpace?.time} funding`}
                  optional={visibleForm === 'start'}
                />
              )}
              <Button
                text="Cancel"
                appearance="outline"
                onClick={() => setVisibleForm(undefined)}
              />
              <FormSubmitButton
                text={
                  loading
                    ? visibleForm === 'end'
                      ? 'Ending funding...'
                      : 'Changing funding...'
                    : visibleForm === 'end'
                    ? 'End current funding'
                    : 'Change current funding'
                }
                disabled={loading}
              />
            </Form>
          </>
        </Card>
      )}
      <Card>
        <div className="display-flex flex-column flex-align-end">
          <div>
            {activeFunding && (
              <Button
                className="margin-right-4"
                text="End current funding"
                appearance="unstyled"
                onClick={() => setVisibleForm('end')}
              />
            )}
            <Button
              text="Start new funding"
              appearance="unstyled"
              onClick={() => setVisibleForm('start')}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
