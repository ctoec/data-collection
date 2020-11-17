import React from 'react';
import { AlertProps } from '@ctoec/component-library';
import { MailToLink } from '../components/MailToLink';

export const defaultErrorBoundaryProps: AlertProps = {
  type: 'error',
  heading: 'Something went wrong',
  text: 'Please send our team an email so we can fix the problem!',
  actionItem: <MailToLink />,
};
