import React, { useState } from 'react';
import { Card, Button } from '@ctoec/component-library';
import { Enrollment } from '../../../../shared/models';
import { ChangeFundingForm } from './Form';
import { RecordFormProps } from '../../../../components/Forms';
import { Heading, HeadingLevel } from '../../../../components/Heading';
import { getCurrentFunding } from '../../../../utils/models';

type ChangeFundingCardProps = {
  enrollment: Enrollment;
  orgId: number;
  afterSaveSuccess: () => void;
  setAlerts: RecordFormProps['setAlerts'];
  topHeadingLevel: HeadingLevel;
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
  setAlerts,
  topHeadingLevel,
}) => {
  const [visibleForm, setVisibleForm] = useState<'end' | 'start'>();
  const activeFunding = getCurrentFunding({ enrollment })
	
	return (
    <>
      {!!visibleForm && (
        <Card>
          <>
            <Heading level={topHeadingLevel}>
              {visibleForm === 'end' ? 'End current funding' : 'Change funding'}
            </Heading>
            <ChangeFundingForm
              afterSaveSuccess={() => {
                setVisibleForm(undefined);
                afterSaveSuccess();
              }}
              afterSaveFailure={(err) => {
                console.error(err);
                setAlerts([
                  {
                    type: 'error',
                    text:
                      'Unable to change funding. Make sure all required information is provided',
                  },
                ]);
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
              text={activeFunding ? 'Change funding' : 'Start new funding'}
              appearance="unstyled"
              onClick={() => setVisibleForm('start')}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
