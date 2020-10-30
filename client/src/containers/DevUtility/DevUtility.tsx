import React from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';

const DevUtility: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row grid-gap">
        <div className="desktop:grid-col-8">
          <h1 ref={h1Ref}>Templates and sample data for development</h1>
          <h2>Templates</h2>
          <CSVExcelDownloadButton fileType="xlsx" whichDownload="template" />
          <CSVExcelDownloadButton fileType="csv" whichDownload="template" />
          <h2>Complete sample data</h2>
          <CSVExcelDownloadButton fileType="xlsx" whichDownload="example" />
          <CSVExcelDownloadButton fileType="csv" whichDownload="example" />
          <h2>Incomplete sample data</h2>
        </div>
      </div>
    </div>
  );
};

export default DevUtility;
