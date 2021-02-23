import { Button, Table } from '@ctoec/component-library';
import React, { useContext, useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import UserContext from '../../contexts/UserContext/UserContext';
import { ErrorObjectForTable } from './ErrorModal/ErrorObjectForTable';
import { tableColumns } from './ErrorModal/TableColumns';

export const ReviewMissingInfo: React.FC<any> = ({
  isOpen,
  closeModal,
  clearFile,
  errorDict,
  setQueryString,
}) => {
  const { user } = useContext(UserContext);

  return (
    <div className="grid-container">
      <BackButton location="/" />

      <div className="grid-row display-block">
        <h2 className="margin-bottom-0">Review missing info</h2>

        {errorDict && Object.keys(errorDict).length ? (
          <div>
            <p>
              The uploaded file had missing information OEC requires.
              <br />
              To make updates, go back to choose a resolved file or continue
              with this upload and make edits in the roster.
            </p>

            <Table<ErrorObjectForTable>
              className="margin-bottom-4"
              id="errors-in-sheet-modal-table"
              data={errorDict}
              rowKey={(row) => row.property}
              columns={tableColumns()}
            />
          </div>
        ) : (
          <div>
            <p>
              Your file has no missing information required for OEC reporting!
              Go to the next step to review changes and upload to your roster.
            </p>
          </div>
        )}
      </div>
      <div className="margin-top-2">
        <Button
          appearance="outline"
          text="Cancel upload"
          onClick={() => {
            clearFile();
            closeModal();
          }}
        />
        <Button text="Next" onClick={nextFunc} />
      </div>
    </div>
  );
};
