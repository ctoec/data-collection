import React from 'react';
import { ChangeEnrollmentForm } from './ChangeEnrollmentForm';
import { EditEnrollmentForm } from './EditEnrollmentForm';
import { EditFundingForm } from './EditFundingForm';
import { ChangeFundingForm } from './ChangeFundingForm';
import { EditFormProps } from '../../types';
import { useSites } from '../../../../hooks/useSites';
import { useFundingSpaces } from '../../../../hooks/useFundingSpaces';
import { useReportingPeriods } from '../../../../hooks/useReportingPeriods';

export const EnrollmentFundingForm: React.FC<EditFormProps> = ({
  child,
  onSuccess,
  reportingPeriods: inputReportingPeriods,
}) => {
  // Get site options for new enrollments
  const { sites } = useSites();

  // Get fundingSpaces for new fundings
  const { fundingSpaces } = useFundingSpaces();

  // Get reporting periods (needed to update enrollments with fundings)
  const { reportingPeriods } = useReportingPeriods(inputReportingPeriods);

  // Separate enrollments into current (no end date) and past
  // (with end date). Either may not exist
  if (!child) {
    return <></>;
  }

  const enrollments = child.enrollments || [];
  const currentEnrollment = enrollments.find((e) => !e.exit);
  const pastEnrollments = currentEnrollment
    ? enrollments.filter((e) => e.id !== currentEnrollment.id)
    : enrollments;

  return (
    <>
      <ChangeEnrollmentForm
        reportingPeriods={reportingPeriods}
        fundingSpaces={fundingSpaces}
        childName={child.firstName}
        currentEnrollment={currentEnrollment}
        childId={child.id}
        sites={sites}
        onSuccess={onSuccess}
      />
      {currentEnrollment && (
        <>
          <h2 className="margin-top-4 margin-bottom-2 font-heading-md">
            Current enrollment
          </h2>
          <EditEnrollmentForm
            key="edit-current-enrollment"
            isCurrent={true}
            enrollment={currentEnrollment}
            onSuccess={onSuccess}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingForm
              key={funding.id}
              isCurrent={true}
              reportingPeriods={reportingPeriods}
              fundingSpaces={fundingSpaces}
              funding={funding}
              enrollment={currentEnrollment}
              onSuccess={onSuccess}
            />
          ))}
          <ChangeFundingForm
            fundingSpaces={fundingSpaces}
            reportingPeriods={reportingPeriods}
            enrollment={currentEnrollment}
            onSuccess={onSuccess}
          />
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <h2 className="margin-top-4 margin-bottom-2 font-heading-md">
            Past enrollments
          </h2>
          {pastEnrollments.map((enrollment) => (
            <>
              <EditEnrollmentForm
                key={enrollment.id}
                enrollment={enrollment}
                onSuccess={onSuccess}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingForm
                  key={funding.id}
                  reportingPeriods={reportingPeriods}
                  fundingSpaces={fundingSpaces}
                  funding={funding}
                  enrollment={enrollment}
                  onSuccess={onSuccess}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
