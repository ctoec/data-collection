import {
  Alert,
  Button,
  Checkbox,
  FormContext,
  Pencil,
  TextInput,
  TextWithIcon,
  useGenericContext,
} from '@ctoec/component-library';
import Divider from '@material-ui/core/Divider';
import React from 'react';
import { Site } from '../../../shared/models';
import { Revision } from '../../../shared/models/db/Revision';
import set from 'lodash/set';
import produce from 'immer';

type SiteNameProps = {
  editingSite: Site;
};

export const SiteName: React.FC<SiteNameProps> = ({ editingSite }) => {
  const { data, dataDriller, updateData } = useGenericContext<Revision>(
    FormContext
  );

  console.log(data);

  return (
    <>
      <p className="usa-hint">
        <b>License #: </b> {` ${editingSite.licenseNumber || 'Exempt'} `}{' '}
        <b>NAEYC ID: </b> {` ${editingSite.naeycId || 'None'} `}{' '}
        <b>Registry ID: </b> {` ${editingSite.registryId || 'None'} `}
      </p>
      <TextInput
        label="Request a new site name"
        id={`${editingSite}-rename`}
        type="input"
        onChange={(e) => {
          const changeReq = `CHANGE ${editingSite.siteName} TO ${e.target.value}`;
          const newSites = (data.siteNameChanges || []).filter(
            (elt: string) => !elt.includes(editingSite.siteName)
          );
          newSites.push(changeReq);
          updateData(
            produce<Revision>(data, (draft) =>
              set(draft, dataDriller.at('siteNameChanges').path, newSites)
            )
          );
          return e.target.value;
        }}
      />
      <Checkbox
        id={`${editingSite}-remove-checkbox`}
        text="Request that this site be removed from your account"
        onChange={(e) => {
          const changeReq = `REMOVE ${editingSite.siteName}`;
          const newSites = (data.siteNameChanges || []).filter(
            (elt: string) => !elt.includes(editingSite.siteName)
          );
          newSites.push(changeReq);
          updateData(
            produce<Revision>(data, (draft) =>
              set(draft, dataDriller.at('siteNameChanges').path, newSites)
            )
          );
          return e.target.checked;
        }}
      />
    </>
  );
};
