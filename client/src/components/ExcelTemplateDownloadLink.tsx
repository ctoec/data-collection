import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';
import { downloadStreamToFile } from '../utils/fileDownload';

export const ExcelTemplateDownloadLink = () => {
  async function downloadExcelTemplate() {
    await downloadStreamToFile('column-metadata/xlsx', 'ECE Data Collection Template.xlsx')
  }

  return (
  <Button
    appearance="unstyled"
    onClick={downloadExcelTemplate}
    className="text-bold margin-bottom-3 display-block"
    external
    text={
      <TextWithIcon
        text="Download Excel template"
        Icon={DownloadArrow}
        iconSide="left"
        className="text-underline"
      />
    }
  />
);
}
