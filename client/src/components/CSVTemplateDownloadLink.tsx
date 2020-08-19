import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';
import { apiGet } from '../utils/api';

export const CSVTemplateDownloadLink = () => {
  const downloadCsvTemplate = () => {
    return apiGet('template/csv');
  };

  return (
    <Button
      appearance="unstyled"
      onClick={downloadCsvTemplate}
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
};
