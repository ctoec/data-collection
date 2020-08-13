import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  Form,
  FormSubmitButton,
  Button,
  TextWithIcon,
  Alert,
} from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { apiPost } from '../../utils/api';

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
    if (!formData.has('file')) {
      setStatus({
        error: 'You must select a file to upload',
      });
      return;
    }
    setLoading(true);

    apiPost('enrollment-reports', formData, { accessToken })
      .then((value) => {
        setStatus({
          reportId: value.id,
          message: 'Successfully uploaded file',
        });
      })
      .catch((err) => {
        setStatus({
          error: err,
        });
      })
      .finally(() => {
        setLoading(false);
      });

    return false;
  };

  console.log('status', status);
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
      <div className="margin-bottom-2 text-bold">
        <Link to="/">
          <TextWithIcon
            text="Back"
            Icon={Arrow}
            direction="left"
            iconSide="left"
          />
        </Link>
      </div>
      <div className="grid-row">
        <h1>Upload your enrollment data</h1>
        <p>
          After you've entered all state funded enrollment data in the
          spreadsheet template, upload the file here.
        </p>
      </div>
      <div className="grid-row">
        <Form<null> className="UploadForm" onSubmit={onSubmit} data={null}>
          <FileInput id="report" label="" onChange={fileUpload} />
          <FormSubmitButton
            className="margin-top-2"
            text={loading ? 'Uploading...' : 'Upload'}
          />
          {status && !status.error && status.reportId && (
            <Button
              href={`/check-data?${queryString.stringify({
                reportId: status.reportId,
              })}`}
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
