import React, { useState, useEffect } from 'react';
import {
  Card,
  ExpandCard,
  Button,
  CardExpansion,
} from '@ctoec/component-library';
import { Enrollment, Child } from '../../../../shared/models';
import { ChangeEnrollmentForm } from './Form';
import { RecordFormProps } from '../../../../components/Forms';
import {
  getNextHeadingLevel,
  Heading,
  HeadingLevel,
} from '../../../../components/Heading';

type ChangeEnrollmentCardProps = {
  child: Child;
  currentEnrollment?: Enrollment;
  afterSaveSuccess: () => void;
  setAlerts: RecordFormProps['setAlerts'];
  topHeadingLevel: HeadingLevel;
};

/**
 * Component for gathering user input to change child's Enrollment.
 * Uses a ChangeEnrollment data object to enable the user to provide
 * enrollment end date and funding last reporting period for previously current data.
 */
export const ChangeEnrollmentCard: React.FC<ChangeEnrollmentCardProps> = ({
  child,
  currentEnrollment,
  afterSaveSuccess,
  setAlerts,
  topHeadingLevel,
}) => {
  const [closeCard, setCloseCard] = useState(false);

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  return (
    <Card forceClose={closeCard}>
      <div className="display-flex flex-justify flex-row flex-align-center">
        {!currentEnrollment ? (
          <div className="usa-prose-body">
            {child.firstName} has no active enrollments
          </div>
        ) : (
          <div className="usa-prose-body">
            Has {child.firstName}'s age group and/or site changed?
          </div>
        )}
        <ExpandCard>
          <Button text="Change enrollment" appearance="outline" />
        </ExpandCard>
      </div>
      <CardExpansion>
        <ChangeEnrollmentForm
          // No headings in this card component so just pass the value straight through
          topHeadingLevel={topHeadingLevel}
          afterSaveSuccess={() => {
            setCloseCard(true);
            afterSaveSuccess();
          }}
          afterSaveFailure={(err) => {
            console.error(err);
            setAlerts([
              {
                type: 'error',
                text: 'Unable to save enrollment',
              },
            ]);
          }}
          child={child}
          currentEnrollment={currentEnrollment}
        />
      </CardExpansion>
    </Card>
  );
};
