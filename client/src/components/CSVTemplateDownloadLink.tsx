import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';

export const CSVTemplateDownloadLink = () => (
  <Button
    appearance="unstyled"
    href="/upload_template/ECE Data Collection Template.csv"
    className="text-bold margin-bottom-3 display-block"
    external
    text={
      <TextWithIcon
        text="Download .csv template"
        Icon={DownloadArrow}
        iconSide="left"
        className="text-underline"
      />
    }
  />
);
