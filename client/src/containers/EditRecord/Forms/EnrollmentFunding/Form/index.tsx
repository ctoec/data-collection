import React, { useContext, useEffect, useState } from 'react';
import {
  Site,
  Enrollment,
  FundingSpace,
  ReportingPeriod,
} from '../../../../../shared/models';
import { apiGet } from '../../../../../utils/api';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import { ChangeEnrollmentForm } from './ChangeEnrollmentForm';
import { EditEnrollmentForm } from './EditEnrollmentForm';
import { EditFundingForm } from './EditFundingForm';
import { ChangeFundingForm } from './ChangeFundingForm';

type EnrollmentFundingFormProps = {
  reportingPeriods: ReportingPeriod[];
  enrollments: Enrollment[];
  childName: string;
  childId: string;
  refetchChild: () => void;
};
export const EnrollmentFundingForm: React.FC<EnrollmentFundingFormProps> = ({
  reportingPeriods,
  enrollments,
  childName,
  childId,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);

  // Get site options for new enrollments
  const [sites, setSites] = useState<Site[]>([]);
  useEffect(() => {
    apiGet('sites', { accessToken }).then((_sites) => setSites(_sites));
  }, [accessToken]);

  // Get fundingSpaces for new fundings
  const [fundingSpaces, setFundingSpaces] = useState<FundingSpace[]>([]);
  useEffect(() => {
    apiGet('funding-spaces', { accessToken }).then((_fundingSpaces) =>
      setFundingSpaces(_fundingSpaces)
    );
  }, [accessToken]);

  // Separate enrollments into current (no end date) and past
  // (with end date). Either may not exist
  const currentEnrollment = enrollments.find((e) => !e.exit);
  const pastEnrollments = currentEnrollment
    ? enrollments.filter((e) => e.id !== currentEnrollment.id)
    : enrollments;

  return (
    <>
      <ChangeEnrollmentForm
        reportingPeriods={reportingPeriods}
        fundingSpaces={fundingSpaces}
        childName={childName}
        currentEnrollment={currentEnrollment}
        childId={childId}
        sites={sites}
        refetchChild={refetchChild}
      />
      {currentEnrollment && (
        <>
          <h2 className="margin-top-4 margin-bottom-2 font-heading-md">
            Current enrollment
          </h2>
          <EditEnrollmentForm
            isCurrent={true}
            enrollment={currentEnrollment}
            refetchChild={refetchChild}
          />
          {currentEnrollment.fundings?.map((funding) => (
            <EditFundingForm
              key={funding.id}
              isCurrent={true}
              reportingPeriods={reportingPeriods}
              fundingSpaces={fundingSpaces}
              funding={funding}
              enrollment={currentEnrollment}
              refetchChild={refetchChild}
            />
          ))}
          <ChangeFundingForm
            fundingSpaces={fundingSpaces}
            reportingPeriods={reportingPeriods}
            enrollment={currentEnrollment}
            refetchChild={refetchChild}
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
                refetchChild={refetchChild}
              />
              {enrollment.fundings?.map((funding) => (
                <EditFundingForm
                  key={funding.id}
                  reportingPeriods={reportingPeriods}
                  fundingSpaces={fundingSpaces}
                  funding={funding}
                  enrollment={enrollment}
                  refetchChild={refetchChild}
                />
              ))}
            </>
          ))}
        </>
      )}
    </>
  );
};
