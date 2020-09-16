import React, { useContext } from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../contexts/UserContext/UserContext';

/**
 * TODO: Once we have the infrastructure in place to actually
 * submit to OEC, we can swap this out for whatever we use.
 * But until then, this is the easiest way to make the call
 * to download the information aware of what children's records
 * were actually just uploaded.
 */
type ExportProps = {
  reportId: number;
};

export const CSVDownloadLink: React.FC<ExportProps> = ({ reportId }) => {
  const { accessToken } = useContext(AuthenticationContext);
  const { user } = useContext(UserContext);

  /**
   * Function that downloads information that the backend puts
   * together in spreadsheet form.
   */
  async function downloadTemplate() {
    console.log(reportId);
    await downloadStreamToFile(
      // `export/csv-upload/${reportId}`,
      `export/csv-upload/${user?.id}`,
      `Uploaded Data.csv`,
      accessToken || ''
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
