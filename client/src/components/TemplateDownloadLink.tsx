import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';
import { downloadStreamToFile } from '../utils/fileDownload';

export const TemplateDownloadLink = ({ type }: { type?: 'xlsx' | 'csv' }) => {
  const downloadText =
    type === 'csv' ? 'Download .csv Template' : 'Download Excel Template';

  async function downloadTemplate() {
    await downloadStreamToFile(
      `column-metadata/${type}`,
      `ECE Data Collection Template.${type}`
    );
  }

  return (
    <Button
      appearance="unstyled"
      onClick={downloadTemplate}
      className="text-bold margin-bottom-3 display-block"
      external
      text={
        <TextWithIcon
          text={downloadText}
          Icon={DownloadArrow}
          iconSide="left"
          className="text-underline"
        />
      }
    />
  );
};
