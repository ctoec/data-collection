import {
  Accordion,
  Button,
  Card,
  HeadingLevel,
  ProgressIndicator,
  ProgressIndicatorProps,
} from '@ctoec/component-library';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { BatchUploadResponse } from '../../shared/payloads';
import { apiPost } from '../../utils/api';
import { getFormDataBlob } from '../../utils/getFormDataBlob';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { handleJWTError } from '../../utils/handleJWTError';
import { clearChildrenCaches } from '../Roster/hooks';
import { getPreviewTableAccordionItems } from './getPreviewTableAccordionItems';

const props: ProgressIndicatorProps = {
  currentIndex: 2,
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

export const Preview: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const history = useHistory();
  const { state } = useLocation();

  //  If there's no state supplied, the user presumably tried to get here manually, which isn't allowed
  if (!state) {
    history.push('/upload');
  }
  const file = (state as any).file;

  const [preview, setPreview] = useState<BatchUploadResponse>();

  useEffect(() => {
    (async function fetchPreview() {
      if (!file) return;

      try {
        const formData = getFormDataBlob(file);
        const resp: BatchUploadResponse = await apiPost(
          `enrollment-reports/false`,
          formData,
          {
            accessToken,
            headers: { 'content-type': formData.type },
            rawBody: true,
          }
        );
        clearChildrenCaches();
        setPreview(resp);
      } catch (error) {
        handleJWTError(history, (err) => {
          console.error(err);
        });
      }
    })();
  }, [file]);

  async function confirmUpload() {
    try {
      const formData = getFormDataBlob(file);
      const resp: BatchUploadResponse = await apiPost(
        `enrollment-reports/true`,
        formData,
        {
          accessToken,
          headers: { 'content-type': formData.type },
          rawBody: true,
        }
      );

      clearChildrenCaches();
      history.push(`/roster`, {
        alerts: [
          {
            type: 'success',
            heading: 'Your records have been uploaded!',
            text: buildUploadSuccessText(resp),
          },
        ],
      });
    } catch (error) {
      handleJWTError(history, (err) => {
        console.error(err);
      });
    }
  }

  function buildUploadSuccessText(batchUpload: BatchUploadResponse) {
    let uploadText = `You uploaded ${batchUpload.new} new records`;
    uploadText +=
      batchUpload.updated > 0 ? `, ${batchUpload.updated} updated records` : '';
    uploadText +=
      batchUpload.withdrawn > 0
        ? ` and ${batchUpload.withdrawn} withdrawn records.`
        : `.`;

    return uploadText;
  }

  const previewAccordionItems = preview
    ? {
        items: getPreviewTableAccordionItems(preview.uploadPreview),
        titleHeadingLevel: 'h2' as HeadingLevel,
      }
    : undefined;

  return (
    <div className="grid-container">
      <BackButton />

      <div className="grid-row display-block">
        <h1 ref={h1Ref} className="margin-bottom-0">
          Upload your enrollment data
        </h1>

        <ProgressIndicator
          currentIndex={props.currentIndex}
          steps={props.steps}
        ></ProgressIndicator>

        <h2 className="margin-bottom-0">
          <span className="usa-step-indicator__current-step">3</span>
          <span className="usa-step-indicator__total-steps"> of 3</span>Preview
          changes and upload file
        </h2>

        <p>
          Here is a summary of the changes you're uploading in this file. If
          everything looks right, upload your changes to your roster.
        </p>
      </div>

      <div className="grid-row desktop:grid-col-4 three-column-card">
        <Card className="font-body-lg">
          <p className="margin-top-0 margin-bottom-0">
            Total records in this file
          </p>
          <p className="text-bold margin-top-0 margin-bottom-0">
            {preview ? preview.new + preview.updated + preview.withdrawn : ''}
          </p>
        </Card>
      </div>
      <div className="grid-row three-column-layout">
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">New</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {preview ? preview.new : ''}
            </p>
          </Card>
        </div>
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">Updated</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {preview ? preview.updated : ''}
            </p>
          </Card>
        </div>
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">Withdrawn</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {preview ? preview.withdrawn : ''}
            </p>
          </Card>
        </div>
      </div>

      <div className="grid-row">
        {previewAccordionItems ? (
          <Accordion {...previewAccordionItems} />
        ) : (
          <></>
        )}
      </div>

      <Button text="Cancel Upload" href="/home" appearance="outline" />
      <Button
        id="upload-button"
        text="Save changes to roster"
        onClick={confirmUpload}
      />
    </div>
  );
};
