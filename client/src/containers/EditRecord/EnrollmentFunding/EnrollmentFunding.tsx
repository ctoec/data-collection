import React from 'react';
import { Child, Enrollment } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../utils/getValidationStatus';
import { EditFormProps } from '../../../components/Forms/types';
import { useSites } from '../../../hooks/useSites';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';

const enrollmentFields = ['site', 'ageGroup', 'entry', 'fundings'];
// TODO: check this after debugging enrollment-- can't save partially filled out form
export const doesEnrollmentFormHaveErrors = (child?: Child) =>
  child?.enrollments?.length
    ? !!getValidationStatusForFields(child.enrollments, enrollmentFields)
    : true;

export const EnrollmentFundingForm: React.FC<EditFormProps> = ({
  child,
  afterSaveSuccess: afterDataSave,
}) => {
  // Get site options for new enrollments
  const { sites } = useSites(child?.organization?.id);

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
        afterDataSave={afterDataSave}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
          <EditEnrollmentCard
            key="edit-current-enrollment"
            isCurrent={true}
            child={child}
            enrollmentId={currentEnrollment.id}
            afterDataSave={afterDataSave}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingCard
              key={funding.id}
              isCurrent={true}
              child={child}
              fundingId={funding.id}
              enrollmentId={currentEnrollment.id}
              afterDataSave={afterDataSave}
            />
          ))}
          <ChangeFundingCard
            enrollment={currentEnrollment}
            orgId={child.organization.id}
            afterDataSave={afterDataSave}
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
                afterDataSave={afterDataSave}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  key={funding.id}
                  child={child}
                  fundingId={funding.id}
                  enrollmentId={enrollment.id}
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
