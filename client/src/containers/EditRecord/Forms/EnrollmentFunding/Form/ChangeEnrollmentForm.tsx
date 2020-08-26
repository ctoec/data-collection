import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  Card,
  ExpandCard,
  Button,
  CardExpansion,
  Form,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { Enrollment, Site } from '../../../../../shared/models';
import { apiPost } from '../../../../../utils/api';
import { SiteField, AgeGroupField, EnrollmentStartDateField } from '../Fields';

type ChangeEnrollmentFormProps = {
  childName: string;
  childId: string;
  sites: Site[];
  refetchChild: () => void;
};

export const ChangeEnrollmentForm: React.FC<ChangeEnrollmentFormProps> = ({
  childName,
  childId,
  sites,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [closeCard, setCloseCard] = useState(false);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Explicitly don't want `closeCard` as a dep, as this
  // needs to be triggered on render caused by child refetch
  // (not only when closeCard changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (closeCard) setCloseCard(false);
  });

  const onSubmit = (changeEnrollment: ChangeEnrollment) => {
    setLoading(true);
    apiPost(`children/${childId}/change-enrollment`, changeEnrollment, {
      accessToken,
      jsonParse: false,
    })
      .then(() => {
        setError(undefined);
        setCloseCard(true);
        refetchChild();
      })
      .catch((err) => {
        console.log(err);
        setError(
          'Unable to change enrollment. Make sure all required information is provided'
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Card forceClose={closeCard}>
      <div className="display-flex flex-justify">
        <h2 className="header-normal font-heading-lg">
          Has {childName}'s age group and/or site changed?
        </h2>
        <ExpandCard>
          <Button text="Change enrollment" appearance="outline" />
        </ExpandCard>
      </div>
      <CardExpansion>
        <h3 className="margin-top-2 margin-bottom-2 font-heading-lg">
          New enrollment
        </h3>
        {error && <Alert type="error" text={error} />}
        <Form<ChangeEnrollment>
          id="change-enrollment-form"
          className="usa-form"
          data={{ newEnrollment: {} as Enrollment }}
          onSubmit={onSubmit}
        >
          <h4 className="font-heading-md margin-bottom-0">Site</h4>
          <SiteField sites={sites} isChangeEnrollment={true} />
          <h4 className="font-heading-md margin-bottom-0">Start date</h4>
          <EnrollmentStartDateField isChangeEnrollment={true} />
          <h4 className="font-heading-md margin-bottom-0">Age group</h4>
          <AgeGroupField isChangeEnrollment={true} />

          <ExpandCard>
            <Button text="Cancel" appearance="outline" />
          </ExpandCard>
          <FormSubmitButton
            text={loading ? 'Chaging enrollment...' : 'Change enrollment'}
            disabled={loading}
          />
        </Form>
      </CardExpansion>
    </Card>
  );
};
