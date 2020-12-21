import React from 'react';
import { Button, DownloadArrow, TextWithIcon } from '@ctoec/component-library';

type UploadFileButtonProps = {
  className?: string;
};

export const UploadFileButton: React.FC<UploadFileButtonProps> = ({
  className,
}) => {
  return (
    // Wrap href button in an inline block element so that the
    // whole result is forced into the same vertical plane
    // as the surrounding text
    <div className="display-inline-block">
      <Button
        appearance="unstyled"
        className={className}
        text={
          <TextWithIcon
            Icon={DownloadArrow}
            direction="left"
            text="Upload a file"
          />
        }
        href="/upload"
      />
    </div>
  );
};
