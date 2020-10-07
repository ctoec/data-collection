import React, { useContext, useState } from 'react';
import {
  Card,
  Button,
  Form,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { Enrollment } from '../../../../shared/models';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { ChangeFunding } from '../../../../shared/payloads';
import { apiPost } from '../../../../utils/api';
import { NewFundingField } from '../../../../components/Forms/Enrollment/Fields';
import { ReportingPeriodField } from '../../../../components/Forms/Enrollment/Funding/Fields';
import { ChangeFundingForm } from './Form';

type ChangeFundingCardProps = {
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
export const ChangeFundingCard: React.FC<ChangeFundingCardProps> = ({
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
            <ChangeFundingForm
              afterSaveSuccess={() => {
                setError(undefined);
                setVisibleForm(undefined);
                afterDataSave();
              }}
              afterSaveFailure={(err) => {
                console.log(err);
                setError(
                  'Unable to change funding. Make sure all required information is provided'
                );
              }}
              changeType={visibleForm}
              enrollment={enrollment}
              hideForm={() => setVisibleForm(undefined)}
            />
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
