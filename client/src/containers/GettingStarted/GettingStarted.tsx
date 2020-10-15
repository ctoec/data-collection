import React from 'react';
import { MailToLink } from '../../components/MailToLink';
import { Button, Alert } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';

const GettingStarted: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row">
        <h1 ref={h1Ref}>Getting started</h1>
        <p>
          This tool will allow you to upload and submit the most recent
          enrollment data for all state funded childcare spaces at your program.
        </p>
        <p>
          To get started, download the spreadsheet template that contains all
          required data for each field. If you have any questions, reach out to{' '}
          <MailToLink />
        </p>
        <Alert
          heading="OEC's enrollment data requirements"
          type="info"
          text={
            <span>
              To see all required data fields, definitions, and rationale, see{' '}
              <Link
                className="usa-button usa-button--unstyled"
                to="/data-requirements"
              >
                enrollment data requirements.
              </Link>
            </span>
          }
        />

        <div>
          <h2>Download the data entry template</h2>
          <p>
            Use one of these templates to enter your enrollment data for all
            state-funded children.
          </p>
          <CSVExcelDownloadButton fileType="xlsx" whichDownload={'template'} />
          <CSVExcelDownloadButton fileType="csv" whichDownload="template" />
        </div>
      </div>
      <div className="display-block">
        <p>You can see a completed example template here:</p>
        <CSVExcelDownloadButton fileType="xlsx" whichDownload={'example'} />
        <CSVExcelDownloadButton fileType="csv" whichDownload="example" />{' '}
      </div>
      <div className="grid-row margin-top-2">
        <Button text="Go to file upload" href="/upload" />
        <Button text="Go to roster" href="/roster" />
      </div>
    </div>
  );
};

export default GettingStarted;
