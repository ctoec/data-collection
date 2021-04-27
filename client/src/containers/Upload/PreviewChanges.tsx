import {
  Accordion,
  Button,
  Card,
  LoadingWrapper,
} from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { stringify } from 'query-string';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import RosterContext from '../../contexts/RosterContext/RosterContext';
import { EnrollmentReportUploadResponse } from '../../shared/payloads';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import { useAlerts } from '../../hooks/useAlerts';
import { apiPost } from '../../utils/api';
import { handleJWTError } from '../../utils/handleJWTError';
import { getPreviewTableAccordionItems } from './getPreviewTableAccordionItems';
import { StepContentProps } from './UploadWizard';

export const PreviewChanges: React.FC<StepContentProps> = ({
  enrollmentReportCheck,
  setCurrentStepIndex,
  setEnrollmentReportCheck,
}) => {
  if (!enrollmentReportCheck) throw new Error('Something went wrong');

  const {
    childRecords,
    counts: { newCount, updatedCount, withdrawnCount, unchangedCount },
  } = enrollmentReportCheck;

  const history = useHistory();
  const { accessToken } = useContext(AuthenticationContext);
  const { query, revalidate } = useContext(RosterContext);
  const [_, setAlerts] = useAlerts();

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  async function confirmUpload() {
    setLoadingText('Uploading changes...');
    setLoading(true);

    try {
      const resp: EnrollmentReportUploadResponse = await apiPost(
        `enrollment-reports`,
        { childRecords },
        { accessToken }
      );

      await revalidate();
      history.push({
        pathname: '/roster',
        search: stringify(query),
        state: {
          alerts: [
            {
              type: 'success',
              heading: 'Your records have been uploaded!',
              text: buildUploadSuccessText(resp),
            },
          ],
        },
      });
    } catch (error) {
      handleJWTError(history, (err) => {
        console.error(err);
        setAlerts([
          {
            type: 'error',
            text: 'Something went wrong with your upload!',
          },
        ]);
      })(error);
    } finally {
      setLoading(false);
    }
  }

  function buildUploadSuccessText(
    uploadResponse: EnrollmentReportUploadResponse
  ) {
    let uploadText = `You uploaded ${uploadResponse.newCount} new records`;
    uploadText +=
      uploadResponse.updatedCount > 0
        ? `, ${uploadResponse.updatedCount} updated records`
        : '';
    uploadText +=
      uploadResponse.withdrawnCount > 0
        ? ` and ${uploadResponse.withdrawnCount} withdrawn records.`
        : `.`;

    return uploadText;
  }

  return (
    <>
      <p>
        Here is a summary of the changes you're uploading in this file. If
        everything looks right, upload your changes to your roster.
      </p>
      <LoadingWrapper text={loadingText} loading={loading}>
        <>
          <div className="grid-container upload-roster">
            <div className="grid-row desktop:grid-col-4 three-column-card">
              <Card className="font-body-lg">
                <p className="margin-top-0 margin-bottom-0">
                  Total records in this file
                </p>
                <p className="text-bold margin-top-0 margin-bottom-0">
                  {newCount + updatedCount + withdrawnCount + unchangedCount}
                </p>
              </Card>
            </div>
            <div className="grid-row three-column-layout">
              <div className="desktop:grid-col-4 three-column-card">
                <Card className="font-body-lg">
                  <p className="margin-top-0 margin-bottom-0">New</p>
                  <p className="text-bold margin-top-0 margin-bottom-0">
                    {newCount}
                  </p>
                </Card>
              </div>
              <div className="desktop:grid-col-4 three-column-card">
                <Card className="font-body-lg">
                  <p className="margin-top-0 margin-bottom-0">Updated</p>
                  <p className="text-bold margin-top-0 margin-bottom-0">
                    {updatedCount}
                  </p>
                </Card>
              </div>
              <div className="desktop:grid-col-4 three-column-card">
                <Card className="font-body-lg">
                  <p className="margin-top-0 margin-bottom-0">Withdrawn</p>
                  <p className="text-bold margin-top-0 margin-bottom-0">
                    {withdrawnCount}
                  </p>
                </Card>
              </div>
            </div>

            <div className="grid-row upload-preview-table">
              <Accordion
                items={getPreviewTableAccordionItems(childRecords)}
                titleHeadingLevel="h3"
              />
            </div>
          </div>
          <FixedBottomBar>
            <Button
              text="Cancel upload"
              appearance="outline"
              onClick={() => {
                setEnrollmentReportCheck(undefined);
                setCurrentStepIndex(0);
              }}
            />
            <Button
              id="upload-button"
              text="Save changes to roster"
              onClick={confirmUpload}
            />
          </FixedBottomBar>
        </>
      </LoadingWrapper>
    </>
  );
};
