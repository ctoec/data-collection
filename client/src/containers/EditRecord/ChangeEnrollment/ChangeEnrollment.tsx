import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal, TextWithIcon } from '@ctoec/component-library';
import {
  ChangeEnrollmentForm,
  ChangeEnrollmentFormProps,
} from '../EnrollmentFunding/ChangeEnrollment/Form';
import { nameFormatter } from '../../../utils/formatters';
import { ReactComponent as ChangeIcon } from '../../../images/change.svg';

export type ChangeEnrollmentProps = Omit<
  ChangeEnrollmentFormProps,
  'afterSaveFailure' | 'topHeadingLevel'
>;

export const ChangeEnrollment: React.FC<ChangeEnrollmentProps> = ({
  child,
  currentEnrollment,
  afterSaveSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);
  const history = useHistory();

  return (
    <>
      <Button
        appearance="unstyled"
        onClick={toggleIsOpen}
        text={
          <TextWithIcon text="Change age group and/or site" Icon={ChangeIcon} />
        }
        className="margin-right-2"
      />
      <Modal
        isOpen={isOpen}
        onModalClose={toggleIsOpen}
        header={<h2>Change enrollment</h2>}
        content={
          <ChangeEnrollmentForm
            afterSaveSuccess={() => {
              afterSaveSuccess();
              toggleIsOpen();
              history.push(`/edit-record/${child.id}#enrollment`, {
                alerts: [
                  {
                    type: 'success',
                    heading: 'Record updated',
                    text: `Your changes to ${nameFormatter(
                      child
                    )}'s record have been saved.`,
                  },
                ],
              });
            }}
            afterSaveFailure={(err) => {
              console.error(err);
            }}
            child={child}
            currentEnrollment={currentEnrollment}
            topHeadingLevel="h3"
          />
        }
      />
    </>
  );
};
