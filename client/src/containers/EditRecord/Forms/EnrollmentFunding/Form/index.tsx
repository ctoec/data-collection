import React, { useContext, useEffect, useState } from 'react';
import { Site, Enrollment } from '../../../../../shared/models';
import { apiGet } from '../../../../../utils/api';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import { ChangeEnrollmentForm } from './ChangeEnrollmentForm';
import { EditEnrollmentForm } from './EditEnrollmentForm';

type EnrollmentFundingFormProps = {
  enrollments: Enrollment[];
  childName: string;
  childId: string;
  refetchChild: () => void;
};
export const EnrollmentFundingForm: React.FC<EnrollmentFundingFormProps> = ({
  enrollments,
  childName,
  childId,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);

  const [sites, setSites] = useState<Site[]>([]);
  useEffect(() => {
    apiGet('sites', { accessToken }).then((_sites) => setSites(_sites));
  }, [accessToken]);

  const currentEnrollment = enrollments.find((e) => !e.exit);
  const pastEnrollments = currentEnrollment
    ? enrollments.filter((e) => e.id !== currentEnrollment.id)
    : enrollments;

  return (
    <>
      <ChangeEnrollmentForm
        childName={childName}
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
        </>
      )}
      {!!pastEnrollments.length && (
        <>
          <h2 className="margin-top-4 margin-bottom-2 font-heading-md">
            Past enrollments
          </h2>
          {pastEnrollments.map((enrollment) => (
            <EditEnrollmentForm
              key={enrollment.id}
              enrollment={enrollment}
              refetchChild={refetchChild}
            />
          ))}
        </>
      )}
    </>
  );
};
