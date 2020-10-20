import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { FileInput, TextWithIcon, Alert } from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { apiPost, apiGet } from '../../utils/api';
import { getErrorHeading, getErrorText } from '../../utils/error';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { handleJWTError } from '../../utils/handleJWTError';
import { CheckReplaceData } from './CheckReplaceData';
import DataCacheContext from '../../contexts/DataCacheContext/DataCacheContext';
import { TemplateDownloadLink } from '../../components/TemplateDownloadLink';
import { ErrorsModal } from './ErrorsModal';

export type ErrorObjectForTable = {
  property: string;
  count: number;
  formattedName: string;
};

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

  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);

  const [userRosterCount, setUserRosterCount] = useState(undefined);
  const [checkReplaceDataOpen, setCheckReplaceDataOpen] = useState(false);
  const [errorDict, setErrorDict] = useState<ErrorObjectForTable[] | undefined>(
    undefined
  );
  const [errorsModalOpen, setErrorsModalOpen] = useState(false);
  useEffect(() => {
    apiGet('children?count=true', { accessToken }).then((res) =>
      setUserRosterCount(res.count)
    );
  }, [accessToken]);

  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();
  const history = useHistory();
  const {
    children: { refetch: refetchChildren },
  } = useContext(DataCacheContext);

  const [queryStringForUpload, setQueryStringForUpload] = useState('');
  const [postUpload, setPostUpload] = useState(false);

  useEffect(() => {
    // Haven't yet determined how many errors of each type there are
    if (file && errorDict === undefined) {
      const formData = new FormData();
      formData.set('file', file);
      apiPost(`enrollment-reports/checkForErrors`, formData, {
        accessToken,
        rawBody: true,
      })
        // TODO: DEFINE APPROPRIATE BEHAVIOR AFTER SENDING BACK ERROR DICT
        .then((resp) => {
          setErrorDict(resp);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            setFile(undefined);
          })
        );
    }
  }, [file, errorDict]);

  useEffect(() => {
    // If the file exists and the upload should be posted,
    // then trigger the API request
    if (file && postUpload) {
      const formData = new FormData();
      formData.set('file', file);
      apiPost(`enrollment-reports${queryStringForUpload}`, formData, {
        accessToken,
        rawBody: true,
      })
        .then(() => {
          refetchChildren();
          history.push(`/roster`);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            setFile(undefined);
          })
        )
        // Reset this flag to false so the upload can be subsequently re-triggered
        .finally(() => setPostUpload(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUpload]);

  useEffect(() => {
    // wait until we know if the user already has a roster or not
    // before allowing them to submit data
    if (userRosterCount === undefined) return;

    // If they have selected a file, then open the error checking modal
    // to let the user see where the errors are. If they wish to proceed,
    //  decide if the upload should occur or we should display the
    // check replace data modal
    if (file && errorDict) {
      if (userRosterCount === 0) {
        if (errorDict.length > 0) setErrorsModalOpen(true);
        else setPostUpload(true);
      } else {
        // TODO: MODIFY THIS SO THAT AFTER THE USER DOES WHAT THEY WANT IN
        // THE CHECK REPLACE MODAL, WE GO TO THE ERROR MODAL IF APPLICABLE
        // setCheckReplaceDataOpen(true);
        // setErrorsModalOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, userRosterCount]);

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

    // set target.files = null to ensure change event is properly triggered
    // even if file with same name is re-uploaded
    e.target.files = null;
  };

  return (
    <div className="grid-container margin-top-4">
      <ErrorsModal
        isOpen={errorsModalOpen}
        toggleIsOpen={() => setErrorsModalOpen((o) => !o)}
        clearFile={() => setFile(undefined)}
        errorDict={errorDict || []}
        setPostUpload={setPostUpload}
      />
      <CheckReplaceData
        isOpen={checkReplaceDataOpen}
        clearFile={() => setFile(undefined)}
        toggleIsOpen={() => setCheckReplaceDataOpen((o) => !o)}
        setPostUpload={setPostUpload}
        setQueryString={setQueryStringForUpload}
      />
      {error && (
        <Alert
          heading={getErrorHeading(error)}
          text={getErrorText(error)}
          type="error"
          actionItem={
            <div>
              <p className="margin-bottom-2 text-bold">
                Download the data collection template
              </p>
              <TemplateDownloadLink type="xlsx" />
              <TemplateDownloadLink type="csv" />
            </div>
          }
        />
      )}
      <div className="margin-bottom-2 text-bold">
        <Link className="usa-button usa-button--unstyled" to="/">
          <TextWithIcon
            text="Back"
            Icon={Arrow}
            direction="left"
            iconSide="left"
          />
        </Link>
      </div>

      <div className="grid-row">
        <h1 ref={h1Ref}>Upload your enrollment data</h1>
        <p>
          After you've entered all state funded enrollment data in the
          spreadsheet template, upload the file here.
        </p>
      </div>
      <div className="grid-row">
        <form
          className={cx('usa-form', { 'display-none': checkReplaceDataOpen })}
        >
          <FileInput id="report" label="Choose a file" onChange={fileUpload} />
        </form>
      </div>
    </div>
  );
};

export default Upload;
