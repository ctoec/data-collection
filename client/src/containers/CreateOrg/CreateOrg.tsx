import { AlertProps, Button, Divider, TextInput } from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router';
import { BackButton } from '../../components/BackButton';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const CreateOrg: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState<string>("");
  const [alertElements, setAlerts] = useAlerts();

  const createNewOrg = async () => {
    const { id } = await apiPost(
      `organizations/`,
      { name: newOrgName},
      { accessToken, jsonParse: true }
    ).catch((err) => {
      throw new Error(err);
    });
    const newAlerts: AlertProps[] = [];

    // Case where the org existed, so we didn't create anything, so there's 
    // no new ID
    if (id !== undefined) {
      newAlerts.push({
        type: 'success',
        heading: 'Organization created',
        text: `Organization "${newOrgName}" was successfully created!`
      });
    }

    // Got a DB ID from the newly created org
    else {
      newAlerts.push({
        type: 'error',
        heading: 'Organization already exists',
        text: `An organization with name "${newOrgName}" already exists.`
      })
    }
    setAlerts(newAlerts);
  };

  // return !user?.isAdmin ? (
    // <Redirect to="/home" />) : 
  return (
    <>
      <div className="grid-container margin-top-2">
        <BackButton location="/" />
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
      </div>
      <FixedBottomBar>
        <Button text="Create organization" onClick={createNewOrg} />
        <Button text="Cancel" href="/" appearance="outline"/>
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;