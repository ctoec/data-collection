import React from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { Enrollment } from '../../../shared/models';
import { getNextHeadingLevel, Heading } from '../../../components/Heading';
import { InlineIcon } from '@ctoec/component-library';
import { fundingHasNoInformation } from '../../../utils/fundingHasNoInformation';
import { enrollmentHasNoInformation } from '../../../utils/enrollmentHasNoInformation';

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
  const allEnrollmentsFunded = enrollments.every(
    (e) =>
      e.fundings !== undefined &&
      e.fundings.length > 0 &&
      e.fundings.some((f) => !fundingHasNoInformation(f))
  );

  // Three cases to check:
  // 1. Came from create flow before reaching enrollment section
  //  (!enrollments)
  // 2. Came from create flow after reaching enrollment section
  // but before saving (length 0)
  // 3. Parsed a row from an uploaded sheet that has no info
  // (will be length 1 b/c we always have site info to create)
  const noRecordedEnrollments =
    !enrollments ||
    enrollments.length === 0 ||
    (enrollments.length === 1 && enrollmentHasNoInformation(enrollments[0]));

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
      {noRecordedEnrollments && (
        <p className="usa-error-message">
          <InlineIcon icon="attentionNeeded" /> At least one funded enrollment
          is required for each child record.
        </p>
      )}
      {
        // Only show the funding alert if we have an enrollment
        !noRecordedEnrollments && !allEnrollmentsFunded && (
          <p className="usa-error-message">
            <InlineIcon icon="attentionNeeded" /> All enrollments must be
            associated with at least one funding.
          </p>
        )
      }
      <ChangeEnrollmentCard
        {...commonProps}
        topHeadingLevel={getNextHeadingLevel(topHeadingLevel)}
        currentEnrollment={currentEnrollment}
        noRecordedEnrollments={noRecordedEnrollments}
      />
      {currentEnrollment && (
        <>
          {!noRecordedEnrollments && (
            <Heading level={getNextHeadingLevel(topHeadingLevel)}>
              Current enrollment
            </Heading>
          )}
          <EditEnrollmentCard
            {...commonProps}
            key="edit-current-enrollment"
            isCurrent={true}
            enrollmentId={currentEnrollment.id}
            topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
            noRecordedEnrollments={noRecordedEnrollments}
          />
          {currentEnrollment.fundings?.map(
            (funding) =>
              !noRecordedEnrollments && (
                <EditFundingCard
                  {...commonProps}
                  key={funding.id}
                  isCurrent={true}
                  fundingId={funding.id}
                  enrollmentId={currentEnrollment.id}
                  topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
                />
              )
          )}
          {!noRecordedEnrollments &&
            !currentEnrollment.fundings?.some((f) =>
              fundingHasNoInformation(f)
            ) && (
              <ChangeFundingCard
                {...commonProps}
                enrollment={currentEnrollment}
                orgId={child.organization.id}
                // This heading should be nested under current enrollment
                topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
              />
            )}
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
                topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingCard
                  {...commonProps}
                  key={funding.id}
                  fundingId={funding.id}
                  enrollmentId={enrollment.id}
                  topHeadingLevel={getNextHeadingLevel(topHeadingLevel, 2)}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
