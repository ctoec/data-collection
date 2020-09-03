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
import {
  Enrollment,
  Site,
  ReportingPeriod,
  FundingSpace,
} from '../../../../../shared/models';
import { apiPost } from '../../../../../utils/api';
import {
  SiteField,
  AgeGroupField,
  EnrollmentStartDateField,
  EnrollmentEndDateField,
  ReportingPeriodField,
  FundingField,
} from '../Fields';

type ChangeEnrollmentFormProps = {
  childName: string;
  childId: string;
  currentEnrollment?: Enrollment;
  reportingPeriods: ReportingPeriod[];
  fundingSpaces: FundingSpace[];
  sites: Site[];
  refetchChild: () => void;
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
  reportingPeriods,
  fundingSpaces,
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

  const activeFunding = (currentEnrollment?.fundings || []).find(
    (f) => !f.lastReportingPeriod
  );
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
          <h4>New enrollment</h4>
          <h4 className="font-heading-md margin-bottom-0">Site</h4>
          <SiteField<ChangeEnrollment>
            sites={sites}
            accessor={(data) => data.at('newEnrollment').at('site')}
          />
          <h4 className="font-heading-md margin-bottom-0">Start date</h4>
          <EnrollmentStartDateField<ChangeEnrollment>
            accessor={(data) => data.at('newEnrollment').at('entry')}
          />
          <h4 className="font-heading-md margin-bottom-0">Age group</h4>
          <AgeGroupField<ChangeEnrollment>
            accessor={(data) => data.at('newEnrollment').at('ageGroup')}
          />

          <FundingField<ChangeEnrollment>
            fundingAccessor={(data) =>
              data.at('newEnrollment').at('fundings').at(0)
            }
            getEnrollment={(data) => data.at('newEnrollment').value}
            fundingSpaces={fundingSpaces}
            reportingPeriods={reportingPeriods}
          />

          {!!currentEnrollment && (
            <>
              <h4>Previous enrollment</h4>
              <h4 className="font-heading-md margin-bottom-0">End date</h4>
              <EnrollmentEndDateField<ChangeEnrollment>
                accessor={(data) => data.at('oldEnrollment').at('exitDate')}
                optional={true}
              />
              {activeFunding && (
                <ReportingPeriodField<ChangeEnrollment>
                  accessor={(data) =>
                    data
                      .at('oldEnrollment')
                      .at('funding')
                      .at('lastReportingPeriod')
                  }
                  reportingPeriods={reportingPeriods.filter(
                    (rp) => rp.type === activeFunding.fundingSpace?.source
                  )}
                  isLast={true}
                  optional={true}
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
