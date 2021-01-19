import { Button, Modal } from '@ctoec/component-library';
import React from 'react';

type DataCompleteModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export const DataCompleteModal: React.FC<DataCompleteModalProps> = ({
  isOpen,
  closeModal,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onModalClose={closeModal}
      onXClick={closeModal}
      header={<h2>We've let OEC know your data is complete!</h2>}
      content={
        <div>
          <p>
            Going forward, update your roster with new enrollments or
            withdrawals, as well as age group, funding, and site changes.
          </p>
          <p>
            We're working on a feature to allow updating from excel files. Until
            then, you can make changes directly in your ECE Reporter roster.
          </p>
          <h3>How was this experience?</h3>
          <div>
            Take a quick survey to let us know how we can make this tool easier
            to use and more valuable to childcare providers like you.
          </div>
          <div className="margin-top-4">
            <Button
              text="Back to roster"
              appearance="outline"
              onClick={() => closeModal()}
            />
            <a
              className="usa-button usa-button--default"
              href="https://forms.monday.com/forms/f5bcf5d3d611b99f45ffb8187cd6c2b9?r=use1"
              target="_blank"
            >
              Give feedback
            </a>
          </div>
        </div>
      }
    ></Modal>
  );
};
