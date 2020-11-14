import React, { useState, useContext, useEffect } from 'react';
import cx from 'classnames';
import { Link, useHistory } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import {
  FileInput,
  TextWithIcon,
  Alert,
  LoadingWrapper,
  ErrorBoundary,
} from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { apiPost, apiGet } from '../../utils/api';
import { getErrorHeading, getErrorText } from '../../utils/error';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { handleJWTError } from '../../utils/handleJWTError';
import { CheckReplaceData } from './CheckReplaceData';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { ErrorModal } from './ErrorModal/ErrorsModal';
import { ErrorObjectForTable } from './ErrorModal/ErrorObjectForTable';
import { clearChildrenCaches } from '../Roster/hooks';
import { defaultErrorBoundaryProps } from '../../utils/defaultErrorBoundaryProps';

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
  const history = useHistory();

  // Count how many children are in the roster so we can determine if we're writing over that data
  const [userRosterCount, setUserRosterCount] = useState(undefined);
  useEffect(() => {
    apiGet('children?count=true', accessToken)
      .then((res) => setUserRosterCount(res.count))
      .catch((err) => {
        throw new Error(err);
      });
  }, [accessToken]);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Check the file for errors if there is a file
  const [file, setFile] = useState<File>();
  const [errorDict, setErrorDict] = useState<ErrorObjectForTable[]>();
  useEffect(() => {
    // Haven't yet determined how many errors of each type there are
    if (file && errorDict === undefined) {
      setLoading(true);
      const formData = new FormData();
      formData.set('file', file);
      apiPost(`enrollment-reports/check`, formData, {
        accessToken,
        rawBody: true,
      })
        // Back end sends back an object whose fields are error table obj.
        .then((resp) => {
          setErrorDict(resp);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            setFile(undefined);
            setErrorDict(undefined);
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
      const formData = new FormData();
      formData.set('file', file);
      apiPost(`enrollment-reports${queryStringForUpload}`, formData, {
        accessToken,
        rawBody: true,
      })
        .then(() => {
          // Clear all children records from data cache
          clearChildrenCaches();
          history.push(`/roster`);
        })
        .catch(
          handleJWTError(history, (err) => {
            setError(err);
            setFile(undefined);
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

  // Case where the user doesn't already have a roster so we
  // don't need to go to CheckReplace: next step is confirm upload
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const advanceToPostUpload = () => {
    setPostUpload(true);
    setErrorModalOpen(false);
  };

  // Case where the user does have an existing roster; need to
  // open the CheckReplace modal as a next step
  const [checkReplaceDataOpen, setCheckReplaceDataOpen] = useState(false);
  const advanceToCheckReplace = () => {
    setErrorModalOpen(false);
    setCheckReplaceDataOpen(true);
  };
  useEffect(() => {
    // wait until we know if the user already has a roster or not
    // before allowing them to submit data
    if (userRosterCount === undefined) return;

    // If they have selected a file, then open the error checking modal.
    // If they confirm the upload, decide if we just post the upload
    // or we display check replace data modal
    if (file && errorDict !== undefined) {
      if (userRosterCount === 0) {
        // If state has an empty list, back-end found no errors
        if (errorDict.length > 0) setErrorModalOpen(true);
        else setPostUpload(true);
      } else {
        if (errorDict.length > 0) setErrorModalOpen(true);
        else setCheckReplaceDataOpen(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, userRosterCount, errorDict]);

  const fileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e?.target?.files?.[0];
    if (!file) {
      return setError('No file selected for upload');
    }
    setFile(file);
    setError(undefined);

    // set target.files = null to ensure change event is properly triggered
    // even if file with same name is re-uploaded
    e.target.files = null;
  };

  return (
    <div className="grid-container margin-top-4">
      <ErrorModal
        isOpen={errorModalOpen}
        toggleIsOpen={() => setErrorModalOpen((o) => !o)}
        clearFile={() => {
          setFile(undefined);
          setErrorDict(undefined);
        }}
        errorDict={errorDict || []}
        nextFunc={
          userRosterCount === 0 ? advanceToPostUpload : advanceToCheckReplace
        }
      />
      <CheckReplaceData
        isOpen={checkReplaceDataOpen}
        clearFile={() => setFile(undefined)}
        toggleIsOpen={() => setCheckReplaceDataOpen((o) => !o)}
        setPostUpload={setPostUpload}
        setQueryString={setQueryStringForUpload}
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
      <ErrorBoundary alertProps={{ ...defaultErrorBoundaryProps }}>
        <div className="grid-row">
          <form
            className={cx('usa-form', {
              'display-none': checkReplaceDataOpen || errorModalOpen,
            })}
          >
            <LoadingWrapper text="Uploading your file..." loading={loading}>
              <FileInput
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
