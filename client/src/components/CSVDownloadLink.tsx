import React, { useContext } from 'react';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

/**
 * TODO: Once we have the infrastructure in place to actually
 * submit to OEC, we can swap this out for whatever we use.
 * But until then, we have two ways of downloading information.
 *
 * Note: Leaving props in because the restriction for downloading
 * only the roster data is just for point in time launch; will
 * eventually add the uploaded sheet export back in.
 */
type ExportProps = {
  reportId?: number;
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

  const downloadRoster = async () => {
    await downloadStreamToFile(
      `export/roster`,
      'Roster.csv',
      accessToken || ''
    ).catch((err) => console.error(err));
  };

  return (
    <Button
      appearance="unstyled"
      onClick={downloadRoster}
      className="margin-bottom-3 display-block"
      external
      text={
        <TextWithIcon
          text="Export roster"
          Icon={DownloadArrow}
          iconSide="left"
          className="text-underline"
        />
      }
    />
  );
};
