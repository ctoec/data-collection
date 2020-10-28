import React, { useState, useEffect } from 'react';
import {
  Card,
  ExpandCard,
  Button,
  CardExpansion,
  Alert,
  CardProps,
} from '@ctoec/component-library';
import { Enrollment, Child } from '../../../../shared/models';
import { ChangeEnrollmentForm } from './Form';

type ChangeEnrollmentCardProps = CardProps & {
  child: Child;
  currentEnrollment?: Enrollment;
  key?: string;
  activeKey?: string;
  afterSaveSuccess: () => void;
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
  expanded,
}) => {
  const [expandedCard, setExpandedCard] = useState(expanded);
  const [closeCard, setCloseCard] = useState(false);
  const [error, setError] = useState<string>();

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
        <h3 className="margin-top-2 margin-bottom-2">New enrollment</h3>
        {error && <Alert type="error" text={error} />}
        <ChangeEnrollmentForm
          afterSaveSuccess={() => {
            setCloseCard(true);
            afterSaveSuccess();
          }}
          afterSaveFailure={(err) => setError(err)}
          child={child}
          currentEnrollment={currentEnrollment}
        />
      </CardExpansion>
    </Card>
  );
};
