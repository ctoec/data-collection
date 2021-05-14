import { Button, Divider, TextInput } from '@ctoec/component-library';
import React, { useContext, useEffect, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useAlerts } from '../../hooks/useAlerts';
import { Region, Site } from '../../shared/models';
import { apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { getNewSiteCard } from './getCreateSiteCard';
import { getErrorMessage } from './getErrorMessage';

const CreateOrg: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState("");
  const [alertElements, setAlerts] = useAlerts();

  const createNewOrg = async () => {

    // Don't even send an API request if a site card is missing
    // some required info
    const allSitesOkay = newSites.every(
      (ns) => (ns.siteName !== '' && ns.titleI && ns.region)
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
        setAlerts([{
          type: 'success',
          heading: 'Organization created',
          text: `Organization "${newOrgName}" was successfully created!`
        }]);
      })
      .catch((err) => {
        const alertToSet = getErrorMessage(err);
        if (alertToSet) setAlerts(alertToSet);
        else throw new Error(err);
      }
    );
  };

  const [newSites, setNewSites] = useState<Partial<Site>[]>([]);
  const addNewSite = () => {
    setNewSites(o => [...o, {
      siteName: '',
      titleI: (null as unknown as boolean),
      region: (null as unknown as Region),
      facilityCode: undefined,
      licenseNumber: undefined,
      registryId: undefined,
      naeycId: undefined,
    }]);
  }
  useEffect(() => {
    if(newSites.length === 0) {
      addNewSite();
    }
  }, [newSites]);

  const siteSection = (
    <>
      <h2 className="margin-top-4">Sites</h2>
      <Divider />
      <p className="margin-top-2 margin-bottom-2">
        Make sure each new site you create has a name, a Title I designation, and a selected region.
      </p>
      {newSites.map((card, idx) => (
        getNewSiteCard(card, idx+1)
      ))}
      <Button
        className="margin-top-2 margin-bottom-4"
        text="Add another site"
        onClick={addNewSite} />
    </>
  );

  return (
    <>
      <div className="grid-container margin-top-2 margin-bottom-4">
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
        {siteSection}
      </div>
      <FixedBottomBar>
        <Button text="Create organization" onClick={createNewOrg} />
        <Button text="Cancel" href="/" appearance="outline"/>
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;
