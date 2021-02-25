import {
  Button,
  ProgressIndicator,
  ProgressIndicatorProps,
  Table,
} from '@ctoec/component-library';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { EnrollmentColumnError } from '../../shared/payloads';
import { misingInfoTableColumns } from './missingInfoTableColumns';

const props: ProgressIndicatorProps = {
  currentIndex: 1,
  steps: [
    {
      label: 'Choose file',
    },
    {
      label: 'Review Missing Info',
    },
    {
      label: 'Preview and upload',
    },
  ],
};

//////////////////////////////////////////////////////

export const ReviewMissingInfo: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation();

  //  If there's no state suplied, the user presumably tried to get here manually, which isn't allowed
  if (!state) {
    history.push('/upload');
  }

  const missingInfo: EnrollmentColumnError[] = (state as any)
    .enrollmentColumnErrors;
  const file = (state as any).file;

  return (
    <div className="grid-container">
      <BackButton location="/upload" />

      <ProgressIndicator
        currentIndex={props.currentIndex}
        steps={props.steps}
      ></ProgressIndicator>

      <div className="grid-row display-block">
        <h2 className="margin-bottom-0">Review missing info</h2>

        {missingInfo && missingInfo.length ? (
          <div>
            <p>
              The uploaded file had missing information OEC requires.
              <br />
              To make updates, go back to choose a resolved file or continue
              with this upload and make edits in the roster.
            </p>

            <Table<EnrollmentColumnError>
              className="margin-bottom-4"
              id="errors-in-sheet-modal-table"
              data={missingInfo}
              rowKey={(row) => row.column}
              columns={misingInfoTableColumns()}
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
            history.push(`/upload`);
          }}
        />
        {
          // TODO: Update in
          // https://app.zenhub.com/workspaces/ece-dev-board-5ff506028d35f30012e0e937/issues/ctoec/data-collection/239
        }
        <Button
          text="Next"
          onClick={() => history.push('/preview', { file })}
        />
      </div>
    </div>
  );
};
