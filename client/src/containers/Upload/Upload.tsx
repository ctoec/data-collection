import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { FileInput, TextWithIcon, Alert } from '@ctoec/component-library';
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
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();
  const history = useHistory();

  useEffect(() => {
    if (file) {
      const formData = new FormData();
      formData.set('file', file);
      apiPost('enrollment-reports', formData, { accessToken })
        .then((value) => {
          history.push(`check-data/${value.id}`);
        })
        .catch((err) => {
          setError(err);
          setFile(undefined);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) {
      return setError('No file selected for upload');
    }
    const file = e.target.files[0];
    if (!file) {
      return setError('No file selected for upload');
    }
    setFile(file);
  };

  return (
    <div className="grid-container margin-top-4">
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
      {error && <Alert text={error} type="error" />}
      <div className="grid-row">
        <h1>Upload your enrollment data</h1>
        <p>
          After you've entered all state funded enrollment data in the
          spreadsheet template, upload the file here.
        </p>
      </div>
      <div className="grid-row">
        <form className="usa-form">
          <FileInput
            id="report"
            label="Upload enrollment data"
            onChange={fileUpload}
          />
        </form>
      </div>
    </div>
  );
};

export default Upload;
