import React, { useContext } from 'react';
import { TextWithIcon } from '@ctoec/component-library';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';
import UserContext from '../../contexts/UserContext/UserContext';

const GettingStarted: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const org = (user?.organizations || [])[0] || {};

  return (
    <div className="grid-container margin-top-4">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8">
          <h1 ref={h1Ref}>Hello {user?.firstName}!</h1>
          <p>
            ECE Reporter will allow you to share your state-funded enrollment
            data with the Office of Early Childhood (OEC). OEC uses this data to
            make informed program and policy decisions affecting young children
            and families.
          </p>
          <h2>Sites you manage at {org.providerName}:</h2>
          <ul>
            {(user?.sites || []).map((site) => (
              <li key={site.siteName} className="line-height-body-4">
                {site.siteName}
              </li>
            ))}
          </ul>
          <h2>How to use ECE Reporter</h2>
          <p>
            These instructions guide you through the file upload process to add
            many records at once. If you'd like to add records manually,
            <Link to="/roster/"> you can add them on your roster.</Link>
          </p>
<<<<<<< HEAD
          <h3 className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
              1
            </div>
            Review the data requirements
          </h3>
          <div className="margin-left-6">
            <p>
              Learn more about the data elements ECE Reporter collects for each
              enrollment.
            </p>
            <p>
              <Link
                className="usa-button usa-button--unstyled"
                to="/data-requirements/"
              >
                <TextWithIcon
                  text="See required data"
                  Icon={Arrow}
                  iconSide="right"
                />
              </Link>
            </p>
          </div>
          <h3 className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
              2
            </div>
            Download the data template
          </h3>
          <div className="margin-left-6">
            <p>
              You'll need to enter data in this file to upload in ECE Reporter.
            </p>
            <p>
              <Link className="usa-button usa-button--unstyled" to="/template/">
                <TextWithIcon
                  text="Download the template"
                  Icon={Arrow}
                  iconSide="right"
                />
              </Link>
            </p>
=======
          <div>
            <h2>Download the latest file upload template</h2>
            <CSVExcelDownloadButton
              fileType="xlsx"
              whichDownload="template"
              className="margin-bottom-3"
            />
            <CSVExcelDownloadButton
              fileType="csv"
              whichDownload="template"
              className="margin-bottom-3"
            />
>>>>>>> c7bbbdb6 (Move one nav item)
          </div>
          <h3 className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
              3
            </div>
            Prepare your data
          </h3>
          <div className="margin-left-6">
            <p>Get instructions on how to enter data into OEC's template.</p>
            <p>
              {
                // TODO: Check that this link is the right one to use here / is ready to go
              }
              <Link
                className="usa-button usa-button--unstyled"
                to="https://ece-reporter.documize.com/s/burrnubmbdja9sqnbh6g/ece-reporter-help/d/bv34kdhmdesjli7los1g/how-to-prepare-your-data-for-ece-reporter"
              >
                <TextWithIcon
                  text="See the how-to guide"
                  Icon={Arrow}
                  iconSide="right"
                />
              </Link>
            </p>
          </div>
          <h3 className="display-flex font-body-lg height-5 line-height-body-6 margin-y-0">
            <div className="text-white text-bold text-center bg-primary width-5 radius-pill margin-right-1">
              4
            </div>
            Upload your data
          </h3>
          <div className="margin-left-6">
            <p>
              Once your template is filled out, you'll upload the data to ECE
              Reporter.
            </p>
            <p>
              <Link className="usa-button usa-button--unstyled" to="/upload/">
                <TextWithIcon
                  text="Go to file upload"
                  Icon={Arrow}
                  iconSide="right"
                />
              </Link>
            </p>
          </div>
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
