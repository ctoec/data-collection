import React, { useContext } from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadAuthorizedStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

type ExportProps = {
  submittedIds: string[];
};

export const CSVDownloadLink: React.FC<ExportProps> = ({ submittedIds }) => {
  console.log(submittedIds);

  async function downloadTemplate() {
    await downloadAuthorizedStreamToFile(
      `export/csv-upload/${submittedIds}`,
      accessToken || '',
      `Uploaded Data.csv`
    ).then((resp) => console.log(resp));
  }

  return (
    <Button
      appearance="unstyled"
      //  TODO: Have this actual download uploaded data, not the upload template
      //  We'll probably need to generate a CSV on the fly, since I don't think we're
      //  holding uploaded files indefinitely?
      onClick={downloadTemplate}
      className="text-bold margin-bottom-3 display-block"
      external
      text={
        <TextWithIcon
          text="Download.csv"
          Icon={DownloadArrow}
          iconSide="left"
          className="text-underline"
        />
      }
    />
  );
};
