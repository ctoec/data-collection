import { Alert } from '@ctoec/component-library';
import React from 'react';
import { AddRecordButton } from '../../components/AddRecordButton';
import { Organization } from '../../shared/models';

export const NoRecordsAlert: React.FC = () => (
  <Alert
    heading="No records in your roster"
    type="info"
    text="Get started by adding records to your roster"
    actionItem={<AddRecordButton id="add-record-in-alert" />}
  />
);
