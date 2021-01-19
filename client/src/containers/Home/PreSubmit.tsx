import { Alert } from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';
import { apiGet } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { HowToUseStep } from './HowToUseStep';
import { mapFundingSpacesToCards } from './utils/mapFundingSpacesToCards';

export const PreSubmitHome: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const h1Ref = getH1RefForTitle();
  const orgAccess = user?.accessType === 'organization';
  const userOrgs = user?.organizations || [];
  const showFundingsAndSites = orgAccess && userOrgs.length == 1;

  // We might have a success alert pushed from the revision request
  // form, so check whether we do (but filter so that we only show
  // one if a user submits multiple forms)
  const [alertFromRevision, setAlertFromRevision] = useState<boolean>();
  const { setAlerts, alertElements } = useAlerts();
  // let alertToShow;
  useEffect(() => {
    setAlerts((_alerts) => [
      _alerts.find((a) => a?.heading === 'Request received!'),
    ]);
    // alertToShow = alerts.find((a) => a?.heading === "Request received!");
    // console.log(alertToShow);
    // if (alertToShow) setAlerts([alertToShow]);
  }, []);

  console.log(alertElements);
  const [fundingSpacesDisplay, setFundingSpacesDisplay] = useState();

  useEffect(() => {
    // Determine the funding spaces map for the organization, if
    // the user has the permissions that enable this
    if (showFundingsAndSites) {
      apiGet('children?fundingMap=true', accessToken)
        .then((res) => {
          setFundingSpacesDisplay(res.fundingSpacesMap);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [accessToken, showFundingsAndSites]);

  let fundingCards = mapFundingSpacesToCards(fundingSpacesDisplay);
  const fundingSection = (
    <>
      <h3 className="pre-submit-h3">Funding spaces</h3>
      <div className="three-column-layout">{fundingCards}</div>
      <div className="margin-top-4 margin-bottom-4">
        <Divider />
      </div>
    </>
  );

  const siteSection = (
    <>
      <h3 className="pre-submit-h3">Sites</h3>
      <ul>
        {(user?.sites || []).map((site) => (
          <li key={site.siteName} className="line-height-body-4">
            {site.siteName}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="Home grid-container margin-top-4">
      {alertElements.length > 0 && alertElements}
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8 margin-top-4">
          <h1 ref={h1Ref} className="margin-top-0">
            Hello {user?.firstName}!
          </h1>
          <p>
            ECE Reporter will allow you to share your state-funded enrollment
            data with the Office of Early Childhood (OEC). Make sure the site
            names and funding spaces below are accurate before you start
            entering data.
          </p>
          <h2 className="pre-submit-h2">
            Your managed sites and funding spaces
          </h2>
        </div>
        <div className="tablet:grid-col-4 margin-top-4 img" role="presentation">
          <Image />
        </div>
      </div>
      <Alert
        type="info"
        text={
          <span>
            Are your sites and/or funding spaces incorrect? Reach out to the ECE
            Reporter team through &nbsp;
            <Link to="/revision">this form.</Link>
          </span>
        }
      />
      {showFundingsAndSites && siteSection}
      {showFundingsAndSites && fundingSection}
      <h2 className="pre-submit-h2">How to use ECE Reporter</h2>
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
              linkTo="https://help.ece-reporter.ctoec.org/prepare-your-data/"
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
  );
};
