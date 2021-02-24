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

  //  If there's no state suplied, the user presumably tried to get here manually, which isn't allowed
  if (!state) {
    history.push('/upload');
  }
  const file = (state as any).file;

  const [preview, setPreview] = useState<BatchUploadResponse>();

  useEffect(() => {
    (async function fetchPreview() {
      const formData = getFormDataBlob(file);
      await apiPost(`enrollment-reports/false`, formData, {
        accessToken,
        headers: { 'content-type': formData.type },
        rawBody: true,
      })
        .then((resp: BatchUploadResponse) => {
          // Clear all children records from data cache
          clearChildrenCaches();
          console.log(resp);
          setPreview(resp);
        })
        .catch(
          handleJWTError(history, (err) => {
            console.error(err);
          })
        );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [file]);

  const confirmUpload = async () => {
    const formData = getFormDataBlob(file);
    apiPost(`enrollment-reports/true`, formData, {
      accessToken,
      headers: { 'content-type': formData.type },
      rawBody: true,
    })
      // Response contains id of created enrollmentReport,
      // number of active enrollments, and num withdrawn enrollments
      // via BatchUpload payload
      .then((resp: BatchUploadResponse) => {
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
          console.error(err);
        })
      );
  };

  const previewAccordionItems = preview
    ? {
        items: getPreviewTableAccordionItems(preview.uploadPreview),
        titleHeadingLevel: 'h2' as HeadingLevel,
      }
    : undefined;

  return (
    <div className="grid-container">
      <BackButton location="/upload" />

      <ProgressIndicator
        currentIndex={props.currentIndex}
        steps={props.steps}
      ></ProgressIndicator>

      <div className="grid-row display-block">
        <h1 ref={h1Ref} className="margin-bottom-0">
          Upload your enrollment data
        </h1>
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

      {previewAccordionItems ? <Accordion {...previewAccordionItems} /> : <></>}

      <Button text="Cancel Upload" href="/home" appearance="outline" />
      <Button
        id="upload-button"
        text="Save changes to roster"
        onClick={() => confirmUpload}
      />
    </div>
  );
};
