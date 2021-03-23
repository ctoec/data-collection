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
  InlineIcon,
  TextWithIcon,
  Divider,
  Button,
} from '@ctoec/component-library';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import UserContext from '../../contexts/UserContext/UserContext';
import { mapFundingSpacesToCards } from './utils/mapFundingSpacesToCards';
import { NestedFundingSpaces } from '../../shared/payloads/NestedFundingSpaces';

export const PostSubmitHome: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const h1Ref = getH1RefForTitle();
  const orgAccess = user?.accessType === 'organization';
  const userOrgs = user?.organizations || [];
  const showFundings = orgAccess && userOrgs.length == 1;

  // Count how many children are in the roster so we can format the display
  const [userRosterCount, setUserRosterCount] = useState(undefined);
  const [
    fundingSpacesDisplay,
    setFundingSpacesDisplay,
  ] = useState<NestedFundingSpaces>();
  const [siteCountDisplay, setSiteCountDisplay] = useState();
  useEffect(() => {
    apiGet(`children/metadata?showFundings=${showFundings}`, accessToken)
      .then(({ count, fundingSpacesMap, siteCountMap }) => {
        setUserRosterCount(count);
        // Get the site count data structure, too, so we can divide up
        // user-accessible sites into individual cards
        setSiteCountDisplay(siteCountMap);

        // Also determine the funding spaces map for the organization, if
        // the user has the permissions that enable this
        if (fundingSpacesMap) {
          setFundingSpacesDisplay(fundingSpacesMap);
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [accessToken]);

  return (
    <div className="grid-container margin-top-4">
      <h1 ref={h1Ref} className="margin-top-0">
        Hello {user?.firstName}!
      </h1>
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
              )} across ${pluralize('site', (user?.sites || []).length, true)}`}
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
      <h2>Updates and tasks</h2>
      <Alert
        type="info"
        text={
          <span>
            Are your sites and/or funding spaces incorrect? Reach out to the ECE
            Reporter team through&nbsp;
            <Link to="/revision">this form.</Link>
          </span>
        }
      />
      <div className="grid-row margin-top-2">
        <Card>
          <div className="grid-container padding-0">
            <span className="grid-row font-body-lg text-bold">
              <div className="text-center">
                <InlineIcon icon="complete" />
              </div>
              Thank you for completing your July to December 2020 data
              collection!
            </span>
            <p className="grid-row">
              OEC appreciates all that you do to improve the lives of children
              and families.
            </p>
            <h3 className="grid-row">What's next?</h3>
            <p className="grid-row margin-bottom-1em">
              Keep your roster updated with new enrollments and withdrawals, and
              with age group, site, and funding changes.
            </p>
            <p className="grid-row">
              We're working on a feature to allow updating from excel files.
              Until then, you can make any needed changes directly in your ECE
              Reporter roster.
            </p>
          </div>
        </Card>
      </div>
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
                <Link to={`/roster?organization=${s.orgId}&site=${s.siteId}`}>
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
    </div>
  );
};
