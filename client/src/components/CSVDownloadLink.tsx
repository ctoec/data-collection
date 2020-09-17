import React, { useContext } from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../contexts/UserContext/UserContext';

/**
 * TODO: Once we have the infrastructure in place to actually
 * submit to OEC, we can swap this out for whatever we use.
 * But until then, we have two ways of downloading information.
 */
type ExportProps = {
  reportId: number;
};

/**
 * TODO: The ability to fetch all children with enrollments at all
 * sites the user has access to is implemented. We just use the
 * enrollment report version of the API call here because it gives
 * the user a snapshot of the data they updated. Once roster is done,
 * we can add the export by user sites to that page.
 */
export const CSVDownloadLink: React.FC<ExportProps> = ({ reportId }) => {
  const { accessToken } = useContext(AuthenticationContext);
  const { user } = useContext(UserContext);

  /**
   * Function that downloads information that the backend puts
   * together in spreadsheet form.
   */
  async function downloadTemplate() {
    await downloadStreamToFile(
      // `export/csv-upload-report/${reportId}`,
      `export/csv-upload-user/${user?.id}`,
      `Uploaded Data.csv`,
      accessToken || ''
    ).catch((err) => console.error(err));
  }

  return (
    <Button
      appearance="unstyled"
      //  TODO: Have this actual download uploaded data, not the upload template
      //  We'll probably need to generate a CSV on the fly, since I don't think we're
      //  holding uploaded files indefinitely?
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
