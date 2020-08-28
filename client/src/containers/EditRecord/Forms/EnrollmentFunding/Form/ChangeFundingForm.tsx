import React, { useContext, useState, useEffect } from 'react';
import {
  Enrollment,
  FundingSpace,
  ReportingPeriod,
  Funding,
} from '../../../../../shared/models';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import { ChangeFunding } from '../../../../../shared/payloads/ChangeFunding';
import { apiPost } from '../../../../../utils/api';
import {
  Card,
  Button,
  Form,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { ReportingPeriodField } from '../Fields/Funding/ReportingPeriod';
import { FundingField } from '../Fields/Funding/NewFunding';

type ChangeFundingFormProps = {
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];
  enrollment: Enrollment;
  refetchChild: () => void;
};

export const ChangeFundingForm: React.FC<ChangeFundingFormProps> = ({
  fundingSpaces,
  reportingPeriods,
  enrollment,
  refetchChild,
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
        refetchChild();
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
              {visibleForm === 'end'
                ? 'End current funding'
                : 'Start new funding'}
            </h3>
            {error && <Alert type="error" text={error} />}
            <Form<ChangeFunding>
              id="change-funding-form"
              className="usa-form"
              data={{}}
              onSubmit={onSubmit}
            >
              {visibleForm === 'start' && (
                <FundingField
                  reportingPeriods={reportingPeriods}
                  fundingSpaces={fundingSpaces}
                  ageGroup={enrollment.ageGroup}
                  site={enrollment.site}
                  isChangeFunding={true}
                />
              )}
              {!!activeFunding && (
                <ReportingPeriodField
                  reportingPeriods={reportingPeriods.filter(
                    (rp) => rp.type === activeFunding.fundingSpace.source
                  )}
                  isLast={true}
                  isChangeFunding={true}
                />
              )}
              <Button
                text="Cancel"
                appearance="outline"
                onClick={() => setVisibleForm(undefined)}
              />
              <FormSubmitButton
                text={loading ? 'Changing funding...' : 'Change funding'}
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
