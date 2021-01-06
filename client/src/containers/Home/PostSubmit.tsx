import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import pluralize from 'pluralize';
import { AddRecordButton } from '../../components/AddRecordButton';
import { Link, useHistory } from 'react-router-dom';
import {
  ArrowRight,
  Card,
  InlineIcon,
  TextWithIcon,
} from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import UserContext from '../../contexts/UserContext/UserContext';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

export const PostSubmitHome: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const orgAccess = user?.accessType === 'organization';
  const userOrgs = user?.organizations || [];
  const showFundings = orgAccess && userOrgs.length == 1;

  // Count how many children are in the roster so we can format the display
  const [userRosterCount, setUserRosterCount] = useState(undefined);
  const [fundingSpacesDisplay, setFundingSpacesDisplay] = useState();
  const [siteCountDisplay, setSiteCountDisplay] = useState();
  useEffect(() => {
    apiGet('children?count=true', accessToken)
      .then((res) => setUserRosterCount(res.count))
      .catch((err) => {
        throw new Error(err);
      });

    // Get the site count data structure, too, so we can divide up
    // user-accessible sites into individual cards
    apiGet('children?siteMap=true', accessToken)
      .then((res) => setSiteCountDisplay(res.siteCountMap))
      .catch((err) => {
        throw new Error(err);
      });

    // Also determine the funding spaces map for the organization, if
    // the user has the permissions that enable this
    if (showFundings) {
      apiGet('children?fundingMap=true', accessToken)
        .then((res) => {
          setFundingSpacesDisplay(res.fundingSpacesMap);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [accessToken]);

  // Map each calculated funding space distribution into a card
  // element that we can format for display
  let fundingCards = (fundingSpacesDisplay || []).map((fsd: any) => (
    <div className="desktop:grid-col-4 three-column-card">
      <Card>
        <div className="padding-0">
          <h3>{fsd.sourceName}</h3>
          {fsd.includedAgeGroups.map((ag: any) => (
            <>
              <div>
                <p className="text-bold">{ag.ageGroup}</p>
              </div>
              <>
                {ag.includedTimes.map((t: any) => {
                  // Account for fundings that have negative capacities stored
                  let spaceNumbers = `${t.filled}`;
                  if (t.capacity !== -1) spaceNumbers += `/${t.capacity} `;
                  else spaceNumbers += ` `;
                  return (
                    <p className="text-base-darker padding-0 margin-0">
                      <b>{spaceNumbers}</b>
                      {` ${t.timeType}`}
                    </p>
                  );
                })}
              </>
            </>
          ))}
        </div>
      </Card>
    </div>
  ));

  // Use flexbox styling to distribute the cards across three columns
  // (leaving space for some aesthetic padding), and then box the whole
  // thing up in a section that we can show or not show
  const fundingSection = (
    <>
      <h2>Funding spaces</h2>
      <div className="three-column-layout">{fundingCards}</div>
      <div className="margin-top-4 margin-bottom-4">
        <Divider />
      </div>
    </>
  );

  // Use same flexbox styling to create and distribute site cards
  // that show enrollment counts by site as well as view site
  // rosters
  let siteCards = (siteCountDisplay || []).map((s: any) => (
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
  ));

  return (
    <div className="grid-container margin-top-4">
      <h1 ref={h1Ref}>Your data is complete!</h1>
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
            <Link to="/roster">
              <TextWithIcon
                text="View roster"
                iconSide="right"
                Icon={ArrowRight}
                direction="right"
              />
            </Link>
          </div>
        </div>
      ))}
      <div className="margin-top-4 margin-bottom-4">
        <Divider />
      </div>
      <h2>Updates and tasks</h2>
      <div className="grid-row">
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
            <span className="grid-row margin-bottom-1em">
              Keep your roster updated with new enrollments and withdrawals, and
              with age group, site, and funding changes.
            </span>
            <span className="grid-row">
              We're working on a feature to allow updating from excel files.
              Until then, you can make any needed changes directly in your ECE
              Reporter roster.
            </span>
          </div>
        </Card>
      </div>
      <div className="margin-top-4 margin-bottom-4">
        <Divider />
      </div>
      {showFundings && fundingSection}
      <h2>Sites</h2>
      <div className="three-column-layout">{siteCards}</div>
    </div>
  );
};
