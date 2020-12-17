import React from 'react';
import cx from 'classnames';
import { Button, DownloadArrow, TextWithIcon } from '@ctoec/component-library';
import { Link } from 'react-router-dom';

type UploadFileButtonProps = {
  className?: string;
};

export const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  className,
}) => {
  // Use block display to ensure correct inline format
  // (e.g. spacing with other buttons and text)
  const formattedClassName = cx('display-block', className);
  return (
    <Button
      appearance="unstyled"
      className={formattedClassName}
      text={
        <Link to="/upload">
          <TextWithIcon
            Icon={DownloadArrow}
            direction="left"
            text="Upload a file"
          />
        </Link>
      }
    />
  );
};
