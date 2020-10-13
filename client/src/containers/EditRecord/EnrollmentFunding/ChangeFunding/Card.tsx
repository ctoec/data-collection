import React, { useState } from 'react';
import { Card, Button, Alert } from '@ctoec/component-library';
import { Enrollment } from '../../../../shared/models';
import { ChangeFundingForm } from './Form';

type ChangeFundingCardProps = {
  enrollment: Enrollment;
  orgId: number;
  afterSaveSuccess: () => void;
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
  afterSaveSuccess,
}) => {
  const [error, setError] = useState<string>();
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
                afterSaveSuccess();
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
              orgId={orgId}
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