import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  Card,
  ExpandCard,
  Button,
  CardExpansion,
  Alert,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { Enrollment, Child } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import { EnrollmentForm } from '../../../../components/Forms/Enrollment/Form';
import { ChangeEnrollmentForm } from './Form';

type ChangeEnrollmentCardProps = {
  child: Child;
  currentEnrollment?: Enrollment;
  afterDataSave: () => void;
};

/**
 * Component for gathering user input to change child's Enrollment.
 * Uses a ChangeEnrollment data object to enable the user to provide
 * enrollment end date and funding last reporting period for previously current data.
 */
export const ChangeEnrollmentCard: React.FC<ChangeEnrollmentCardProps> = ({
  child,
  currentEnrollment,
  afterDataSave,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
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
          afterSaveSuccess={afterDataSave}
          afterSaveFailure={(err) => setError(err)}
          child={child}
          currentEnrollment={currentEnrollment}
        />
      </CardExpansion>
    </Card>
  );
};
