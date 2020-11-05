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
          <h2>Complete sample data</h2>
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
          <h2>Incomplete sample data</h2>
          <h3>Some children missing some fields</h3>
          <CSVExcelDownloadButton
            fileType="xlsx"
            whichDownload="example"
            className="margin-bottom-3"
            queryParamsAsObject={{ whichFakeChildren: 'missingSome' }}
            downloadText="Download Excel of some children missing data"
          />
          <CSVExcelDownloadButton
            fileType="csv"
            whichDownload="example"
            className="margin-bottom-3"
            queryParamsAsObject={{ whichFakeChildren: 'missingSome' }}
            downloadText="Download CSV of some children missing data"
          />
          <h3>All children missing one field</h3>
          <CSVExcelDownloadButton
            fileType="xlsx"
            whichDownload="example"
            className="margin-bottom-3"
            queryParamsAsObject={{ whichFakeChildren: 'missingOne' }}
            downloadText="Download Excel of all children missing one field"
          />
          <CSVExcelDownloadButton
            fileType="csv"
            whichDownload="example"
            className="margin-bottom-3"
            queryParamsAsObject={{ whichFakeChildren: 'missingOne' }}
            downloadText="Download CSV of all children missing one field"
          />
        </div>
      </div>
    </div>
  );
};

export default DevUtility;
