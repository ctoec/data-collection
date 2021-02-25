import {
  Button,
  InlineIcon,
  ProgressIndicator,
  ProgressIndicatorProps,
  Table,
} from '@ctoec/component-library';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import { EnrollmentColumnError } from '../../shared/payloads';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
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
  const h1Ref = getH1RefForTitle();
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

      <div className="grid-row display-block">
        <h1 ref={h1Ref} className="margin-bottom-0">
          Upload your enrollment data
        </h1>

        <ProgressIndicator
          currentIndex={props.currentIndex}
          steps={props.steps}
        ></ProgressIndicator>

        <h2 className="margin-bottom-0">
          <span className="usa-step-indicator__current-step">2</span>
          <span className="usa-step-indicator__total-steps"> of 3</span>Review
          missing info
        </h2>

        {missingInfo && missingInfo.length ? (
          <div>
            <InlineIcon icon="incomplete" />
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
            <InlineIcon icon="complete" />
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
        <Button
          text="Next"
          onClick={() => history.push('/preview', { file })}
        />
      </div>
    </div>
  );
};
