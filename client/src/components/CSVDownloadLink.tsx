import React, { useContext } from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadAuthorizedStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

/**
 * TODO: Once we have the infrastructure in place to actually
 * submit to OEC, we can swap this out for whatever we use.
 * But until then, this is the easiest way to make the call
 * to download the information aware of what children's records
 * were actually just uploaded.
 */
type ExportProps = {
  submittedIds: string;
};

export const CSVDownloadLink: React.FC<ExportProps> = ({ submittedIds }) => {
  const { accessToken } = useContext(AuthenticationContext);

  /**
   * Function that downloads information that the backend puts
   * together in spreadsheet form.
   */
  // console.log(submittedIds);
  async function downloadTemplate() {
    await downloadAuthorizedStreamToFile(
      `export/csv-upload/${submittedIds}`,
      accessToken || '',
      `Uploaded Data.csv`
    ).catch((err) => console.error(err));
  }

  return (
    <Button
      appearance="unstyled"
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
