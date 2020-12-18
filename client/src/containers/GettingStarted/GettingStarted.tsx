import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';
import UserContext from '../../contexts/UserContext/UserContext';
import { HowToUseStep } from './HowToUseStep';

const GettingStarted: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const org = (user?.organizations || [])[0] || {};

  return (
    <div className="GettingStarted grid-container margin-top-4">
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
            {
              "These instructions guide you through the file upload process to add many records at once. If you'd like to add records manually, "
            }
            <Link to="/roster/"> you can add them on your roster</Link>.
          </p>
          <ol className="how-to-list">
            <li key="review-requirements" className="how-to-step">
              <HowToUseStep
                stepHeader="Review the data requirements"
                paragraphText="Learn more about the data elements ECE Reporter collects for each enrollment."
                buttonText="See required data"
                linkTo="/data-requirements/"
              />
            </li>
            <li key="download-template" className="how-to-step">
              {
                <HowToUseStep
                  stepHeader="Download the data template"
                  paragraphText="You'll need to enter data in this file to upload in ECE Reporter."
                  buttonText="Download the template"
                  linkTo="/template/"
                />
              }
            </li>
            <li key="prepare-data" className="how-to-step">
              {
                <HowToUseStep
                  stepHeader="Prepare your data"
                  paragraphText="Get instructions on how to enter data into OEC's template."
                  buttonText="See the how-to guide"
                  linkTo="https://ece-reporter.documize.com/s/burrnubmbdja9sqnbh6g/ece-reporter-help/d/bv34kdhmdesjli7los1g/how-to-prepare-your-data-for-ece-reporter"
                />
              }
            </li>
            <li key="upload" className="how-to-step">
              {
                <HowToUseStep
                  stepHeader="Upload your data"
                  paragraphText="Once your template is filled out, you'll upload the data to ECE Reporter."
                  buttonText="Go to file upload"
                  linkTo="/upload/"
                />
              }
            </li>
          </ol>
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <Image />
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
