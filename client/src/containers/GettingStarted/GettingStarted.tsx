import React from 'react';
import { Button, Alert } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';

const GettingStarted: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row grid-gap">
        <div className="grid-col-8">
          <h1 ref={h1Ref}>Let's get started</h1>
          <p>
            This tool will allow you to share your state-funded enrollment data
            with OEC.
          </p>
          <h2>Here's what to include</h2>
          <h3>Enrollments in spaces funded by</h3>
          <ul>
            <li>Child Day Care (CDC)</li>
            <li>Priority or Competitive School Readiness (PSR and CSR)</li>
            <li>Smart Start (SS)</li>
            <li>State Head Start (SHS)</li>
          </ul>
          <Alert
            heading="Learn more about required data"
            type="info"
            text={
              <span>
                See all required data fields, definitions and rationale in{' '}
                <Link
                  className="usa-button usa-button--unstyled"
                  to="/data-requirements"
                >
                  OEC's enrollment data requirements
                </Link>
              </span>
            }
          />
          <h3>Reporting period</h3>
          <p>
            Data is due on March 31, 2020 and must include data from July 1,
            2020 to at least Jan 1, 2021.
          </p>
          <div>
            <h2>Download the latest batch upload template</h2>
            <CSVExcelDownloadButton fileType="xlsx" whichDownload="template" />
            <CSVExcelDownloadButton fileType="csv" whichDownload="template" />
          </div>
          <div className="display-block">
            <p>You can see a completed example template here:</p>
            <CSVExcelDownloadButton fileType="xlsx" whichDownload="example" />
            <CSVExcelDownloadButton
              fileType="csv"
              whichDownload="example"
            />{' '}
          </div>
        </div>
        <div className="grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
      <div className="grid-row margin-top-2">
        <Button text="Go to file upload" href="/upload" />
        <Button text="Go to roster" href="/roster" />
      </div>
    </div>
  );
};

export default GettingStarted;
