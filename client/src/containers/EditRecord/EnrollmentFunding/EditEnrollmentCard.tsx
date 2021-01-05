import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  CardExpansion,
  TrashCan,
  InlineIcon,
} from '@ctoec/component-library';
import { Enrollment, Child } from '../../../shared/models';
import { apiDelete } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { EnrollmentForm } from '../../../components/Forms/Enrollment/Form';
import { RecordFormProps } from '../../../components/Forms';
import { HeadingLevel } from '../../../components/Heading';

type EditEnrollmentCardProps = {
  child: Child;
  enrollmentId: number;
  afterSaveSuccess: () => void;
  isCurrent?: boolean;
  setAlerts: RecordFormProps['setAlerts'];
  topHeadingLevel: HeadingLevel;
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
  setAlerts,
  topHeadingLevel,
}) => {
  const enrollment = child.enrollments?.find((e) => e.id === enrollmentId);
  if (!enrollment) {
    throw new Error('Edit enrollment rendered without enrollment');
  }

  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);

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
      .then(afterSaveSuccess)
      .catch((err) => {
        console.error('Unable to delete enrollment', err);
        setAlerts([
          {
            type: 'error',
            text: err,
          },
        ]);
      });
  }

  return (
    <Card
      key={enrollmentId}
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p className="margin-bottom-0">Site</p>
          <p className="text-bold margin-top-0">
            {enrollment.site?.siteName || InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-1">
          <p className="margin-bottom-0">Model type</p>
          <p className="text-bold margin-top-0">
            {enrollment.model || InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-1">
          <p className="margin-bottom-0">Age group</p>
          <p className="text-bold margin-top-0">
            {enrollment.ageGroup || InlineIcon({ icon: 'incomplete' })}
          </p>
        </div>
        <div className="flex-2">
          <p className="margin-bottom-0">Enrollment dates</p>
          <p className="text-bold margin-top-0">
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
        <EnrollmentForm
          id={`edit-enrollment-${enrollment.id}`}
          child={child}
          enrollmentId={enrollment.id}
          afterSaveSuccess={() => {
            setCloseCard(true);
            afterSaveSuccess();
          }}
          topHeadingLevel={topHeadingLevel}
          setAlerts={setAlerts}
          AdditionalButton={
            <ExpandCard>
              <Button text="Cancel" appearance="outline" />
            </ExpandCard>
          }
          showFieldOrFieldset={(enrollment, fields) => {
            // Do not show "new funding" field
            if (fields.includes('fundings')) return false;
            // Do not allow user to edit ageGroup, unless ageGroup does not exist
            if (
              fields.includes('ageGroup') &&
              (enrollment as Enrollment).ageGroup
            )
              return false;
            // Do not enable user to edit site, unless site does not exist
            if (fields.includes('site') && (enrollment as Enrollment).site)
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
