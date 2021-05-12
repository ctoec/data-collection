import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  LoadingWrapper,
  ErrorBoundary,
} from '@ctoec/component-library';
import { apiPost } from '../../utils/api';
import { getErrorHeading, getErrorText } from '../../utils/error';
import { handleJWTError } from '../../utils/handleJWTError';
import { BackButton } from '../../components/BackButton';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { useAlerts } from '../../hooks/useAlerts';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { EnrollmentReportCheckResponse } from '../../shared/payloads';
import { getFormDataBlob } from '../../utils/getFormDataBlob';
import { StepContentProps } from './UploadWizard';

const ACCEPTABLE_ROWS = [
  'A new child',
  'An existing child with updated birth certificate information (Birth certificate type, Birth certificate ID #, Town of birth, and State of birth)',
  'An existing child with updated address (Street address, Cty, State, and Zipcode)',
  'A withdrawn child with ended enrollment (Enrollment end date, Enrollment exit reason, Last reporting period)',
  'An existing child with changed site',
  'An existing child with changed age group (with or without changed funding)',
  'An existing child with changed funding and/or space type',
];

const Upload: React.FC<StepContentProps> = ({
  setCurrentStepIndex,
  setEnrollmentReportCheck,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const [_, setAlerts] = useAlerts();

  const [loading, setLoading] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  // When the file is cleared, change the key to force the file component to rerender/reset
  const clearFile = () => setFileKey((oldKey) => oldKey + 1);

  async function triggerUpload(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const file = event?.target?.files?.[0];

    if (!file) {
      clearFile();
      setAlerts([
        {
          type: 'error',
          text: 'No file selected for upload',
        },
      ]);
      return;
    }

    setLoading(true);
    try {
      const formData = getFormDataBlob(file);
      const checkResponse: EnrollmentReportCheckResponse = await apiPost(
        `enrollment-reports/check`,
        formData,
        {
          accessToken,
          headers: { 'content-type': formData.type },
          rawBody: true,
        }
      );

      setEnrollmentReportCheck(checkResponse);
      setCurrentStepIndex((currentStepIdx) => currentStepIdx + 1);
    } catch (error) {
      handleJWTError(history, (e) => {
        setAlerts([
          {
            heading: getErrorHeading(e),
            text: getErrorText(error),
            type: 'error',
            actionItem: (
              <div>
                <p className="margin-bottom-1 text-bold">
                  Download the data collection template
                </p>
                <CSVExcelDownloadButton
                  fileType="xlsx"
                  whichDownload="template"
                  className="margin-bottom-1"
                />
                <CSVExcelDownloadButton
                  fileType="csv"
                  whichDownload="template"
                  className="margin-bottom-1"
                />
              </div>
            ),
          },
        ]);

        clearFile();
      })(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid-container">
      <BackButton location="/" />

      <div className="grid-row display-block margin-bottom-2">
        <p>
          Upload a data template to add to or edit your roster. An acceptable
          data template includes rows for:
        </p>
        <ul className="margin-left-2 bx--list--unordered">
          {ACCEPTABLE_ROWS.map((text) => (
            <li key={text} className="line-height-body-4 bx--list__item">
              {text}
            </li>
          ))}
        </ul>
      </div>
      <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
        <div className="grid-row">
          <LoadingWrapper text="Uploading your file..." loading={loading}>
            <FileInput
              key={fileKey}
              id="report"
              label="Choose a file"
              onChange={triggerUpload}
            />
          </LoadingWrapper>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Upload;
