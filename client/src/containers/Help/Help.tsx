import React from 'react';
import { Button, Alert } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { CSVExcelDownloadButton } from '../../components/CSVExcelDownloadButton';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';
import { BackButton } from '../../components/BackButton';

const Help: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8">
          <h1 ref={h1Ref}>Help and Support</h1>
          <p>
            To get support with ECE Reporter, you can either browse our how-to
            guides or reach out to the support team.
          </p>
          <Alert
            heading="Help keep children's data safe and secure"
            type="info"
            text={
              <span>
                Don't share any personally identifying child information over
                the support form or email.
              </span>
            }
          />
        </div>
      </div>
      <div className="grid-row"></div>
    </div>
  );
};

export default Help;
