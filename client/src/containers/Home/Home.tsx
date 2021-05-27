import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import pluralize from 'pluralize';
import { AddRecordButton } from '../../components/AddRecordButton';
import { Link } from 'react-router-dom';
import {
  Alert,
  ArrowRight,
  Card,
  TextWithIcon,
  Divider,
  Button,
  LoadingWrapper,
} from '@ctoec/component-library';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { mapFundingSpacesToCards } from './utils/mapFundingSpacesToCards';
import { NestedFundingSpaces } from '../../shared/payloads/NestedFundingSpaces';
import { ReactComponent as Image } from '../../images/PersonWithSpreadsheet.svg';

const Home: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const h1Ref = getH1RefForTitle();
  const orgAccess = user?.accessType === 'organization';
  const userOrgs = user?.organizations || [];
  const showFundings = orgAccess && userOrgs.length == 1;

  // We might have a success alert pushed from the revision request
  // form, so check whether we do (but filter so that we only show
  // one if a user submits multiple forms)
  const [alertElements, setAlerts] = useAlerts();
  useEffect(() => {
    setAlerts((_alerts) => [
      _alerts.find((a) => a?.heading === 'Request received!'),
    ]);
  }, []);

  // Count how many children are in the roster so we can format the display
  const [userRosterCount, setUserRosterCount] = useState(undefined);
  const [
    fundingSpacesDisplay,
    setFundingSpacesDisplay,
  ] = useState<NestedFundingSpaces>();
  const [siteCountDisplay, setSiteCountDisplay] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet(`children/metadata?showFundings=${showFundings}`, accessToken)
      .then(({ count, fundingSpacesMap, siteCountMap }) => {
        setUserRosterCount(count);
        // Get the site count data structure, too, so we can divide up
        // user-accessible sites into individual cards
        setSiteCountDisplay(siteCountMap);

        // Also determine the funding spaces map for the organization, if
        // the user has the permissions that enable this
        if (showFundings && fundingSpacesMap) {
          setFundingSpacesDisplay(fundingSpacesMap);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => setLoading(false));

    (async function checkSubmitStatus() {
      if (user && accessToken) {
        const { allSubmitted } = await apiGet(
          'oec-report/are-all-orgs-submitted',
          accessToken
        );

        if (!allSubmitted) {
          setAlerts((_alerts) => [
            ..._alerts,
            {
              type: 'warning',
              text: (
                <>
                  Once you have made updates to your roster,{' '}
                  <Link to="/roster">confirm</Link> that your Jan - May data
                  collection is complete.
                </>
              ),
              heading: 'Please update your roster by June 10',
            },
          ]);
        }
      }
    })();
  }, [user, accessToken]);

  return (
    <LoadingWrapper loading={loading}>
      <div className="Home grid-container margin-top-4">
        {alertElements.length > 0 && alertElements}
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-8 margin-top-4">
            <h1 ref={h1Ref} className="margin-top-0">
              Hello {user?.firstName}!
            </h1>
            <p>
              The Office of Early Childhood’s ECE Reporter is an easy and secure
              way for you to submit state-funded child enrollment data every
              month. You can use it to track all new enrollments and withdrawals
              and changes to age group, site, and funding.
            </p>
            <h2 className="pre-submit-h2">
              Your managed sites and funding spaces
            </h2>
          </div>
          <div
            className="tablet:grid-col-4 margin-top-4 img"
            role="presentation"
          >
            <Image />
          </div>
        </div>
        <Alert
          type="info"
          text={
            <span>
              Are your sites and/or funding spaces incorrect? Reach out to the
              ECE Reporter team through&nbsp;
              <Link to="/revision">this form.</Link>
            </span>
          }
        />
        <div className="margin-top-3 margin-bottom-1">
          <Divider />
        </div>
        {userOrgs.map((org) => (
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-10">
              <h2>{org.providerName}</h2>
              <p className="font-body-lg text-base-darker">
                {`${userRosterCount} active ${pluralize(
                  'enrollment',
                  userRosterCount,
                  false
                )} across ${pluralize(
                  'site',
                  (user?.sites || []).length,
                  true
                )}`}
              </p>
              <AddRecordButton
                id="home-page-add-enrollment"
                appearance="default"
              />
            </div>
            <div className="margin-top-4 tablet:grid-col-2">
              <Button
                appearance="unstyled"
                href="/roster"
                text={
                  <TextWithIcon
                    text="View roster"
                    iconSide="right"
                    Icon={ArrowRight}
                    direction="right"
                    className="text-underline"
                  />
                }
              />
            </div>
          </div>
        ))}
        <div className="margin-top-4 margin-bottom-4">
          <Divider />
        </div>
        {showFundings && fundingSpacesDisplay && (
          <>
            <h2>Funding spaces</h2>
            <div className="three-column-layout">
              {mapFundingSpacesToCards(fundingSpacesDisplay)}
            </div>
            <div className="margin-top-4 margin-bottom-4">
              <Divider />
            </div>
          </>
        )}
        {(siteCountDisplay || []).length > 0 ? (
          <>
            <h2>Sites</h2>
            <div className="three-column-layout">
              {(siteCountDisplay || []).map((s: any) => (
                <div className="desktop:grid-col-4 three-column-card">
                  <Card>
                    <div className="padding-0">
                      <h3>{s.siteName}</h3>
                      <p className="text-base-darker">
                        {pluralize('enrollment', s.count, true)}
                      </p>
                      <Link
                        to={`/roster?organizationId=${s.orgId}&site=${s.siteId}`}
                      >
                        <TextWithIcon
                          text="View site roster"
                          iconSide="right"
                          Icon={ArrowRight}
                          direction="right"
                        />
                      </Link>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="pre-submit-h3">Sites</h3>
            <ul className="margin-left-2 bx--list--unordered">
              {(user?.sites || []).map((site) => (
                <li
                  key={site.siteName}
                  className="line-height-body-4 bx--list__item"
                >
                  {site.siteName}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </LoadingWrapper>
  );
};

export default Home;
