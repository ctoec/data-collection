import React from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment, Child } from '../../../shared/models';
import { AlertProps, Alert } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { SECTION_KEYS } from '../../../components/Forms';

export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
  setAlerts,
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

  // TODO: remove this banner alert error, and replace with funding card with
  // missing info icons - https://github.com/ctoec/data-collection/pull/795#issuecomment-729150524
  const missingFundedEnrollmentError = getMissingFundedEnrollmentError(child);
  if (missingFundedEnrollmentError) {
    setAlerts((alerts) => {
      if (
        !alerts.find(
          (alert) => alert.heading === missingFundedEnrollmentError.heading
        )
      ) {
        return [...alerts, missingFundedEnrollmentError];
      }
      return alerts;
    });
  }

  const commonProps = {
    afterSaveSuccess,
    child,
    setAlerts,
  };

  return (
    <>
      <h2>Enrollment and funding</h2>
      <ChangeEnrollmentCard
        {...commonProps}
        currentEnrollment={currentEnrollment}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
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
          />
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <h3>Past enrollments</h3>
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

const getMissingFundedEnrollmentError: (_: Child) => AlertProps | undefined = (
  child: Child
) => {
  const missingFundingError = child.validationErrors?.find(
    (err) =>
      err.property === 'enrollments' &&
      err.constraints &&
      err.constraints['fundedEnrollment']
  );

  if (missingFundingError) {
    return {
      type: 'error',
      heading: 'This record is missing funding information',
      text: (
        <>
          Records must have at least one current or past funded enrollment to be
          submitted to OEC. Add funding info in the{' '}
          <Link to={`/edit-record/${child.id}#${SECTION_KEYS.ENROLLMENT}`}>
            enrollment and funding section
          </Link>
        </>
      ),
    };
  }
};
