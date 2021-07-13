import React, { useContext, useState } from 'react';
import {
  Tag,
  Form,
  Button,
  FormSubmitButton,
  Modal,
  TextWithIcon,
} from '@ctoec/component-library';
import { stringify } from 'query-string';
import { useHistory } from 'react-router-dom';
import { Enrollment, Child } from '../../../shared/models';
import { apiPost, apiGet } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import {
  EnrollmentEndDateField,
  ExitReasonField,
} from '../../../components/Forms/Enrollment/Fields';
import { WithdrawRequest } from '../../../shared/payloads';
import { useAlerts } from '../../../hooks/useAlerts';
import { nameFormatter } from '../../../utils/formatters';
import RosterContext from '../../../contexts/RosterContext/RosterContext';
import { ReactComponent as WithdrawIcon } from '../../../images/withdraw.svg';
import { getCurrentFunding } from '../../../utils/models';
import { FundingDateField } from '../../../components/Forms/Enrollment/Funding/Fields';

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
  const [alertElements, setAlerts] = useAlerts();
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  const { query, updateChildRecords } = useContext(RosterContext);

  const onSubmit = (withdraw: WithdrawRequest) => {
    setIsSaving(true);
    apiPost(`enrollments/${enrollment.id}/withdraw`, withdraw, {
      accessToken,
      jsonParse: false,
    })
      .then(() => {
        apiGet(`children/${child.id}`, accessToken).then((updatedChild) => {
          updateChildRecords({ updatedChild });
          toggleIsOpen();
          history.push({
            pathname: '/roster',
            search: stringify(query),
            state: {
              alerts: [
                {
                  type: 'success',
                  heading: 'Record withdrawn',
                  text: `${nameFormatter(child, {
                    capitalize: true,
                  })} has been withdrawn from your program`,
                },
              ],
            },
          });
        });
      })
      .catch((err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: `Unable to withdraw ${nameFormatter(child, {
              firstOnly: true,
            })}`,
          },
        ]);
      })
      .finally(() => setIsSaving(false));
  };

  const activeFunding = getCurrentFunding({ enrollment });

  // If record has validation errors, onClick action is to display alert informing the user they cannot withdraw
  // Otherwise, onClick action is to display the withdraw modal
  // TODO: since alerts are done via a hook and not a context, this isn't working
  const onClick = child?.validationErrors?.length
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
        text={<TextWithIcon text="Withdraw" Icon={WithdrawIcon} />}
        onClick={onClick}
        className="margin-right-2"
      />
      <Modal
        isOpen={isOpen}
        onModalClose={toggleIsOpen}
        header={
          <>
            {alertElements}
            <h2 className="margin-bottom-0">
              Withdraw {nameFormatter(child, { firstOnly: true })}
            </h2>
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
                      Funding start date:{' '}
                      {activeFunding.startDate?.format('MMMM YYYY')}
                    </p>
                  </>
                )}
              </div>
            </div>
            <Form<WithdrawRequest>
              onSubmit={onSubmit}
              data={{} as WithdrawRequest}
              className="usa-form"
            >
              <ExitReasonField<WithdrawRequest> />
              <EnrollmentEndDateField<WithdrawRequest> />
              {!!activeFunding && (
                <FundingDateField<WithdrawRequest>
                  fundingAccessor={(data) => data.at('funding')}
                  fieldType="endDate"
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
