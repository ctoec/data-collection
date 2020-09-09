import React from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';

export const CSVDownloadLink: React.FC = () => {
  async function downloadTemplate() {
    await downloadStreamToFile(
      `column-metadata/csv`,
      `ECE Data Collection Template.csv`
    );
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
