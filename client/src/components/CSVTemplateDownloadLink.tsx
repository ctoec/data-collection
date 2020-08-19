import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as DownloadArrow } from '@ctoec/component-library/dist/assets/images/download.svg';
import { apiGet } from '../utils/api';

import { saveAs } from 'file-saver';
import { parse, ContentDisposition } from 'content-disposition';

const DEFAULT_CSV_TEMPLATE_NAME = "ECE Data Collection Template.csv";

export const CSVTemplateDownloadLink = () => {
  async function downloadCsvTemplate() {
    const res: Response = await apiGet('template/csv', { jsonParse: false });
    const fileBlob: Blob = await res.blob();

    saveAs(fileBlob, parseFileName(res));
  }

  function parseFileName(res: Response): string {
    const cdHeader = res.headers.get('Content-Disposition');

    if (cdHeader) {
      const cd: ContentDisposition = parse(cdHeader);

      if (cd && cd.parameters && cd.parameters.fileName) {
        return cd.parameters.fileName;
      }
    }

    return DEFAULT_CSV_TEMPLATE_NAME;
  }

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
