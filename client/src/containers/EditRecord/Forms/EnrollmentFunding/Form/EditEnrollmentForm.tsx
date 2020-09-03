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
} from '@ctoec/component-library';
import { Enrollment } from '../../../../../shared/models';
import { EnrollmentEndDateField, EnrollmentStartDateField } from '../Fields';
import { apiPut } from '../../../../../utils/api';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';

type EditEnrollmentFormProps = {
  enrollment: Enrollment;
  isCurrent?: boolean;
  refetchChild: () => void;
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
  refetchChild,
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
        refetchChild();
      })
      .catch((err) => {
        setError('Unable to edit enrollment');
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card
      key={enrollment.id}
      appearance={isCurrent ? 'primary' : 'secondary'}
      forceClose={closeCard}
    >
      <div className="display-flex flex-justify">
        <div className="flex-1">
          <p>Site</p>
          <p className="text-bold">{enrollment.site.name}</p>
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
            {enrollment.entry
              ? enrollment.entry.format('MM/DD/YYYY')
              : InlineIcon({ icon: 'incomplete' })}{' '}
            -{' '}
            {enrollment.exit ? enrollment.exit.format('MM/DD/YYYY') : 'present'}
          </p>
        </div>
        <ExpandCard>
          <Button
            text={<TextWithIcon text="Edit" Icon={Pencil} />}
            appearance="unstyled"
          />
        </ExpandCard>
      </div>
      <CardExpansion>
        {error && <Alert type="error" text={error} />}
        <Form<Enrollment>
          id={`edit-enrollment-${enrollment.id}`}
          className="usa-form"
          data={enrollment}
          onSubmit={onSubmit}
        >
          <h3 className="font-heading-md margin-bottom-0">Start date</h3>
          <EnrollmentStartDateField<Enrollment>
            accessor={(data) => data.at('entry')}
          />
          {enrollment.exit && (
            <>
              <h3 className="font-heading-md margin-bottom-0">End date</h3>
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
        </Form>
      </CardExpansion>
    </Card>
  );
};
