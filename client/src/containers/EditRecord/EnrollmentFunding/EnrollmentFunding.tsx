import React from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment } from '../../../shared/models';
import { useState } from 'react';

export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
}) => {
  const [activeCard, setActiveCard] = useState<string>();

  if (!child) {
    return <></>;
  }

  // Separate enrollments into current (no end date) and past
  // (with end date). Either may not exist
  const enrollments: Enrollment[] = child.enrollments || [];
  const currentEnrollment: Enrollment | undefined = enrollments.find(
    (e) => !e.exit
  );
  const pastEnrollments: Enrollment[] = currentEnrollment
    ? enrollments.filter((e) => e.id !== currentEnrollment.id)
    : enrollments;

  return (
    <>
      <h2>Enrollment and funding</h2>
      <ChangeEnrollmentCard
        key="change-enrollement"
        child={child}
        currentEnrollment={currentEnrollment}
        afterSaveSuccess={afterSaveSuccess}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
          <EditEnrollmentCard
            key="edit-current-enrollment"
            expanded={true}
            isCurrent={true}
            child={child}
            enrollmentId={currentEnrollment.id}
            afterSaveSuccess={afterSaveSuccess}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingCard
              key={`edit-funding-${funding.id}`}
              expanded={true}
              isCurrent={true}
              child={child}
              fundingId={funding.id}
              enrollmentId={currentEnrollment.id}
              afterSaveSuccess={afterSaveSuccess}
            />
          ))}
          <ChangeFundingCard
            key="change-funding-card"
            expanded={true}
            enrollment={currentEnrollment}
            orgId={child.organization.id}
            afterSaveSuccess={afterSaveSuccess}
          />
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <h3>Past enrollments</h3>
          {pastEnrollments.map((enrollment) => (
            <>
              <EditEnrollmentCard
                key={`edit-enrollment-card-${enrollment.id}`}
                // onExpansionChange={(isActive) => isActive ? setActiveCard(`edit-enrollment-card-${enrollment.id}`) : setActiveCard(undefined)}
                expanded={
                  activeCard === `edit-enrollment-card-${enrollment.id}`
                }
                child={child}
                enrollmentId={enrollment.id}
                afterSaveSuccess={afterSaveSuccess}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  key={`edit-funding-card-${funding.id}`}
                  expanded={true}
                  child={child}
                  fundingId={funding.id}
                  enrollmentId={enrollment.id}
                  afterSaveSuccess={afterSaveSuccess}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
