import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  Card,
  ExpandCard,
  Button,
  CardExpansion,
  Form,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { Enrollment, Site } from '../../../../shared/models';
import { apiPost } from '../../../../utils/api';
import {
  SiteField,
  AgeGroupField,
  EnrollmentStartDateField,
  ReportingPeriodField,
  NewFundingField,
  CareModelField,
} from '../Fields';

type ChangeEnrollmentFormProps = {
  childName: string;
  childId: string;
  currentEnrollment?: Enrollment;
  sites: Site[];
  afterDataSave: () => void;
};

/**
 * Component for gathering user input to change child's Enrollment.
 * Uses a ChangeEnrollment data object to enable the user to provide
 * enrollment end date and funding last reporting period for previously current data.
 */
export const ChangeEnrollmentForm: React.FC<ChangeEnrollmentFormProps> = ({
  childName,
  childId,
  currentEnrollment,
  sites,
  afterDataSave,
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
        afterDataSave();
      })
      .catch((err) => {
        console.log(err);
        setError(
          'Unable to change enrollment. Make sure all required information is provided'
        );
      })
      .finally(() => setLoading(false));
  };

  const activeFunding = (currentEnrollment?.fundings || []).find(
    (f) => !f.lastReportingPeriod
  );
  return (
    <Card forceClose={closeCard}>
      <div className="display-flex flex-justify flex-row flex-align-center">
        {!currentEnrollment ? (
          <div className="usa-prose-body">
            {childName} has no active enrollments
          </div>
        ) : (
          <div className="usa-prose-body">
            Has {childName}'s age group and/or site changed?
          </div>
        )}
        <ExpandCard>
          <Button text="Change enrollment" appearance="outline" />
        </ExpandCard>
      </div>
      <CardExpansion>
        <h3 className="margin-top-2 margin-bottom-2">New enrollment</h3>
        {error && <Alert type="error" text={error} />}
        <Form<ChangeEnrollment>
          id="change-enrollment-form"
          className="usa-form"
          data={{ newEnrollment: {} as Enrollment }}
          onSubmit={onSubmit}
        >
          <SiteField<ChangeEnrollment>
            sites={sites}
            accessor={(data) => data.at('newEnrollment').at('site')}
          />
          <EnrollmentStartDateField<ChangeEnrollment>
            accessor={(data) => data.at('newEnrollment').at('entry')}
          />
          <CareModelField<ChangeEnrollment>
            accessor={(data) => data.at('newEnrollment').at('model')}
          />
          <AgeGroupField<ChangeEnrollment>
            accessor={(data) => data.at('newEnrollment').at('ageGroup')}
          />
          <NewFundingField<ChangeEnrollment>
            fundingAccessor={(data) =>
              data.at('newEnrollment').at('fundings').at(0)
            }
            getEnrollment={(data) => data.at('newEnrollment').value}
          />

          {!!currentEnrollment && (
            <>
              <h3>Previous enrollment</h3>
              {activeFunding && (
                <ReportingPeriodField<ChangeEnrollment>
                  accessor={(data) =>
                    data
                      .at('oldEnrollment')
                      .at('funding')
                      .at('lastReportingPeriod')
                  }
                  fundingSource={activeFunding.fundingSpace?.source}
                  isLast={true}
                  optional={true}
                  label={`Last reporting period for current ${activeFunding.fundingSpace?.source} - ${activeFunding.fundingSpace?.time} funding`}
                />
              )}
            </>
          )}

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
