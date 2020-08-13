import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';

export const CSVDownloadLink = () => (
  <Button
    appearance="unstyled"
    //  TODO: Have this actual download uploaded data, not the upload template
    //  We'll probably need to generate a CSV on the fly, since I don't think we're
    //  holding uploaded files indefinitely?
    href="/upload_template/ECE Data Collection Template.csv"
    className="text-bold margin-bottom-3 display-block"
    external
    text={
      <TextWithIcon
        text="Download .csv"
        Icon={DownloadArrow}
        iconSide="left"
        className="text-underline"
      />
    }
  />
);
