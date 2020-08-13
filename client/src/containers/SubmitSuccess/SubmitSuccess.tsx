import React from 'react';
import { MailToLink } from '../../components/MailToLink';
import { Button } from '@ctoec/component-library';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';

const SubmitSuccess: React.FC = () => {
  return (
    <div className="grid-container margin-top-4">
      <div>
        <h1>You've submitted your data to OEC!</h1>
        <h5 className="margin-top-1">Date submitted: {new Date().toLocaleDateString()}</h5>
      </div>
      <div className="grid-row">
        <p>
          We'll let you know if any edits are required.<br/>If you have any questions, reach out to<br/>{' '}
          <MailToLink />
        </p>
      </div>
      <div>
        <strong>
          Want a copy of your enrollment data?
        </strong>
      </div>
      <div className="grid-row margin-top-1">
        <CSVDownloadLink />
      </div>
      <div className="grid-row marging-top-4">
        <strong>
          Need to make changes?
        </strong>
      </div>
      <div className="grid-row margin-top-1">
        <Button text="Upload another file" href="/upload" />
      </div>
    </div>
  );
};

export default SubmitSuccess;
