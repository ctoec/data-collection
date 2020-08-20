import React from 'react';

export const MailToLink = ({ text }: { text?: string }) => (
  // TODO: MAKE THE BODY CONTAIN USEFUL INFORMATION LIKE URL?
  // TODO: MAKE THIS SEPARATE COMPONENT IN COMPONENT LIBRARY?
  <a
    href="mailto:oec-data-pilot@skylight.digital?subject=Data%20collection%20bug"
    target="_blank"
    rel="noopener noreferrer"
  >
    {text || 'oec-data-pilot@skylight.digital'}
  </a>
);
