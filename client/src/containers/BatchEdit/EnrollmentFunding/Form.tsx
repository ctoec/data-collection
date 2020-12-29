import React from 'react';
import {
  RecordFormProps,
  doesEnrollmentFormHaveErrors,
  doesFundingFormHaveErrors,
  FundingForm,
  EnrollmentForm,
} from '../../../components/Forms';

/**
 * Special Enrollment / Funding form for batch edit,
 * which chains individual edit forms for all enrollments and fundings
 * with missing or invalid information. As the user completes updating
 * each invdividual funding or enrollment form, they will disappear as
 * this component is re-rendered and the objects themselves no longer
 * have any missing info.
 */
export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
  showFieldOrFieldset,
}) => {
  if (!child?.enrollments?.length) {
    return (
      <EnrollmentForm
        child={child}
        afterSaveSuccess={afterSaveSuccess}
        setAlerts={setAlerts}
      />
    );
  }

  let enrollmentsWithValidationErrors = child?.enrollments?.map(
    (enrollment) => {
      // will return true if enrollment has validation errors,
      // including if any fundings have validation errors
      if (doesEnrollmentFormHaveErrors(child, enrollment.id)) {
        const fundingsWithValidationErrors = enrollment.fundings?.filter(
          (funding) =>
            doesFundingFormHaveErrors(child, enrollment.id, funding.id)
        );
        const enrollmentWithValidationErrors = { ...enrollment };
        enrollmentWithValidationErrors.fundings = fundingsWithValidationErrors;
        return enrollmentWithValidationErrors;
      }
    }
  );

  return (
    <>
      {enrollmentsWithValidationErrors?.map((enrollment) => {
        return (
          <>
            {/* If enrollment has site, then display siteName for context (if no site, then site field will be displayed) */}
            {enrollment?.site && (
              <div className="text-bold font-body-md">
                Site: {enrollment?.site.siteName}{' '}
              </div>
            )}
            {enrollment?.entry && (
              <div className="text-bold font-body-md">
                Enrollment dates: {enrollment?.entry.format('MM/D/YYYY')}
                {enrollment?.exit &&
                  ` - ${enrollment?.exit?.format('MM/D/YYYY')}`}
              </div>
            )}
            {enrollment?.fundings?.map((funding) => (
              <>
                {/* If funding has fundingSpace, then display funding source for context */}
                {funding.fundingSpace && (
                  <div className="text-bold font-body-md">
                    Funding source: {funding.fundingSpace.source}
                  </div>
                )}
                <FundingForm
                  id={`batch-edit-funding-${funding.id}`}
                  fundingId={funding.id}
                  enrollmentId={enrollment.id}
                  child={child}
                  afterSaveSuccess={afterSaveSuccess}
                  setAlerts={setAlerts}
                  showFieldOrFieldset={showFieldOrFieldset}
                />
              </>
            ))}
            {(!enrollment?.fundings?.length ||
              doesEnrollmentFormHaveErrors(child, enrollment?.id, {
                excludeFundings: true,
              })) && (
              <>
                <EnrollmentForm
                  id={`batch-edit-enrollment-${enrollment?.id}`}
                  enrollmentId={enrollment?.id}
                  child={child}
                  afterSaveSuccess={afterSaveSuccess}
                  setAlerts={setAlerts}
                  showFieldOrFieldset={showFieldOrFieldset}
                />
              </>
            )}
          </>
        );
      })}
    </>
  );
};
