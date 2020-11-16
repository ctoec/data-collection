import React, { useContext } from 'react';
import cx from 'classnames';
import { stringify } from 'query-string';
import { Button, TextWithIcon, DownloadArrow } from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';

type FileTypeOpts = 'xlsx' | 'csv';
const fileTypeName = {
  xlsx: 'Excel',
  csv: 'CSV',
};

type CSVExcelDownloadButtonProps = {
  whichDownload: 'roster' | 'template' | 'example';
  fileType?: FileTypeOpts;
  queryParamsAsObject?: { [key: string]: any };
  className?: string;
  downloadText?: string;
};

type DownloadOptionsType = {
  downloadText: string;
  backendPath: string;
  fileName: string;
};

const getRosterProps = (): DownloadOptionsType => ({
  downloadText: 'Export roster',
  backendPath: 'export/roster',
  fileName: 'Roster.csv',
});

const getTemplateProps = (fileType: FileTypeOpts): DownloadOptionsType => ({
  downloadText: `Download ${fileTypeName[fileType]} template`,
  backendPath: `template/${fileType}`,
  fileName: `ECE Data Collection Template.${fileType}`,
});

const getExampleProps = (fileType: FileTypeOpts): DownloadOptionsType => ({
  downloadText: `Download ${fileTypeName[fileType]} sample data`,
  backendPath: `template/example/${fileType}`,
  fileName: `Example.${fileType}`,
});

export const CSVExcelDownloadButton: React.FC<CSVExcelDownloadButtonProps> = ({
  whichDownload,
  fileType = 'csv',
  queryParamsAsObject,
  className,
  downloadText: specifiedDownloadText,
}) => {
  const { accessToken } = useContext(AuthenticationContext);

  let options: DownloadOptionsType = getRosterProps();
  if (whichDownload === 'example') {
    options = getExampleProps(fileType);
  } else if (whichDownload === 'template') {
    options = getTemplateProps(fileType);
  }

  const { downloadText: defaultDownloadText, fileName, backendPath } = options;
  const downloadText = specifiedDownloadText || defaultDownloadText;

  const download = async () => {
    await downloadStreamToFile(
      queryParamsAsObject
        ? `${backendPath}?${stringify(queryParamsAsObject)}`
        : backendPath,
      fileName,
      accessToken || ''
    ).catch((err) => console.error(err));
  };

  return (
    <Button
      appearance="unstyled"
      onClick={download}
      className={cx('text-bold display-block', className)}
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
