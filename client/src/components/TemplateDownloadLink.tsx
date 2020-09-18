import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';
import { downloadStreamToFile } from '../utils/fileDownload';

type TemplateDownloadLinkProps = {
  type?: 'xlsx' | 'csv';
  nav?: boolean;
};

export const TemplateDownloadLink = ({
  type,
  nav,
}: TemplateDownloadLinkProps) => {
  let downloadText =
    type === 'csv' ? 'Download .csv Template' : 'Download Excel Template';

  async function downloadTemplate() {
    await downloadStreamToFile(
      `template/${type}`,
      `ECE Data Collection Template.${type}`
    );
  }

  if (nav) {
    downloadText = type === 'csv' ? '.csv' : 'Excel';

    return (
      <Button
        appearance="unstyled"
        onClick={downloadTemplate}
        text={downloadText}
      />
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
