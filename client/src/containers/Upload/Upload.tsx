import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  Alert,
  LoadingWrapper,
  ErrorBoundary,
  Card,
  Accordion,
  HeadingLevel,
  Button,
} from '@ctoec/component-library';
import { apiPost } from '../../utils/api';
import { getErrorHeading, getErrorText } from '../../utils/error';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { handleJWTError } from '../../utils/handleJWTError';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';
import { BatchUploadResponse } from '../../shared/payloads';
import { EnrollmentColumnError } from '../../shared/payloads';
import { getFormDataBlob } from '../../utils/getFormDataBlob';
import { BackButton } from '../../components/BackButton';
import { getPreviewTableAccordionItems } from './getPreviewTableAccordionItems';

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

      const [showPreview, setShowPreview] = useState(false);
      const [preview, setPreview] = useState<BatchUpload>();
      useEffect(() => {
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
          });
        } catch (e) {
          handleJWTError(history, (e) => {
            setError(e);
            clearFile();
          });
        } finally {
          setLoading(false);
        }
      })();
    },
      [file]);

    if (file && showPreview) {
      setLoading(true);
      const formData = getFormDataBlob(file);
      apiPost(`enrollment-reports/false`, formData, {
        accessToken,
        headers: { 'content-type': formData.type },
        rawBody: true,
      })
        .then((resp: BatchUpload) => {
          // Clear all children records from data cache
          clearChildrenCaches();
          console.log(resp);
          setPreview(resp);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            clearFile();
          })
        )
        // Reset this flag to false so the upload can be subsequently re-triggered
        .finally(() => {
          setLoading(false);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [file, showPreview]);

  // If the file exists and the upload should be posted,
  // then trigger the API request
  const [postUpload, setPostUpload] = useState(false);
  useEffect(() => {
    if (file && postUpload) {
      setLoading(true);
      const formData = getFormDataBlob(file);
      apiPost(`enrollment-reports/true`, formData, {
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
            resp.updated > 0 ? `, ${resp.updated} updated records` : '';
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

  const previewAccordionItems = preview
    ? {
        items: getPreviewTableAccordionItems(preview.uploadPreview),
        titleHeadingLevel: 'h2' as HeadingLevel,
      }
    : undefined;

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
          {!showPreview && !errorModalOpen
            ? `After you've entered all state funded enrollment data in the 
              spreadsheet template, upload the file here.`
            : `Here is a summary of the changes you're uploading in this file.
              If everything looks right, upload your changes to your roster.`}
        </p>
      </div>

      {!preview || errorModalOpen ? (
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
      ) : (
        <>
          <div className="grid-row desktop:grid-col-4 three-column-card">
            <Card className="font-body-lg">
              <p className="margin-top-0 margin-bottom-0">
                Total records in this file
              </p>
              <p className="text-bold margin-top-0 margin-bottom-0">
                {preview.new + preview.updated + preview.withdrawn}
              </p>
            </Card>
          </div>
          <div className="grid-row three-column-layout">
            <div className="desktop:grid-col-4 three-column-card">
              <Card className="font-body-lg">
                <p className="margin-top-0 margin-bottom-0">New</p>
                <p className="text-bold margin-top-0 margin-bottom-0">
                  {preview.new}
                </p>
              </Card>
            </div>
            <div className="desktop:grid-col-4 three-column-card">
              <Card className="font-body-lg">
                <p className="margin-top-0 margin-bottom-0">Updated</p>
                <p className="text-bold margin-top-0 margin-bottom-0">
                  {preview.updated}
                </p>
              </Card>
            </div>
            <div className="desktop:grid-col-4 three-column-card">
              <Card className="font-body-lg">
                <p className="margin-top-0 margin-bottom-0">Withdrawn</p>
                <p className="text-bold margin-top-0 margin-bottom-0">
                  {preview.withdrawn}
                </p>
              </Card>
            </div>
          </div>

          {previewAccordionItems ? (
            <Accordion {...previewAccordionItems} />
          ) : (
            <></>
          )}

          <Button text="Cancel Upload" href="/home" appearance="outline" />
          <Button
            id="upload-button"
            text="Save changes to roster"
            onClick={() => setPostUpload(true)}
          />
        </>
      )}
    </div>
  );
};

export default Upload;
