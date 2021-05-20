import { Button, Divider, TextInput } from '@ctoec/component-library';
import React, { useContext, useEffect, useState } from 'react';
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
} from '../../shared/models';
import { FundingSpace } from '../../shared/models/db/FundingSpace';
import { apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { NewSiteFormCard } from './NewSiteFormCard';
import { getErrorMessage } from './getErrorMessage';
import { NewFundingSpaceCard } from './getCreateFundingSpaceCard';

const CreateOrg: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState('');
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
      (ns) => ns.siteName !== '' && ns.titleI !== null && ns.region
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
    titleI: (null as unknown) as boolean,
    region: (null as unknown) as Region,
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
    source: (null as unknown) as FundingSource,
    ageGroup: (null as unknown) as AgeGroup,
    capacity: undefined,
    time: (null as unknown) as FundingTime,
    display: true,
  };

  const [newFundingSpaces, setNewFundingSpaces] = useState<
    Partial<FundingSpace>[]
  >([{ ...emptyFundingSpace }]);

  let sortCount = 0;

  const addNewFundingSpace = () => {
    sortCount++;
    setNewFundingSpaces((currentFundingSpaces) => [
      ...currentFundingSpaces,
      { ...emptyFundingSpace },
    ]);
  };

  const removeFundingSpace = (e: Event, idx: number) => {
    console.log(
      newFundingSpaces.filter((fs, index, arr) => {
        return index !== idx - 1;
      })
    );
    setNewFundingSpaces(
      newFundingSpaces.map((fs, index) => {
        if (index == idx - 1) {
          fs.display = false;
        }
        return fs;
      })
    );
    e.preventDefault();
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
          <NewSiteFormCard newSite={ns} numberOnPage={idx + 1} />
        ))}
        <Button
          className="margin-top-2 margin-bottom-4"
          text="Add another site"
          onClick={addNewSite}
        />

        <h2 className="margin-top-4">Funding spaces</h2>
        <Divider />
        {newFundingSpaces.map((nfs, idx) => (
          <NewFundingSpaceCard
            newFundingSpace={nfs}
            numberOnPage={idx + 1}
            remove={removeFundingSpace}
          />
        ))}
        {/* {newFundingSpaces.length > 1 ? (
          <Button
            className="margin-top-2 margin-bottom-4"
            text="Remove funding space"
            // onClick={removeFundingSpace}
          />
        ) : (
          ''
        )} */}
        <Button
          className="margin-top-2 margin-bottom-4"
          text="Add another funding space"
          onClick={addNewFundingSpace}
        />
      </div>
      <FixedBottomBar>
        <Button text="Create organization" onClick={createNewOrg} />
        <Button text="Cancel" href="/" appearance="outline" />
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;
