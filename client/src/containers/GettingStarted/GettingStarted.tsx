import React from 'react';
import { MailToLink } from '../../components/MailToLink';
import { Button, Alert } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { ExcelTemplateDownloadLink } from '../../components/ExcelTemplateDownloadLink';
import { CSVTemplateDownloadLink } from '../../components/CSVTemplateDownloadLink';

const GettingStarted: React.FC = () => {
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row">
        <h1>Getting started</h1>
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
              <Link to="/column-metadata">enrollment data requirements.</Link>
            </span>
          }
        />

        <div>
          <h2>Download the data entry template</h2>
          <p>
            Use one of these templates to enter your enrollment data for all
            state-funded children.
          </p>
          <ExcelTemplateDownloadLink />
          <CSVTemplateDownloadLink />
        </div>
      </div>
      <div className="grid-row margin-top-2">
        <Button text="Go to file upload" href="/upload" />
      </div>
    </div>
  );
};

export default GettingStarted;
