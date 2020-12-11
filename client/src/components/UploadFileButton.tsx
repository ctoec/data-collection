import React from 'react';
import { DownloadArrow, TextWithIcon } from '@ctoec/component-library';
import { Link } from 'react-router-dom';

type UploadFileButtonProps = {
  className?: string;
};

export const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  className,
}) => {
  return (
    <Link
      to="/upload"
      className={className + ' usa-button usa-button--unstyled'}
    >
      <TextWithIcon Icon={DownloadArrow} text="Upload a file" />
    </Link>
  );
};
