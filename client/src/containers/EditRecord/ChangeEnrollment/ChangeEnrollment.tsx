import React, { useState } from 'react';
import { Button, Modal } from '@ctoec/component-library';
import {
  ChangeEnrollmentForm,
  ChangeEnrollmentFormProps,
} from '../EnrollmentFunding/ChangeEnrollment/Form';

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
            afterSaveSuccess={}
            afterSaveFailure={}
            child={child}
            currentEnrollment={currentEnrollment}
            topHeadingLevel="h3"
          />
        }
      />
    </>
  );
};
