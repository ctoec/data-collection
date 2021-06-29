import { TextInput } from '@ctoec/component-library';
import React from 'react';
import { AddSiteRequest } from '../../../shared/payloads/AddSiteRequest';

/**
 * Function to expand a new set of fields for a user to add a new
 * site in the revision request form. The form tracks which site
 * to update among the state list sites by the index in the list.
 * @param addRequest
 * @param idx
 * @param setAddRequests
 */
export const getAddNewSiteForm = (
  addRequest: AddSiteRequest,
  idx: number,
  setAddRequests: React.Dispatch<React.SetStateAction<AddSiteRequest[]>>
) => {
  return (
    <>
      <p className="text-bold">New site information</p>
      <TextInput
        label="New site name"
        id="new-site-name"
        type="input"
        defaultValue={addRequest.siteName}
        onChange={(e) => {
          const change = e.target.value;
          setAddRequests((o: AddSiteRequest[]) => {
            o[idx].siteName = change;
            return o;
          });
          return change;
        }}
      />
      <TextInput
        label="License ID"
        id="new-site-license"
        type="input"
        defaultValue={addRequest.licenseId}
        onChange={(e) => {
          const change = e.target.value;
          setAddRequests((o: AddSiteRequest[]) => {
            o[idx].licenseId = change;
            return o;
          });
          return change;
        }}
      />
      <TextInput
        label="NAEYC ID"
        id="new-site-naeyc"
        type="input"
        defaultValue={addRequest.naeycId}
        onChange={(e) => {
          const change = e.target.value;
          setAddRequests((o: AddSiteRequest[]) => {
            o[idx].naeycId = change;
            return o;
          });
          return change;
        }}
      />
      <TextInput
        className="margin-bottom-4"
        label="Registry ID"
        id="new-site-registry"
        type="input"
        defaultValue={addRequest.registryId}
        onChange={(e) => {
          const change = e.target.value;
          setAddRequests((o: AddSiteRequest[]) => {
            o[idx].registryId = change;
            return o;
          });
          return change;
        }}
      />
    </>
  );
};
