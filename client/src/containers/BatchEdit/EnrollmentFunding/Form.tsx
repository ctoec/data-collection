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
  topHeadingLevel,
}) => {
  if (!child?.enrollments?.length) {
    return (
      <EnrollmentForm
        child={child}
        afterSaveSuccess={afterSaveSuccess}
        setAlerts={setAlerts}
        topHeadingLevel={topHeadingLevel}
      />
    );
  }
  // will return true if enrollment has validation errors,
  // including if any fundings have validation errors
  const enrollmentsWithValidationErrors = child?.enrollments
    ?.filter(({ id }) => doesEnrollmentFormHaveErrors(child, id))
    ?.map((enrollment) => ({
      ...enrollment,
      fundings: enrollment.fundings?.filter((funding) =>
        doesFundingFormHaveErrors(child, enrollment.id, funding.id)
      ),
    }));

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
                  topHeadingLevel={topHeadingLevel}
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
                  topHeadingLevel={topHeadingLevel}
                />
              </>
            )}
          </>
        );
      })}
    </>
  );
};
