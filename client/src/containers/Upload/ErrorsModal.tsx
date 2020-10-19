import { Modal, Table } from '@ctoec/component-library';
import React, { Dispatch, SetStateAction } from 'react';
import { Button } from '@ctoec/component-library';
import { ErrorObjectForTable } from './Upload';
import { tableColumns } from './TableColumns';

type ErrorsModalProps = {
  isOpen: boolean;
  toggleIsOpen: () => void;
  clearFile: () => void;
  errorDict: ErrorObjectForTable[];
  setPostUpload: Dispatch<SetStateAction<boolean>>;
};

export const ErrorsModal: React.FC<ErrorsModalProps> = ({
  isOpen,
  toggleIsOpen,
  clearFile,
  errorDict,
  setPostUpload,
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
              text="Upload and replace in roster"
              onClick={() => {
                setPostUpload(true);
                toggleIsOpen();
              }}
            />
          </div>
        </div>
      }
    />
  );
};
