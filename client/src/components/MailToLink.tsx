import React from 'react';

export const mailToLinkProps = {
  href:
    'mailto:oec-data-pilot@skylight.digital?subject=Data%20collection%20bug',
  target: '_blank',
  rel: 'noopener noreferrer',
};

export const MailToLink = ({ text }: { text?: string }) => (
  <a className="usa-button usa-button--unstyled" {...mailToLinkProps}>
    {text || 'oec-data-pilot@skylight.digital'}
  </a>
);
