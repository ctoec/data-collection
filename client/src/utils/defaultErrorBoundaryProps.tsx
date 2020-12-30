import React from 'react';
import { AlertProps, Button } from '@ctoec/component-library';
import { MailToLink } from '../components/MailToLink';
import { Link } from 'react-router-dom';

export const defaultErrorBoundaryProps: AlertProps = {
  type: 'error',
  heading: 'Something went wrong',
  text: (
    <>
      Please send our team an email so we can fix the problem! In the meantime,{' '}
      <Button
        text="refresh the page"
        appearance="unstyled"
        onClick={() => window.location.reload()}
      />{' '}
      or <Link to="/roster">navigate back to your roster</Link>.
    </>
  ),
  actionItem: <MailToLink />,
};
