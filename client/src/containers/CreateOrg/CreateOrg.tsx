import { Button, Divider, TextInput, SearchBar } from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { BackButton } from '../../components/BackButton';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useAlerts } from '../../hooks/useAlerts';
import { Region, Site, User } from '../../shared/models';
import { apiGet, apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { NewSiteFormCard } from './NewSiteFormCard';
import { getErrorMessage } from './getErrorMessage';
import pluralize from 'pluralize';

const CreateOrg: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState("");
  const [foundUsers, setFoundUsers] = useState<User[]>([]);

  // Need some extra state to control when to display the email lookup
  // results, since the found users list already starts as empty
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [alertElements, setAlerts] = useAlerts();
  const history = useHistory();

  const createNewOrg = async () => {

    // Don't even send an API request if a site card is missing
    // some required info, or there's no org name
    if (newOrgName === "") {
      setAlerts([{
        type: 'error',
        heading: 'Organization name is missing',
        text: 'You must provide a valid organization name before submitting.'
      }])
      return
    }
    const allSitesOkay = newSites.every(
      (ns) => (ns.siteName !== '' && ns.titleI !== null && ns.region)
    );
    if (!allSitesOkay) {
      setAlerts([{
        type: 'error',
        heading: 'Site is incomplete',
        text: `One or more requested sites is missing required information.`
      }]);
      return
    }

    await apiPost(
      `organizations/`,
      {
        name: newOrgName,
        sites: newSites,
      },
      { accessToken, jsonParse: false }
    )
      .then((_) => {
        history.push('/organizations', {
          alerts: [
            {
              type: 'success',
              heading: 'Organization created',
              text: `Organization "${newOrgName}" was successfully created!`
            }
          ]
        })
      })
      .catch((err) => {
        const alertToSet = getErrorMessage(err);
        if (alertToSet) setAlerts(alertToSet);
        else throw new Error(err);
      }
    );
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
      }
    );
  };

  const emptySite: Partial<Site> = {
    siteName: '',
    titleI: (null as unknown as boolean),
    region: (null as unknown as Region),
    facilityCode: undefined,
    licenseNumber: undefined,
    registryId: undefined,
    naeycId: undefined,
  };
  const [newSites, setNewSites] = useState<Partial<Site>[]>([{ ...emptySite }]);
  const addNewSite = () => {
    setNewSites(currentSites => [...currentSites, { ...emptySite }]);
  }
  const removeLastSite = () => {
    setNewSites(currentSites => currentSites.slice(0, currentSites.length - 1));
  }

  return (
    <>
      <div className="container-with-bottom-margin grid-container margin-top-2">
        <BackButton location="/organizations" />
        {alertElements}
        <h1 ref={h1Ref}>Create Organization</h1>
        <p>
          Enter the details below to create an organization.
          User permissions may be added at a later time.
        </p>
        <h2 className="margin-top-4">Organization Details</h2>
        <Divider />
        <TextInput
          label="Organization Name"
          id='new-org-name-input'
          type="input"
          onChange={(e: any) => {
            setNewOrgName(e.target.value);
            return e.target.value;
          }}
        />
        <h2 className="margin-top-4">Sites</h2>
        <Divider />
        <p className="margin-top-2 margin-bottom-2">
          Make sure each new site you create has a name, a Title I designation, and a selected region.
        </p>
        {newSites.map((ns, idx) => (
          <NewSiteFormCard newSite={ns} numberOnPage={idx+1} />
        ))}
        <div className="grid-row grid-gap margin-top-2 margin-bottom-4">
          <Button
            text="Add another site"
            onClick={addNewSite}
          />
          <Button
            appearance="outline"
            text="Remove last site"
            onClick={removeLastSite}
          />
        </div>
        <h2 className="margin-top-4">Users and permissions</h2>
        <Divider />
        <p className="margin-top-2 margin-bottom-2">
          If users have not already been created for this organization,
          you may skip this step and add users later.
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
              {
                `We found ${pluralize('user', foundUsers.length, true)} matching your criteria.`
              }
            </p>
            <div className="margin-bottom-4">
              {foundUsers.map((u) => (
                <div className="grid-row grid-gap">
                  <div className="tablet:grid-col-4">
                    {u.email}
                  </div>
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
        <Button text="Cancel" href="/organizations" appearance="outline"/>
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;
