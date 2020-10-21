import React from 'react';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { ReactComponent as Image } from '../../images/SpreadsheetIllustration.svg';

const TemplateDownload: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row grid-gap">
        <div className="desktop:grid-col-8">
          <h1 ref={h1Ref}>Batch upload data template</h1>
          <p>
            You can use this template to batch upload many enrollment records to
            ECE Reporter.
          </p>
          <CSVExcelDownloadButton fileType="xlsx" whichDownload="template" />
          <CSVExcelDownloadButton fileType="csv" whichDownload="template" />
          <h2>Sample data</h2>
          <p>
            We created a sample set of data to show how to format enrollment
            records for batch uploading.
          </p>
          <CSVExcelDownloadButton fileType="xlsx" whichDownload="example" />
          <CSVExcelDownloadButton fileType="csv" whichDownload="example" />
          <h2>Data requirements</h2>
          <p>
            See all required data fields, definitions and rationale in{' '}
            <Link
              className="usa-button usa-button--unstyled"
              to="/data-requirements"
            >
              OEC's enrollment data requirements.
            </Link>
          </p>
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
    </div>
  );
};

export default TemplateDownload;
