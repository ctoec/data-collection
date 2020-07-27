import React, { useState, useContext, useEffect } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  Form,
  FormSubmitButton,
  Button,
  Alert,
} from '@ctoec/component-library';
import { DefaultApi, Configuration } from '../../generated';
import { getCurrentHost } from '../../utils/getCurrentHost';

const Upload: React.FC = () => {
  // USWDS File Input is managed by JS (not exclusive CSS)
  // We need to import the distributed JS code. It runs immediately
  // after being parsed, and searches for DOM elements with the
  // appriopriate HTML attributes. React constantly mounts/unmounts
  // DOM nodes. To get around this, we dynamically import USWDS every
  // render. However, browsers cache the module and so subsequent
  // imports don't trigger the code to execute again. To get around
  // this, we must delete the module from the cache.
  useEffect(() => {
    delete require.cache[require.resolve('uswds/dist/js/uswds')];
    // @ts-ignore
    import('uswds/dist/js/uswds');
  }, []);

  const { accessToken } = useContext(AuthenticationContext);
  const [status, setStatus] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const formData = new FormData();

  const onSubmit = () => {
    setLoading(true);
    new DefaultApi(
      new Configuration({
        basePath: `${getCurrentHost()}/api`,
        apiKey: `Bearer ${accessToken}`,
      })
    )
      .createReport({
        file: formData.get('file') as any,
      })
      .then((value) => {
        setStatus({
          filename: (value as any).filename,
          message: 'Successfully uploaded file',
        });
      })
      .catch((_) => {
        setStatus({
          error: 'There was an error',
        });
      })
      .finally(() => {
        setLoading(false);
      });

    return false;
  };
  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return false;
    }
    const file = e.target.files[0];
    if (!file) {
      return false;
    }
    formData.delete('file');
    formData.set('file', file);
    return false;
  };

  return (
    <div className="grid-container margin-top-4">
      {status &&
        (!status.error ? (
          <Alert text={status.message} type="success" />
        ) : (
          <Alert text={status.error} type="error" />
        ))}
      <div className="grid-row">
        <h1>Upload your enrollment data</h1>
        <p>
          After you've entered all state funded enrollment data in the
          spreadsheet template, upload the file here.
        </p>
      </div>
      <div className="grid-row">
        <Form<null> className="UploadForm" onSubmit={onSubmit} data={null}>
          <FileInput
            id="report"
            label="Upload enrollment data"
            onChange={fileUpload}
          />
          <FormSubmitButton
            className="margin-top-2"
            text={loading ? 'Uploading...' : 'Upload'}
          />
          {status && !status.error && (
            <Button
              href={`/check-data/${status.filename}`}
              text="Check your data"
              appearance="outline"
            />
          )}
        </Form>
      </div>
    </div>
  );
};

export default Upload;
