import { Button, InlineIcon, Table } from '@ctoec/component-library';
import React from 'react';
import { EnrollmentColumnError } from '../../shared/payloads';
import { misingInfoTableColumns } from './missingInfoTableColumns';
import { StepContentProps } from './UploadWizard';

export const ReviewMissingInfo: React.FC<StepContentProps> = ({
  setCurrentStepIndex,
  enrollmentReportCheck,
  setFile,
}) => {
  return (
    <div>
      {enrollmentReportCheck?.columnErrors?.length ? (
        <div>
          <div className="display-flex flex-row">
            <InlineIcon className="missing-info-icon" icon="incomplete" />
            <p className="margin-top-0 margin-left-1">
              The uploaded file had missing information OEC requires.
              <br />
              To make updates, go back to choose a resolved file or continue
              with this upload and make edits in the roster.
            </p>
          </div>
          <Table<EnrollmentColumnError>
            className="margin-bottom-4 missing-info-table"
            id="errors-in-sheet-modal-table"
            data={enrollmentReportCheck.columnErrors}
            rowKey={(row) => row.column}
            columns={misingInfoTableColumns()}
          />
        </div>
      ) : (
        <div className="display-flex flex-row">
          <InlineIcon className="missing-info-icon" icon="complete" />
          <p className="margin-top-0 margin-left-1">
            Your file has no missing information required for OEC reporting! Go
            to the next step to review changes and upload to your roster.
          </p>
        </div>
      )}
      <div className="margin-top-2">
        <Button
          appearance="outline"
          text="Cancel upload"
          onClick={() => {
            setFile(undefined);
            setCurrentStepIndex(0);
          }}
        />
        <Button
          text="Next"
          onClick={() =>
            setCurrentStepIndex((currentStepIdx) => currentStepIdx + 1)
          }
        />
      </div>
    </div>
  );
};
