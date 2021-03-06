import React, { useContext } from 'react';
import cx from 'classnames';
import { stringify } from 'query-string';
import useSWR, { responseInterface } from 'swr';
import {
  Button,
  TextWithIcon,
  FileDownload,
  ButtonProps,
} from '@ctoec/component-library';
import { downloadStreamToFile } from '../utils/fileDownload';
import AuthenticationContext from '../contexts/AuthenticationContext/AuthenticationContext';
import { TemplateMetadataResponse } from '../shared/payloads';

type FileTypeOpts = 'xlsx' | 'csv';
const fileTypeName = {
  xlsx: 'Excel',
  csv: '.csv',
};

type CSVExcelDownloadButtonProps = Omit<ButtonProps, 'text'> & {
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

const getTemplateProps = (
  fileType: FileTypeOpts,
  versionString: string
): DownloadOptionsType => ({
  downloadText: `Download ${fileTypeName[fileType]} template`,
  backendPath: `template/${fileType}`,
  fileName: `ECE Data Collection Template${versionString}.${fileType}`,
});

const getExampleProps = (
  fileType: FileTypeOpts,
  versionString: string
): DownloadOptionsType => ({
  downloadText: `Download ${fileTypeName[fileType]} sample data`,
  backendPath: `template/example/${fileType}`,
  fileName: `Example${versionString}.${fileType}`,
});

export const CSVExcelDownloadButton: React.FC<CSVExcelDownloadButtonProps> = ({
  whichDownload,
  fileType = 'csv',
  queryParamsAsObject,
  className,
  downloadText: specifiedDownloadText,
  ...buttonProps
}) => {
  const { accessToken } = useContext(AuthenticationContext);

  const { data: templateMetadata } = useSWR('template/metadata', {
    dedupingInterval: 100000,
  }) as responseInterface<TemplateMetadataResponse, string>;

  const versionString = templateMetadata?.version
    ? ` (v${templateMetadata.version})`
    : '';

  let options: DownloadOptionsType = getRosterProps();
  if (whichDownload === 'example') {
    options = getExampleProps(fileType, versionString);
  } else if (whichDownload === 'template') {
    options = getTemplateProps(fileType, versionString);
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
    ).catch((err) => {
      throw new Error(err);
    });
  };

  return (
    <Button
      appearance="unstyled"
      onClick={download}
      className={cx('display-block', className)}
      external
      text={
        <TextWithIcon text={downloadText} Icon={FileDownload} iconSide="left" />
      }
      {...buttonProps}
    />
  );
};
