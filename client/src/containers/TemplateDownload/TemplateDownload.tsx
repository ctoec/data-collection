import React, { useEffect, useState } from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { ReactComponent as Image } from '../../images/SpreadsheetIllustration.svg';
import { BackButton } from '../../components/BackButton';
import { apiGet } from '../../utils/api';

const TemplateDownload: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const [lastUpdated, setLastUpdated] = useState();
  useEffect(() => {
    if (lastUpdated) return;
    apiGet('/template/metadata')
      .then((res) => {
        setLastUpdated(res.lastUpdated.format('MMMM DD, YYYY'));
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  return (
    <div className="grid-container">
      <BackButton />
      <div className="grid-row grid-gap border-bottom border-base-lighter padding-bottom-2">
        <div className="tablet:grid-col-8">
          <h1 ref={h1Ref}>File upload template</h1>
          {lastUpdated && (
            <p>
              Last updated: <span className="text-bold">{lastUpdated}</span>
            </p>
          )}
          <p>
            You can use this template to upload many enrollment records to ECE
            Reporter.
          </p>
          <CSVExcelDownloadButton
            fileType="xlsx"
            whichDownload="template"
            className="margin-bottom-3"
            appearance="default"
          />
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
      <div className="border-bottom border-base-lighter padding-bottom-2">
        <h2>View a completed sample template</h2>
        <p>
          This spreadsheet shows what a filled out data template will look like.
        </p>
        <CSVExcelDownloadButton
          fileType="xlsx"
          whichDownload="example"
          className="margin-bottom-3"
        />
      </div>
      <h2 className="font-body-md">Need .csv file formats?</h2>
      <p>Use this file format if you cannot open Microsoft Excel files.</p>
      <CSVExcelDownloadButton
        fileType="csv"
        whichDownload="template"
        className="margin-bottom-3"
      />
      <CSVExcelDownloadButton
        fileType="csv"
        whichDownload="example"
        className="margin-bottom-3"
      />
    </div>
  );
};

export default TemplateDownload;
