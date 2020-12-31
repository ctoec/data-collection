import React, { useContext, useState, Dispatch, SetStateAction } from 'react';
import {
  Tag,
  Form,
  Button,
  FormSubmitButton,
  Modal,
} from '@ctoec/component-library';
import { Enrollment, Child, FundingSource } from '../../../shared/models';
import { apiPost } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { useHistory } from 'react-router-dom';
import { EnrollmentEndDateField } from '../../../components/Forms/Enrollment/Fields';
import { ReportingPeriodField } from '../../../components/Forms/Enrollment/Funding/Fields';
import { ExitReasonField } from './Fields/ExitReason';
import { Withdraw } from '../../../shared/payloads';
import { useAlerts } from '../../../hooks/useAlerts';

type WithdrawProps = {
  child: Child;
  enrollment: Enrollment;
};
export const WithdrawRecord: React.FC<WithdrawProps> = ({
  child,
  enrollment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);

  const [isSaving, setIsSaving] = useState(false);
  const { alertElements, setAlerts } = useAlerts();
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
              text: `${child.firstName} has been withdrawn from your program`,
            },
          ],
        });
      })
      .catch((err) => {
        console.error(err);
        setAlerts([
          { type: 'error', text: `Unable to withdraw ${child.firstName}` },
        ]);
      })
      .finally(() => setIsSaving(false));
  };

  const activeFunding = (enrollment.fundings || []).find(
    (f) => !f.lastReportingPeriod
  );

  // If record has validation errors, onClick action is to display alert informing the user they cannot withdraw
  // Otherwise, onClick action is to display the withdraw modal
  const onClick =
    child.validationErrors && child.validationErrors.length
      ? () =>
        setAlerts([
          {
            type: 'error',
            heading:
              'Records cannot be withdrawn with missing or incorrect info',
            text: 'Add required info before withdrawing.',
          },
        ])
      : toggleIsOpen;

  return (
    <>
      <Button
        appearance="unstyled"
        text="Withdraw"
        onClick={onClick}
        className="margin-right-2"
      />
      <Modal
        isOpen={isOpen}
        toggleOpen={toggleIsOpen}
        header={
          <>
            {alertElements}
            <h2 className="margin-bottom-0">Withdraw {child.firstName}</h2>
          </>
        }
        content={
          <>
            <div className="grid-row">
              <div className="grid-col">
                <p>{enrollment.site?.siteName}</p>
                <p>Age: {enrollment.ageGroup}</p>
                <p>Enrollment date: {enrollment.entry?.format('MM/DD/YYYY')}</p>
              </div>
              <div className="grid-col">
                {activeFunding && (
                  <>
                    <p>
                      <Tag text={activeFunding.fundingSpace?.source || ''} />
                    </p>
                    <p>Contract space: {activeFunding.fundingSpace?.time}</p>
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
              <EnrollmentEndDateField<Withdraw> />
              <ExitReasonField />
              {!!activeFunding && (
                <ReportingPeriodField<Withdraw>
                  fundingSource={
                    activeFunding.fundingSpace?.source as FundingSource
                  } // Known to have value (modal only displayed when record has no missing info)
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
