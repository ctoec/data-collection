import { Button, Divider, TextInput } from '@ctoec/component-library';
import React, { useContext, useState } from 'react';
import { BackButton } from '../../components/BackButton';
import { FixedBottomBar } from '../../components/FixedBottomBar/FixedBottomBar';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { useAlerts } from '../../hooks/useAlerts';
import { apiPost } from '../../utils/api';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const CreateOrg: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);
  const [newOrgName, setNewOrgName] = useState<string>("");
  const [alertElements, setAlerts] = useAlerts();

  const createNewOrg = async () => {
    const res = await apiPost(
      `organizations/`,
      { name: newOrgName},
      { accessToken, jsonParse: true }
    ).catch((err) => {
      
      // Special 4XX error if an org with given name already existed
      if (err.message.includes('exists')) {
        setAlerts([{
          type: 'error',
          heading: 'Organization already exists',
          text: `An organization with name "${newOrgName}" already exists.`
        }]);
      }
      else throw new Error(err);
    });
    
    // Got a DB ID from the newly created org
    if (res?.id) {
      setAlerts([{
        type: 'success',
        heading: 'Organization created',
        text: `Organization "${newOrgName}" was successfully created!`
      }]);
    }
  };

  return (
    <>
      <div className="grid-container margin-top-2">
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
      </div>
      <FixedBottomBar>
        <Button text="Create organization" onClick={createNewOrg} />
        <Button text="Cancel" href="/" appearance="outline"/>
      </FixedBottomBar>
    </>
  );
};

export default CreateOrg;