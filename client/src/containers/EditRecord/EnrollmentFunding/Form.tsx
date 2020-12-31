import React from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment } from '../../../shared/models';
import { getNextHeadingLevel, Heading } from '../../../components/Heading';

export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  topHeadingLevel,
}) => {
  if (!child) {
    throw new Error('Enrollment funding form rendered without child');
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

  const commonProps = {
    afterSaveSuccess,
    child,
    setAlerts,
  };

  return (
    <>
      <Heading level={topHeadingLevel}>Enrollment and funding</Heading>
      <ChangeEnrollmentCard
        {...commonProps}
        topHeadingLevel={getNextHeadingLevel(topHeadingLevel)}
        currentEnrollment={currentEnrollment}
      />
      {currentEnrollment && (
        <>
          <Heading level={getNextHeadingLevel(topHeadingLevel)}>
            Current enrollment
          </Heading>
          <EditEnrollmentCard
            {...commonProps}
            key="edit-current-enrollment"
            isCurrent={true}
            enrollmentId={currentEnrollment.id}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingCard
              {...commonProps}
              key={funding.id}
              isCurrent={true}
              fundingId={funding.id}
              enrollmentId={currentEnrollment.id}
            />
          ))}
          <ChangeFundingCard
            {...commonProps}
            enrollment={currentEnrollment}
            orgId={child.organization.id}
            // This heading should be nested under current enrollment
            topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
          />
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <Heading level={getNextHeadingLevel(topHeadingLevel)}>
            Past enrollments
          </Heading>
          {pastEnrollments.map((enrollment) => (
            <>
              <EditEnrollmentCard
                {...commonProps}
                key={enrollment.id}
                enrollmentId={enrollment.id}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  {...commonProps}
                  key={funding.id}
                  fundingId={funding.id}
                  enrollmentId={enrollment.id}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
