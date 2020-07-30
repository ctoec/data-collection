import React from 'react';
import { MailToLink } from '../Home/MailToLink';
import { Button } from '@ctoec/component-library';
import { getCurrentHost } from '../../utils/getCurrentHost';

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
        <p>
          <span className="text-bold">Excel template</span>
          <br />
          <a href={`${getCurrentHost()}/template/xlsx`}>
            ECE Data Collection Excel Template
          </a>
          <br />
          <br />
          <span className="text-bold">CSV template</span>
          <br />
          <a href={`${getCurrentHost()}/template/csv`} target="#">
            ECE Data Collection CSV Template
          </a>
        </p>
      </div>
      <div className="grid-row margin-top-4">
        <Button text="Go to file upload" href="/upload" />
      </div>
    </div>
  );
};

export default GettingStarted;
