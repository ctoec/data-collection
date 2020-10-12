import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  InlineIcon,
  ExpandCard,
  Button,
  TextWithIcon,
  Pencil,
  CardExpansion,
  Form,
  FormSubmitButton,
  Alert,
  TrashCan,
} from '@ctoec/component-library';
import { Enrollment } from '../../../../shared/models';
import {
  CareModelField,
  EnrollmentEndDateField,
  EnrollmentStartDateField,
  AgeGroupField,
} from '../Fields';
import { apiPut, apiDelete } from '../../../../utils/api';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';

type EditEnrollmentFormProps = {
  enrollment: Enrollment;
  isCurrent?: boolean;
  afterDataSave: () => void;
};

/**
 * Component for displaying and editing an existing Enrollment.
 * Does not enable ageGroup to be updated, as this invalidates
 * all funding information, and should instead be handled by deleting
 * and creating a new Enrollment object.
 */
export const EditEnrollmentForm: React.FC<EditEnrollmentFormProps> = ({
  enrollment,
  isCurrent = false,
  afterDataSave,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // to make form re-openable
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  const onSubmit = (updatedEnrollment: Enrollment) => {
    setLoading(true);
    apiPut(`enrollments/${enrollment.id}`, updatedEnrollment, {
      accessToken,
    })
      .then(() => {
        setError(undefined);
        setCloseCard(true);
        afterDataSave();
      })
      .catch((err) => {
        setError('Unable to edit enrollment');
      })
      .finally(() => setLoading(false));
  };

  function deleteEnrollment() {
    apiDelete(`enrollments/${enrollment.id}`, {
      accessToken,
    })
      .then(() => {
        afterDataSave();
      })
      .catch((err) => {
        console.error('Unable to delete enrollment', err);
      });
  }

  return (
    <Card
      key={enrollment.id}
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
        <Form<Enrollment>
          id={`edit-enrollment-${enrollment.id}`}
          className="usa-form"
          data={enrollment}
          onSubmit={onSubmit}
        >
          {!enrollment.ageGroup && (
            <AgeGroupField<Enrollment>
              accessor={(data) => data.at('ageGroup')}
            />
          )}
          <CareModelField<Enrollment> accessor={(data) => data.at('model')} />
          <EnrollmentStartDateField<Enrollment>
            accessor={(data) => data.at('entry')}
          />
          {enrollment.exit && (
            <>
              <EnrollmentEndDateField<Enrollment>
                accessor={(data) => data.at('exit')}
              />
            </>
          )}

          <ExpandCard>
            <Button text="Cancel" appearance="outline" />
          </ExpandCard>
          <FormSubmitButton
            text={loading ? 'Saving...' : 'Save'}
            disabled={loading}
          />
          <p className="text-italic">
            Add a new enrollment if you're looking to change site and/or age
            group.
          </p>
        </Form>
      </CardExpansion>
    </Card>
  );
};
