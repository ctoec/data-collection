import React, { useEffect } from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment } from '../../../shared/models';
import { useState } from 'react';

enum FormName {
  EditCurrentEnrollment = 'edit-current-enrollment',
  EditCurrentFunding = 'edit-current-enrollment',
  EditFunding = 'edit-funding',
  ChangeFunding = 'change-funding',
  EditPastEnrollment = 'edit-past-enrollment',
}

export const EnrollmentFundingForm: React.FC<RecordFormProps> = ({
  child,
  afterSaveSuccess,
}) => {
  const [activeCard, setActiveCard] = useState<string>();

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

  useEffect(() => {
    console.log('*********');
    console.log(activeCard);
  }, [activeCard]);

  return (
    <>
      <h2>Enrollment and funding</h2>
      <ChangeEnrollmentCard
        key="change-enrollment"
        child={child}
        currentEnrollment={currentEnrollment}
        afterSaveSuccess={afterSaveSuccess}
      />
      {currentEnrollment && (
        <>
          <h3>Current enrollment</h3>
          <EditEnrollmentCard
            key={FormName.EditCurrentEnrollment}
            expanded={activeCard === FormName.EditCurrentEnrollment}
            onExpansionChange={(isActive) =>
              isActive
                ? // ? console.log('active')
                  // : console.log('inactive')
                  setActiveCard(`${FormName.EditCurrentEnrollment}`)
                : setActiveCard(undefined)
            }
            isCurrent={true}
            child={child}
            enrollmentId={currentEnrollment.id}
            afterSaveSuccess={afterSaveSuccess}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingCard
              key={`${FormName.EditCurrentFunding}-${funding.id}`}
              onExpansionChange={(isActive) =>
                isActive
                  ? setActiveCard(`${FormName.EditFunding}-${funding.id}`)
                  : setActiveCard(undefined)
              }
              expanded={activeCard === `${FormName.EditFunding}-${funding.id}`}
              child={child}
              fundingId={funding.id}
              enrollmentId={currentEnrollment.id}
              afterSaveSuccess={afterSaveSuccess}
            />
          ))}
          <ChangeFundingCard
            key={FormName.ChangeFunding}
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
                key={`${FormName.EditPastEnrollment}-${enrollment.id}`}
                onExpansionChange={(isActive) =>
                  isActive
                    ? setActiveCard(
                        `${FormName.EditPastEnrollment}-${enrollment.id}`
                      )
                    : setActiveCard(undefined)
                }
                expanded={
                  activeCard ===
                  `${FormName.EditPastEnrollment}-${enrollment.id}`
                }
                child={child}
                enrollmentId={enrollment.id}
                afterSaveSuccess={afterSaveSuccess}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  key={`${FormName.EditFunding}-${funding.id}`}
                  onExpansionChange={(isActive) =>
                    isActive
                      ? setActiveCard(`${FormName.EditFunding}-${funding.id}`)
                      : setActiveCard(undefined)
                  }
                  expanded={
                    activeCard === `${FormName.EditFunding}-${funding.id}`
                  }
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
