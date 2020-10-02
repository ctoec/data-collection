import React from 'react';
import { ChangeEnrollmentForm } from './ChangeEnrollmentForm';
import { EditEnrollmentForm } from './EditEnrollmentForm';
import { EditFundingForm } from './EditFundingForm';
import { ChangeFundingForm } from './ChangeFundingForm';
import { EditFormProps } from '../../types';
import { useSites } from '../../../../hooks/useSites';
import { useFundingSpaces } from '../../../../hooks/useFundingSpaces';
import { useReportingPeriods } from '../../../../hooks/useReportingPeriods';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { Child, Enrollment } from '../../../../shared/models';

const enrollmentFields = ['site', 'ageGroup', 'entry', 'fundings'];
// TODO: check this after debugging enrollment-- can't save partially filled out form
export const doesEnrollmentFormHaveErrors = (child?: Child) =>
  child?.enrollments?.length
    ? !!getValidationStatusForFields(child.enrollments, enrollmentFields)
    : true;

// The fields we use to check to see if this form has errors or missing info
export const enrollmentFundingFields = {
  enrollments: [],
};

export const EnrollmentFundingForm: React.FC<EditFormProps> = ({
  child,
  afterDataSave,
  reportingPeriods: inputReportingPeriods,
}) => {
  if (!child) {
    return <></>;
  }

  const enrollments: Enrollment[] = child.enrollments || [];
  const currentEnrollment: Enrollment | undefined = enrollments.find(
    (e) => !e.exit
  );
  const pastEnrollments: Enrollment[] = currentEnrollment
    ? enrollments.filter((e) => e.id !== currentEnrollment.id)
    : enrollments;

  // Get site options for new enrollments, specific to the org the child currently belongs to
  const { sites } = useSites(child.organization?.id);

  // Get fundingSpaces for new fundings, specific to the org the child currently belongs to
  const { fundingSpaces } = useFundingSpaces(child.organization?.id);

  // Get reporting periods (needed to update enrollments with fundings)
  const { reportingPeriods } = useReportingPeriods(inputReportingPeriods);

  // Separate enrollments into current (no end date) and past
  // (with end date). Either may not exist
  return (
    <>
      <h2>Enrollment and funding</h2>
      <ChangeEnrollmentForm
        reportingPeriods={reportingPeriods}
        fundingSpaces={fundingSpaces}
        childName={child.firstName || ''}
        currentEnrollment={currentEnrollment}
        childId={child.id}
        sites={sites}
        afterDataSave={afterDataSave}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
          <EditEnrollmentForm
            key="edit-current-enrollment"
            isCurrent={true}
            enrollment={currentEnrollment}
            afterDataSave={afterDataSave}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingForm
              key={funding.id}
              isCurrent={true}
              reportingPeriods={reportingPeriods}
              fundingSpaces={fundingSpaces}
              funding={funding}
              enrollment={currentEnrollment}
              afterDataSave={afterDataSave}
            />
          ))}
          <ChangeFundingForm
            fundingSpaces={fundingSpaces}
            reportingPeriods={reportingPeriods}
            enrollment={currentEnrollment}
            afterDataSave={afterDataSave}
          />
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <h3>Past enrollments</h3>
          {pastEnrollments.map((enrollment) => (
            <>
              <EditEnrollmentForm
                key={enrollment.id}
                enrollment={enrollment}
                afterDataSave={afterDataSave}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingForm
                  key={funding.id}
                  reportingPeriods={reportingPeriods}
                  fundingSpaces={fundingSpaces}
                  funding={funding}
                  enrollment={enrollment}
                  afterDataSave={afterDataSave}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
