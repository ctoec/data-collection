import {
  Button,
  Divider,
  TextInput,
  SearchBar,
} from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { BackButton } from '../../components/BackButton';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useAlerts } from '../../hooks/useAlerts';
import {
  Region,
  Site,
  FundingSource,
  AgeGroup,
  FundingTime,
  User,
} from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { NewSiteFormCard } from './NewSiteFormCard';
import { getErrorMessage } from './getErrorMessage';
import { FundingSpace } from '../../shared/models/db/FundingSpace';
import { NewFundingSpaceCard } from './NewFundingSpaceFormCard';
import pluralize from 'pluralize';

const CreateOrg: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState('');
  const [foundUsers, setFoundUsers] = useState<User[]>([]);

  // Need some extra state to control when to display the email lookup
  // results, since the found users list already starts as empty
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [alertElements, setAlerts] = useAlerts();
  const history = useHistory();

  const createNewOrg = async () => {
    // Don't even send an API request if a site card is missing
    // some required info, or there's no org name
    if (newOrgName === '') {
      setAlerts([
        {
          type: 'error',
          heading: 'Organization name is missing',
          text: 'You must provide a valid organization name before submitting.',
        },
      ]);
      return;
    }
    const allSitesOkay = newSites.every(
      (ns) => ns.siteName !== '' && ns.titleI !== undefined && ns.region
    );
    if (!allSitesOkay) {
      setAlerts([
        {
          type: 'error',
          heading: 'Site is incomplete',
          text: `One or more requested sites is missing required information.`,
        },
      ]);
      return;
    }

    const allFundingSpaceOkay = newFundingSpaces.every(
      (nfs) =>
        !!nfs.source &&
        !!nfs.ageGroup &&
        (!!nfs.capacity || nfs.capacity === 0) &&
        !!nfs.time
    );

    if (!allFundingSpaceOkay) {
      setAlerts([
        {
          type: 'error',
          heading: 'Funding space is incomplete',
          text: `One or more requested funding spaces is missing required information.`,
        },
      ]);
      return;
    }

    await apiPost(
      `organizations/`,
      {
        name: newOrgName,
        sites: newSites,
        fundingSpaces: newFundingSpaces,
      },
      { accessToken, jsonParse: false }
    )
      .then((_) => {
        history.push('/organizations', {
          alerts: [
            {
              type: 'success',
              heading: 'Organization created',
              text: `Organization "${newOrgName}" was successfully created!`,
            },
          ],
        });
      })
      .catch((err) => {
        const alertToSet = getErrorMessage(err);
        if (alertToSet) setAlerts(alertToSet);
        else throw new Error(err);
      });
  };

  const emptySite: Partial<Site> = {
    siteName: '',
    region: undefined,
    facilityCode: undefined,
    licenseNumber: undefined,
    registryId: undefined,
    naeycId: undefined,
  };
  const [newSites, setNewSites] = useState<Partial<Site>[]>([{ ...emptySite }]);
  const addNewSite = () => {
    setNewSites((currentSites) => [...currentSites, { ...emptySite }]);
  };

  const emptyFundingSpace: Partial<FundingSpace> = {
    source: undefined,
    ageGroup: undefined,
    capacity: undefined,
    time: undefined,
  };

  const [newFundingSpaces, setNewFundingSpaces] = useState<
    Partial<FundingSpace>[]
  >([{ ...emptyFundingSpace }]);

  const addNewFundingSpace = () => {
    setNewFundingSpaces((currentFundingSpaces) => [
      ...currentFundingSpaces,
      { ...emptyFundingSpace },
    ]);
  };

  const removeItem = (current: Array<any>, idx: number) => {
    const list = [...current];
    list.splice(idx - 1, 1);
    return list;
  };

  const removeFundingSpace = (idx: number) => {
    setNewFundingSpaces((current) => removeItem(current, idx));
  };

  const removeSite = (idx: number) => {
    setNewSites((current) => removeItem(current, idx));
  };

  const searchForUsers = async (query: string) => {
    setShowSearchResults(false);
    await apiGet(`/users/by-email/${query}`, accessToken)
      .then((res) => {
        setFoundUsers(res);
        setShowSearchResults(true);
      })
      .catch((err) => {
        console.error(err);
        throw new Error(err);
      });
  };

  return (
    <>
      <div className="container-with-bottom-margin grid-container margin-top-2">
        <BackButton location="/organizations" />
        {alertElements}
        <h1 ref={h1Ref}>Create Organization</h1>
        <p>
          Enter the details below to create an organization. User permissions
          may be added at a later time.
        </p>
        <h2 className="margin-top-4">Organization Details</h2>
        <Divider />
        <TextInput
          label="Organization Name"
          id="new-org-name-input"
          type="input"
          onChange={(e: any) => {
            setNewOrgName(e.target.value);
            return e.target.value;
          }}
        />
        <h2 className="margin-top-4">Sites</h2>
        <Divider />
        <p className="margin-top-2 margin-bottom-2">
          Make sure each new site you create has a name, a Title I designation,
          and a selected region.
        </p>
        {newSites.map((ns, idx) => (
          <NewSiteFormCard
            newSite={ns}
            numberOnPage={idx + 1}
            remove={removeSite}
          />
        ))}
        <div className="grid-row grid-gap margin-top-2 margin-bottom-4">
          <Button text="Add another site" onClick={addNewSite} />
        </div>
        <h2 className="margin-top-4">Funding spaces</h2>
        <Divider />
        {newFundingSpaces.map((nfs, idx) => (
          <NewFundingSpaceCard
            newFundingSpace={nfs}
            numberOnPage={idx + 1}
            remove={removeFundingSpace}
          />
        ))}
        <div className="grid-row grid-gap margin-top-2 margin-bottom-4">
          <Button
            className="margin-top-2 margin-bottom-4"
            text="Add another funding space"
            onClick={addNewFundingSpace}
          />
        </div>
        <h2 className="margin-top-4">Users and permissions</h2>
        <Divider />
        <p className="margin-top-2 margin-bottom-2">
          If users have not already been created for this organization, you may
          skip this step and add users later.
        </p>
        <SearchBar
          id="new-org-user-search"
          labelText="Search for user to add to organization"
          placeholderText="Search"
          onSearch={searchForUsers}
          className="tablet:grid-col-6"
        />
        {showSearchResults && (
          <>
            <p className="margin-bottom-2 text-bold">
              {`We found ${pluralize(
                'user',
                foundUsers.length,
                true
              )} matching your criteria.`}
            </p>
            <div className="margin-bottom-4">
              {foundUsers.map((u) => (
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-4">{u.email}</div>
                  <div className="tablet:grid-col-2">
                    <Button
                      appearance="unstyled"
                      text="Add user"
                      // TODO: Add functionality to actually add this user to the org in later ticket
                      onClick={() => {}}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <FixedBottomBar>
        <Button text="Create organization" onClick={createNewOrg} />
        <Button text="Cancel" href="/organizations" appearance="outline" />
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;
