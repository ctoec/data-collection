import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  Alert,
  LoadingWrapper,
  ErrorBoundary,
  ProgressIndicator,
  ProgressIndicatorProps,
} from '@ctoec/component-library';
import { apiPost } from '../../utils/api';
import { getErrorHeading, getErrorText } from '../../utils/error';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { handleJWTError } from '../../utils/handleJWTError';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { EnrollmentColumnError } from '../../shared/payloads';
import { getFormDataBlob } from '../../utils/getFormDataBlob';
import { BackButton } from '../../components/BackButton';

const props: ProgressIndicatorProps = {
  currentIndex: 0,
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

const ACCEPTABLE_ROWS = [
  'A new child',
  'An existing child with updated birth certificate information (Birth certificate type, Birth certificate ID #, Town of birth, and State of birth)',
  'An existing child with updated address (Street address, Cty, State, and Zipcode)',
  'A withdrawn child with ended enrollment (Enrollment end date, Enrollment exit reason, Last reporting period)',
  'An existing child with changed site',
  'An existing child with changed age group (with or without changed funding)',
  'An existing child with changed funding and/or space type',
];

const Upload: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Check the file for errors if there is a file
  const [file, setFile] = useState<File>();
  useEffect(() => {
    (async function submitUpload() {
      if (!file) return;

      setLoading(true);
      try {
        const formData = getFormDataBlob(file);
        const enrollmentColumnErrors: EnrollmentColumnError[] = await apiPost(
          `enrollment-reports/check`,
          formData,
          {
            accessToken,
            headers: { 'content-type': formData.type },
            rawBody: true,
          }
        );

        history.push('/missing-info', {
          enrollmentColumnErrors,
          file,
        });
      } catch (error) {
        handleJWTError(history, (e) => {
          setError(e);
          clearFile();
        })(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [file]);

  const [fileKey, setFileKey] = useState(0);

  function clearFile() {
    // When the file is cleared, change the key to force the file component to rerender/reset
    setFile(undefined);
    setFileKey((oldKey) => oldKey + 1);
  }

  function triggerUpload(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const _file = event?.target?.files?.[0];

    if (!_file) {
      clearFile();
      return setError('No file selected for upload');
    }

    setFile(_file);
    setError(undefined);
  }

  return (
    <div className="grid-container">
      <BackButton location="/" />

      {error && (
        <div className="margin-bottom-2">
          <Alert
            heading={getErrorHeading(error)}
            text={getErrorText(error)}
            type="error"
            actionItem={
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
            }
          />
        </div>
      )}
      <div className="grid-row display-block margin-bottom-2">
        <h1 ref={h1Ref} className="margin-bottom-4">
          Upload your enrollment data
        </h1>

        <ProgressIndicator
          currentIndex={props.currentIndex}
          steps={props.steps}
        ></ProgressIndicator>
        <h2 className="margin-bottom-2">
          <span className="usa-step-indicator__current-step">1</span>
          <span className="usa-step-indicator__total-steps"> of 3</span>Choose
          your enrollment file
        </h2>
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
