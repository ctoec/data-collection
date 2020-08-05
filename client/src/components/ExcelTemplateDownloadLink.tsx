import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';

export const ExcelTemplateDownloadLink = () => (
  <Button
    appearance="unstyled"
    href="/upload_template/ECE Data Collection Template.xlsx"
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
