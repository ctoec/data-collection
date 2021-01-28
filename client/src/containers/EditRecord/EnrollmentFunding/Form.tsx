import React from 'react';
import { RecordFormProps } from '../../../components/Forms/types';
import { EditFundingCard } from './EditFundingCard';
import { ChangeEnrollmentCard } from './ChangeEnrollment/Card';
import { ChangeFundingCard } from './ChangeFunding/Card';
import { EditEnrollmentCard } from './EditEnrollmentCard';
import { CareModel, Enrollment, Funding } from '../../../shared/models';
import { getNextHeadingLevel, Heading } from '../../../components/Heading';
import { InlineIcon } from '@ctoec/component-library';

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
    (e) => e.fundings !== undefined && e.fundings.length > 0
  );

  // We create enrollments in the backend even if there's no data
  // (so that we can check validation errors), so this always has
  // positive length; need to check that the det has null fields
  const noRecordedEnrollments =
    enrollments.length === 1 &&
    enrollments[0].site === null &&
    enrollments[0].model === CareModel.Unknown &&
    enrollments[0].ageGroup === undefined &&
    enrollments[0].entry === undefined;
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

  /**
   * Simple way to check if a funding was created by the backend as
   * a placeholder for the card or actually contains real info to
   * display
   */
  const fundingHasNoInformation = (funding: Funding | undefined) => {
    if (!funding) return true;
    return (
      !funding.fundingSpace &&
      !funding.firstReportingPeriod &&
      !funding.lastReportingPeriod
    );
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
      {!allEnrollmentsFunded && (
        <p className="usa-error-message">
          <InlineIcon icon="attentionNeeded" /> All enrollments must be
          associated with at least one funding.
        </p>
      )}
      {!noRecordedEnrollments && (
        <ChangeEnrollmentCard
          {...commonProps}
          topHeadingLevel={getNextHeadingLevel(topHeadingLevel)}
          currentEnrollment={currentEnrollment}
        />
      )}
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
