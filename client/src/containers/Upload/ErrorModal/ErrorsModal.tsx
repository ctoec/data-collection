import { Modal, Table } from '@ctoec/component-library';
import React from 'react';
import { Button } from '@ctoec/component-library';
import { ErrorObjectForTable } from './ErrorObjectForTable';
import { tableColumns } from './TableColumns';

type ErrorModalProps = {
  isOpen: boolean;
  toggleIsOpen: () => void;
  clearFile: () => void;
  errorDict: ErrorObjectForTable[];
  nextFunc: () => void;
};

/**
 * Modal that lets users know whether a Batch Uploaded sheet contains
 * any data errors. If so, it shows a count of how many errors occur
 * across each field of uploaded data.
 * @param param0
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  toggleIsOpen,
  clearFile,
  errorDict,
  nextFunc,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleOpen={toggleIsOpen}
      header={<h2> Your upload has missing or incorrect data </h2>}
      showHeaderBorder
      content={
        <div>
          <p>These errors need to be resolved before submitting to OEC.</p>
          <p>
            You can correct records by uploading a corrected file or editing
            records in your ECE Reporter roster.
          </p>

          <Table<ErrorObjectForTable>
            className="margin-bottom-4"
            id="errors-in-sheet-modal-table"
            data={errorDict}
            rowKey={(row) => row.property}
            columns={tableColumns()}
          />

          <div className="margin-top-2">
            <Button
              appearance="outline"
              text="Cancel upload"
              onClick={() => {
                clearFile();
                toggleIsOpen();
              }}
            />
            <Button
              text="Upload and correct in roster"
              onClick={() => {
                nextFunc();
              }}
            />
          </div>
        </div>
      }
    />
  );
};
