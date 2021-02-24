import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  Alert,
  LoadingWrapper,
  ErrorBoundary,
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
      const formData = getFormDataBlob(file);

      try {
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
      } catch (e) {
        handleJWTError(history, (e) => {
          setError(e);
          clearFile();
        });
      } finally {
        setLoading(false);
      }
    });
  }, [file]);

  const [fileKey, setFileKey] = useState(0);
  const clearFile = () => {
    // When the file is cleared, change the key to force the file component to rerender/reset
    setFile(undefined);
    setFileKey((oldKey) => oldKey + 1);
  };
  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const _file = e?.target?.files?.[0];
    if (!_file) {
      clearFile();
      return setError('No file selected for upload');
    }
    setFile(_file);
    setError(undefined);
  };

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
      <div className="grid-row display-block">
        <h1 ref={h1Ref} className="margin-bottom-0">
          Upload your enrollment data
        </h1>
        <p>
          After you've entered all state funded enrollment data in the
          spreadsheet template, upload the file here.
        </p>
      </div>
      <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
        <div className="grid-row">
          <LoadingWrapper text="Uploading your file..." loading={loading}>
            <FileInput
              key={fileKey}
              id="report"
              label="Choose a file"
              onChange={fileUpload}
            />
          </LoadingWrapper>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Upload;
