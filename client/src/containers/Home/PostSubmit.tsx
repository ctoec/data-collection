import React, { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { HomeProps } from './Home';
import pluralize from 'pluralize';
import { AddRecordButton } from '../../components/AddRecordButton';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Card,
  InlineIcon,
  TextWithIcon,
} from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import { getFundingSpacesDisplay } from './getFundingSpacesMap';

export const PostSubmitHome: React.FC<HomeProps> = ({ user, h1Ref }) => {
  const { accessToken } = useContext(AuthenticationContext);
  const orgAccess = user?.accessType === 'organization';
  const userOrgs = user?.organizations || [];
  const showFundings = orgAccess && userOrgs.length == 1;

  // Count how many children are in the roster so we can format the display
  // Also obtain the funding spaces map if the user has the appropriate
  // org permissions
  const [userRosterCount, setUserRosterCount] = useState(undefined);
  const [fundingSpacesDisplayMap, setFundingSpacesMap] = useState();
  useEffect(() => {
    apiGet('children?count=true', accessToken)
      .then((res) => setUserRosterCount(res.count))
      .catch((err) => {
        throw new Error(err);
      });

    // Also determine the funding spaces map for the organization, if
    // the user has the permissions that enable this
    if (showFundings) {
      apiGet('children?fundingMap=true', accessToken)
        .then((res) => {
          const displayMap: any = getFundingSpacesDisplay(res.fundingSpacesMap);
          setFundingSpacesMap(displayMap);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [accessToken]);

  // Map each calculated funding space distribution into a card
  // element that we can format for display
  let fundingCards = (fundingSpacesDisplayMap || []).map((fsd: any) => (
    <div className="desktop:grid-col-4">
      <Card>
        <div className="padding-0">
          <div className="text-bold font-body-lg">{fsd.sourceName}</div>
          {fsd.includedAgeGroups.map((ag: any) => (
            <>
              <div>
                <p className="text-bold">{ag.ageGroup}</p>
              </div>
              <>
                {ag.includedTimes.map((t: any) => {
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

  // Assign the funding cards we computed above into the correct number
  // of rows (we want three columns per row)
  let fundingRows;
  if (fundingCards.length <= 3) {
    fundingRows = (
      <div className="display-flex flex-row grid-row grid-gap">
        {fundingCards.map((card) => card)}
      </div>
    );
  }
  // Only add a second row if we need to, since there are a max
  // of 5 different funding sources (hence 5 cards)
  else {
    fundingRows = (
      <>
        <div className="display-flex flex-row grid-row grid-gap">
          {fundingCards.slice(0, 3).map((card) => card)}
        </div>
        <div className="margin-top-2 display-flex flex-row grid-row grid-gap">
          {fundingCards.slice(3, 6).map((card) => card)}
        </div>
      </>
    );
  }

  // And now box the whole thing up in a section that we can show or
  // not show, including the associated divider, depending on whether
  // the user is supposed to see it
  const fundingSection = (
    <>
      <h2>Funding spaces</h2>
      {fundingRows}
      <div className="margin-top-4 margin-bottom-4">
        <Divider />
      </div>
    </>
  );

  return (
    <div className="grid-container margin-top-4">
      {userOrgs.map((org) => (
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-10">
            <h1 ref={h1Ref}>{org.providerName}</h1>
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
            <p className="grid-row text-bold">What's next?</p>
            <span className="grid-row">
              Keep your roster updated with new enrollments and withdrawals, and
              with age group, site, and funding changes.
            </span>
            <p></p>
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
    </div>
  );
};
