import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames';
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
import { ErrorModal } from './ErrorModal/ErrorsModal';
import { ErrorObjectForTable } from './ErrorModal/ErrorObjectForTable';
import { clearChildrenCaches } from '../Roster/hooks';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { BatchUpload } from '../../shared/payloads';
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
  const [errorDict, setErrorDict] = useState<ErrorObjectForTable[]>();
  useEffect(() => {
    // Haven't yet determined how many errors of each type there are
    if (file && errorDict === undefined) {
      setLoading(true);
      const formData = getFormDataBlob(file);
      apiPost(`enrollment-reports/check`, formData, {
        accessToken,
        headers: { 'content-type': formData.type },
        rawBody: true,
      })
        // Back end sends back an object whose fields are error table obj.
        .then((resp) => {
          setErrorDict(resp);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            clearFile();
          })
        )
        .finally(() => setLoading(false));
    }
  }, [file, errorDict]);

  // If the file exists and the upload should be posted,
  // then trigger the API request
  const [postUpload, setPostUpload] = useState(false);
  const [queryStringForUpload, setQueryStringForUpload] = useState('');
  useEffect(() => {
    if (file && postUpload) {
      setLoading(true);
      const formData = getFormDataBlob(file);
      apiPost(`enrollment-reports${queryStringForUpload}`, formData, {
        accessToken,
        headers: { 'content-type': formData.type },
        rawBody: true,
      })
        // Response contains id of created enrollmentReport,
        // number of active enrollments, and num withdrawn enrollments
        // via BatchUpload payload
        .then((resp: BatchUpload) => {
          // Clear all children records from data cache
          clearChildrenCaches();
          console.log(resp);
          let uploadText = `You uploaded ${resp.new} new records`;
          uploadText +=
            resp.withdrawn > 0
              ? ` and ${resp.withdrawn} withdrawn records.`
              : `.`;
          history.push(`/roster`, {
            alerts: [
              {
                type: 'success',
                heading: 'Your records have been uploaded!',
                text: uploadText,
              },
            ],
          });
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            clearFile();
          })
        )
        // Reset this flag to false so the upload can be subsequently re-triggered
        .finally(() => {
          setPostUpload(false);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUpload]);

  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const advanceToPostUpload = () => {
    setPostUpload(true);
    setErrorModalOpen(false);
  };

  useEffect(() => {
    // If they have selected a file, then open the error checking modal.
    if (file && errorDict !== undefined) {
      if (errorDict.length > 0) setErrorModalOpen(true);
      else setPostUpload(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, errorDict]);

  const [fileKey, setFileKey] = useState(0);
  const clearFile = () => {
    // When the file is cleared, change the key to force the file component to rerender/reset
    setFile(undefined);
    setErrorDict(undefined);
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
    setErrorDict(undefined);
  };

  return (
    <div className="grid-container">
      <BackButton location="/" />

      <ErrorModal
        isOpen={errorModalOpen}
        closeModal={() => setErrorModalOpen(false)}
        clearFile={clearFile}
        errorDict={errorDict || []}
        nextFunc={advanceToPostUpload}
      />
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
          <form
            className={cx('usa-form', {
              'display-none': errorModalOpen,
            })}
          >
            <LoadingWrapper text="Uploading your file..." loading={loading}>
              <FileInput
                key={fileKey}
                id="report"
                label="Choose a file"
                onChange={fileUpload}
              />
            </LoadingWrapper>
          </form>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default Upload;
