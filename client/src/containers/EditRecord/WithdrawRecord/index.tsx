import React, { useContext, useState } from 'react';
import {
  Tag,
  Form,
  Button,
  FormSubmitButton,
  Alert,
  Modal,
} from '@ctoec/component-library';
import { Enrollment } from '../../../shared/models';
import { apiPost } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { useHistory } from 'react-router-dom';
import {
  EnrollmentEndDateField,
  ReportingPeriodField,
} from '../../../components/Forms/EnrollmentFunding/Fields';
import { ExitReasonField } from './Fields/ExitReason';
import { Withdraw } from '../../../shared/payloads';

type WithdrawProps = {
  childName: string | undefined;
  enrollment: Enrollment;
};
export const WithdrawRecord: React.FC<WithdrawProps> = ({
  childName,
  enrollment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);

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
        toggleIsOpen();
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
    <>
      <Button
        appearance="unstyled"
        text="Withdraw"
        onClick={() => toggleIsOpen()}
        className="margin-right-2"
      />
      <Modal
        isOpen={isOpen}
        toggleOpen={toggleIsOpen}
        header={
          <>
            {!!error && <Alert text={error} type="error" />}
            <h2 className="margin-bottom-0">Withdraw {childName}</h2>
          </>
        }
        content={
          <>
            <div className="grid-row">
              <div className="grid-col">
                <p>{enrollment.site.siteName}</p>
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
                      {activeFunding.firstReportingPeriod?.period.format(
                        'MMMM YYYY'
                      )}
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
                  fundingSource={activeFunding.fundingSpace.source}
                  isLast={true}
                  accessor={(data) =>
                    data.at('funding').at('lastReportingPeriod')
                  }
                />
              )}
              <Button
                appearance="outline"
                text="Cancel"
                onClick={toggleIsOpen}
              />
              <FormSubmitButton
                text={isSaving ? 'Withdrawing...' : 'Withdraw'}
              />
            </Form>
          </>
        }
      />
    </>
  );
};
