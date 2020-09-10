import React from 'react';
import moment from 'moment';
import { MailToLink } from '../../components/MailToLink';
import {
  Button,
  TextWithIcon,
  ArrowRight as Arrow,
} from '@ctoec/component-library';
import { CSVDownloadLink } from '../../components/CSVDownloadLink';
import LogoWithCheckSrc from '@ctoec/component-library/dist/assets/images/logoWithCheck.svg';

import { Link } from 'react-router-dom';

const SubmitSuccess: React.FC = () => {
  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row text-bold">
        <Link to="/check-data">
          <TextWithIcon
            text="Back"
            Icon={Arrow}
            direction="left"
            iconSide="left"
          />
        </Link>
      </div>
      <div className="tablet:grid-col-auto margin-top-2 margin-bottom-2">
        <img src={LogoWithCheckSrc} alt="" />
      </div>
      <div>
        <h1>You've submitted your data to OEC!</h1>
        <p className="margin-top-1 text-bold">
          Date submitted: {moment.utc().format('MM/DD/YYYY')}
        </p>
      </div>
      <div className="grid-row">
        <p>
          We'll let you know if any edits are required.
          <br />
          If you have any questions, reach out to
          <br /> <MailToLink />
        </p>
      </div>
      <div className="grid-row margin-top-2">
        <strong>Want a copy of your enrollment data?</strong>
      </div>
      <div className="grid-row margin-top-1 margin-bottom-2">
        <CSVDownloadLink />
      </div>
      <div className="grid-row marging-top-6">
        <strong>Need to make changes?</strong>
      </div>
      <div className="grid-row margin-top-1">
        <Button text="Upload another file" href="/upload" />
      </div>
    </div>
  );
};

export default SubmitSuccess;
