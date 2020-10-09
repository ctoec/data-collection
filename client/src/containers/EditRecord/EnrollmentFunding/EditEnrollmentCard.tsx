import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  InlineIcon,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  CardExpansion,
  Alert,
  TrashCan,
} from '@ctoec/component-library';
import { Enrollment, Child } from '../../shared/models';
import { apiPut, apiDelete } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { EnrollmentForm } from '../../../components/Forms/Enrollment/Form';

type EditEnrollmentCardProps = {
  child: Child;
  enrollmentId: number;
  isCurrent?: boolean;
  afterSaveSuccess: () => void;
};

/**
 * Component for displaying and editing an existing Enrollment.
 * Does not enable ageGroup to be updated, as this invalidates
 * all funding information, and should instead be handled by deleting
 * and creating a new Enrollment object.
 */
export const EditEnrollmentCard: React.FC<EditEnrollmentCardProps> = ({
  child,
  enrollmentId,
  isCurrent = false,
  afterSaveSuccess,
}) => {
  const enrollment = child.enrollments?.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    throw new Error('Edit enrollment rendered without enrollment');
  }

  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [error, setError] = useState<string>();

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make form re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  function deleteEnrollment() {
    apiDelete(`enrollments/${enrollmentId}`, {
      accessToken,
    })
      .then(() => {
        afterSaveSuccess();
      })
      .catch((err) => {
        console.error('Unable to delete enrollment', err);
      });
  }

  const saveData = async (updatedData: Enrollment) =>
    apiPut(`enrollments/${enrollmentId}`, updatedData, {
      accessToken,
    });

  return (
    <Card
      key={enrollmentId}
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p>Site</p>
          <p className="text-bold">{enrollment.site.siteName}</p>
        </div>
        <div className="flex-1">
          <p>Age group</p>
          <p className="text-bold">
            {enrollment.ageGroup || InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-2">
          <p>Enrollment dates</p>
          <p className="text-bold">
            {enrollment.entry && enrollment.entry.isValid()
              ? enrollment.entry.format('MM/DD/YYYY')
              : InlineIcon({ icon: 'incomplete' })}{' '}
            -{' '}
            {enrollment.exit ? enrollment.exit.format('MM/DD/YYYY') : 'present'}
          </p>
        </div>
        <div className="display-flex align-center flex-space-between">
          <div className="display-flex align-center margin-right-2">
            <ExpandCard>
              <Button
                text={<TextWithIcon text="Edit" Icon={Pencil} />}
                appearance="unstyled"
              />
            </ExpandCard>
          </div>
          <div className="display-flex align-center margin-right-2">
            <Button
              text={<TextWithIcon text="Delete" Icon={TrashCan} />}
              appearance="unstyled"
              onClick={deleteEnrollment}
            />
          </div>
        </div>
      </div>
      <CardExpansion>
        {error && <Alert type="error" text={error} />}
        <EnrollmentForm
          id={`edit-enrollment-${enrollment.id}`}
          child={child}
          enrollmentId={enrollment.id}
          afterSaveSuccess={() => {
            setError(undefined);
            setCloseCard(true);
            afterSaveSuccess();
          }}
          setAlerts={() => {}}
          submitButtonText="Save"
          CancelButton={
            <ExpandCard>
              <Button text="Cancel" appearance="outline" />
            </ExpandCard>
          }
          showField={(enrollment, fields) => {
            const [field] = fields;
            if (field === 'agegroup') return false;
            if (field === 'fundings') return false;
            if (field === 'site' && (enrollment as Enrollment).site)
              return false;
            return true;
          }}
        />
        <p className="text-italic">
          Add a new enrollment if you're looking to change site and/or age
          group.
        </p>
      </CardExpansion>
    </Card>
  );
};
