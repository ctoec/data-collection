import React from 'react';
import { MailToLink } from '../../components/MailToLink';
import { Button } from '@ctoec/component-library';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';

const SubmitSuccess: React.FC = () => {
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row">
        <h1>You've submitted your data to OEC!</h1>
        <h4>Date submitted: </h4>
        <p>
          We'll let you know if any edits are required. If you have any questions, reach out to{' '}
          <MailToLink />
        </p>
      </div>
      <div>
        <strong>
          Want a copy of your enrollment data?
        </strong>
        <CSVDownloadLink />
      </div>
      <div>
        <strong>
          Need to make changes?
        </strong>
        <Button text="Upload another file" href="/upload" />
      </div>
    </div>
  );
};

export default SubmitSuccess;
