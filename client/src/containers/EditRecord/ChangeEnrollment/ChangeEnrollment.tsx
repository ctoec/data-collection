import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal } from '@ctoec/component-library';
import {
  ChangeEnrollmentForm,
  ChangeEnrollmentFormProps,
} from '../EnrollmentFunding/ChangeEnrollment/Form';
import { nameFormatter } from '../../../utils/formatters';

export type ChangeEnrollmentProps = Omit<
  ChangeEnrollmentFormProps,
  'afterSaveSuccess' | 'afterSaveFailure' | 'topHeadingLevel'
>;

export const ChangeEnrollment: React.FC<ChangeEnrollmentProps> = ({
  child,
  currentEnrollment,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((o) => !o);
  const history = useHistory();

  return (
    <>
      <Button
        appearance="unstyled"
        onClick={toggleIsOpen}
        text="Change age group and/or site"
      />
      <Modal
        isOpen={isOpen}
        onModalClose={toggleIsOpen}
        header={<h2>Change enrollment</h2>}
        content={
          <ChangeEnrollmentForm
            afterSaveSuccess={() => {
              history.push({
                pathname: `edit-record/${child.id}#enrollment`,
                state: {
                  alerts: [
                    {
                      type: 'success',
                      heading: 'Record updated',
                      text: `Your changes to ${nameFormatter(
                        child
                      )}'s record have been saved.`,
                    },
                  ],
                },
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
