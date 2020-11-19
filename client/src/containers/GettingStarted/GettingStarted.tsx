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
        <div className="tablet:grid-col-8">
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
          <h3>Data collection period</h3>
          <p>
            You must submit your data to OEC by 03/05/2021. The data collection
            period begins 07/01/2020 and continues through at least 01/01/2021.
          </p>
          <div>
            <h2>Download the latest batch upload template</h2>
            <CSVExcelDownloadButton
              fileType="xlsx"
              whichDownload="template"
              className="margin-bottom-3"
            />
            <CSVExcelDownloadButton
              fileType="csv"
              whichDownload="template"
              className="margin-bottom-3"
            />
          </div>
          <div className="display-block">
            <p>You can see a completed example template here:</p>
            <CSVExcelDownloadButton
              fileType="xlsx"
              whichDownload="example"
              className="margin-bottom-3"
            />
            <CSVExcelDownloadButton
              fileType="csv"
              whichDownload="example"
              className="margin-bottom-3"
            />
          </div>
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
      <div className="grid-row">
        <Button
          text="Go to file upload"
          href="/upload"
          className="margin-top-2"
        />
        <Button text="Go to roster" href="/roster" className="margin-top-2" />
      </div>
    </div>
  );
};

export default GettingStarted;
