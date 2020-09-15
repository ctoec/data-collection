import React, { useContext, useState } from 'react';
import {
  Tag,
  Form,
  Button,
  FormSubmitButton,
  Alert,
} from '@ctoec/component-library';
import { Enrollment, ReportingPeriod } from '../../../shared/models';
import { apiPost } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { useHistory } from 'react-router-dom';
import {
  EnrollmentEndDateField,
  ReportingPeriodField,
} from '../../../components/EditForms/EnrollmentFunding/Fields';
import { ExitReasonField } from './Fields/ExitReason';
import { Withdraw } from '../../../shared/payloads';

type WithdrawProps = {
  childName: string;
  enrollment: Enrollment;
  reportingPeriods: ReportingPeriod[];
  toggleOpen: () => void;
};
export const WithdrawRecord: React.FC<WithdrawProps> = ({
  childName,
  enrollment,
  reportingPeriods,
  toggleOpen,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>();
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  const onSubmit = (withdraw: Withdraw) => {
    setIsSaving(true);
    apiPost(`enrollments/${enrollment.id}/withdraw`, withdraw, {
      accessToken,
      jsonParse: false,
    })
      .then(() => {
        history.push('/roster', {
          alerts: [
            {
              type: 'success',
              heading: 'Record withdrawn',
              text: `${childName} has been withdrawn from your program`,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
        setError(`Unable to withdraw ${childName}`);
      })
      .finally(() => setIsSaving(false));
  };

  const activeFunding = (enrollment.fundings || []).find(
    (f) => !f.lastReportingPeriod
  );
  return (
    <div className="grid-container">
      {!!error && <Alert type="error" text={error} />}
      <h1>Withdraw {childName}</h1>
      <div className="grid-row">
        <div className="grid-col">
          <p>{enrollment.site.name}</p>
          <p>Age: {enrollment.ageGroup}</p>
          <p>Enrollment date: {enrollment.entry?.format('MM/DD/YYYY')}</p>
        </div>
        <div className="grid-col">
          {activeFunding && (
            <>
              <p>
                <Tag text={activeFunding.fundingSpace.source} />
              </p>
              <p>Contract space: {activeFunding.fundingSpace.time}</p>
              <p>
                First reporting period:{' '}
                {activeFunding.firstReportingPeriod.period.format('MMMM YYYY')}
              </p>
            </>
          )}
        </div>
      </div>
      <Form<Withdraw>
        onSubmit={onSubmit}
        data={{} as Withdraw}
        className="usa-form"
      >
        <EnrollmentEndDateField<Withdraw>
          accessor={(data) => data.at('exitDate')}
        />
        <ExitReasonField />
        {!!activeFunding && (
          <ReportingPeriodField<Withdraw>
            reportingPeriods={reportingPeriods.filter(
              (rp) => rp.type === activeFunding.fundingSpace.source
            )}
            isLast={true}
            accessor={(data) => data.at('funding').at('lastReportingPeriod')}
          />
        )}
        <Button appearance="outline" text="Cancel" onClick={toggleOpen} />
        <FormSubmitButton text={isSaving ? 'Withdrawing...' : 'Withdraw'} />
      </Form>
    </div>
  );
};
