import React from 'react';
import { EditFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment } from '../../../shared/models';

export const EnrollmentFundingForm: React.FC<EditFormProps> = ({
  child,
  afterSaveSuccess,
}) => {
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

  // Separate enrollments into current (no end date) and past
  // (with end date). Either may not exist
  return (
    <>
      <h2>Enrollment and funding</h2>
      <ChangeEnrollmentCard
        child={child}
        currentEnrollment={currentEnrollment}
        afterSaveSuccess={afterSaveSuccess}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
          <EditEnrollmentCard
            key="edit-current-enrollment"
            isCurrent={true}
            child={child}
            enrollmentId={currentEnrollment.id}
            afterSaveSuccess={afterSaveSuccess}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingCard
              key={funding.id}
              isCurrent={true}
              child={child}
              fundingId={funding.id}
              enrollmentId={currentEnrollment.id}
              afterSaveSuccess={afterSaveSuccess}
            />
          ))}
          <ChangeFundingCard
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
                key={enrollment.id}
                child={child}
                enrollmentId={enrollment.id}
                afterSaveSuccess={afterSaveSuccess}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  key={funding.id}
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
