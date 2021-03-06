import { Card, DoubleClipboard } from '@ctoec/component-library';
import React from 'react';
import { AddRecordButton } from '../../components/AddRecordButton';
import { UploadFileButton } from '../../components/UploadFileButton';

type EmptyRosterCardProps = {
  boldText: string;
};

export const EmptyRosterCard: React.FC<EmptyRosterCardProps> = ({
  boldText,
}) => {
  return (
    <Card>
      <div className="grid-container">
        <div className="display-flex flex-column flex-align-center">
          <div className="grid-row">
            <DoubleClipboard />
          </div>
          <p className="grid-row text-bold font-body-lg">{boldText}</p>
          <span className="grid-row line-height-body-4">
            To update your roster, &nbsp;
            <AddRecordButton id="empty-roster-add-buton" /> &nbsp; individually
          </span>
          <span className="grid-row line-height-body-4">
            or &nbsp; <UploadFileButton /> &nbsp; with many records at once.
          </span>
        </div>
      </div>
    </Card>
  );
};
