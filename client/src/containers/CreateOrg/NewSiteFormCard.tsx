import { Card, Button } from '@ctoec/component-library';
import {
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from 'carbon-components-react';
import React, { useState } from 'react';
import { Region, Site } from '../../shared/models';

type NewSiteFormCardProps = {
  newSite: Partial<Site>;
  numberOnPage: number;
  remove: Function;
  showErrors: Boolean;
};

type SiteValidation = {
  siteName: Boolean;
  titleI: Boolean;
  region: Boolean;
};

/**
 * Component that maps the state information in a new site object to
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const NewSiteFormCard: React.FC<NewSiteFormCardProps> = ({
  newSite,
  numberOnPage,
  remove,
  showErrors,
}) => {
  //  Array of different field booleans so the form updates whenever
  //  any field is updated.
  const getMissingInfo = (): SiteValidation => {
    return {
      siteName: !newSite.siteName || newSite.siteName === '',
      titleI: !newSite.titleI,
      region: !newSite.region,
    };
  };

  const updateMissingInfo = () => {
    let mi = getMissingInfo() as any;
    let cmi = missingInfo as any;
    if (Object.keys(mi).some((k) => mi[k] != cmi[k])) {
      setMissingInfo(getMissingInfo());
    }
  };

  const [missingInfo, setMissingInfo] = useState<SiteValidation>(
    getMissingInfo()
  );

  const errorClass = (fieldError: Boolean) => {
    return showErrors && fieldError ? 'error-div' : '';
  };

  return (
    <Card>
      {Object.values(missingInfo).some((f) => f) && showErrors ? (
        <div className="display-flex flex-row grid-row grid-gap error-text">
          <div>*Please enter all required site information.</div>
        </div>
      ) : (
        <></>
      )}
      <div className="display-flex flex-row grid-row grid-gap">
        <div
          className="tablet:grid-col-6"
          key={`newsite-siteName-${newSite.siteName}-${Date.now()}`}
        >
          <TextInput
            labelText={`Site Name #${numberOnPage}`}
            id={`new-site-${numberOnPage}-name-input`}
            type="input"
            defaultValue={newSite.siteName ?? undefined}
            invalid={showErrors && !!missingInfo.siteName}
            onChange={(e: any) => {
              newSite.siteName = e.target.value;
              return e.target.value;
            }}
            onBlur={() => updateMissingInfo()}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`titleI-${numberOnPage}-${newSite.titleI?.toString()}-${Date.now()}`}
        >
          <Select
            id={`new-site-${numberOnPage}-title1-select`}
            labelText="Title I"
            defaultValue={
              newSite.titleI === undefined
                ? undefined
                : newSite.titleI
                ? 'Yes'
                : 'No'
            }
            invalid={showErrors && !!missingInfo.titleI}
            onChange={(e: any) => {
              newSite.titleI = e.target.value === 'Yes' ? true : false;
              updateMissingInfo();
              return e.target.value;
            }}
          >
            <SelectItem value text="- Select -" />
            <SelectItem value="Yes" text="Yes" />
            <SelectItem value="No" text="No" />
          </Select>
        </div>
        <div
          className="tablet:grid-col-3"
          key={`region-${numberOnPage}-${newSite.region}-${Date.now()}`}
        >
          <Select
            id={`new-site-${numberOnPage}-region-select`}
            labelText="Region"
            defaultValue={newSite.region ?? undefined}
            invalid={showErrors && !!missingInfo.region}
            onChange={(e: any) => {
              newSite.region = e.target.value;
              updateMissingInfo();
              return e.target.value;
            }}
          >
            <SelectItem value text="- Select -" />
            {Object.values(Region).map((r) => (
              <SelectItem value={r} text={r} />
            ))}
          </Select>
        </div>
      </div>
      <div className="display-flex flex-row grid-row grid-gap">
        <div
          className="tablet:grid-col-3"
          key={`new-site-${numberOnPage}-facility-input-${
            newSite.facilityCode
          }-${Date.now()}`}
        >
          <NumberInput
            label="Facility code (optional)"
            id={`new-site-${numberOnPage}-facility-input`}
            value={newSite.facilityCode ?? ''}
            onChange={(e: any) => {
              newSite.facilityCode = parseInt(e.target.value);
              return e.target.value;
            }}
            allowEmpty={true}
            //  @ts-ignore
            hideSteppers={true}
            light={true}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`new-site-${numberOnPage}-license-input-${
            newSite.licenseNumber
          }-${Date.now()}`}
        >
          <NumberInput
            label="License number (optional)"
            id={`new-site-${numberOnPage}-license-input`}
            value={newSite.licenseNumber ?? ''}
            onChange={(e: any) => {
              newSite.licenseNumber = parseInt(e.target.value);
              return e.target.value;
            }}
            allowEmpty={true}
            //  @ts-ignore
            hideSteppers={true}
            light={true}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`new-site-${numberOnPage}-registry-input-${
            newSite.registryId
          }-${Date.now()}`}
        >
          <NumberInput
            label="Registry id (optional)"
            id={`new-site-${numberOnPage}-registry-input`}
            value={newSite.registryId ?? ''}
            onChange={(e: any) => {
              newSite.registryId = parseInt(e.target.value);
              return e.target.value;
            }}
            allowEmpty={true}
            //  @ts-ignore
            hideSteppers={true}
            light={true}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`new-site-${numberOnPage}-naeyc-input-${
            newSite.naeycId
          }-${Date.now()}`}
        >
          <NumberInput
            label="NAEYC ID (optional)"
            id={`new-site-${numberOnPage}-naeyc-input`}
            value={newSite.naeycId ?? ''}
            onChange={(e: any) => {
              newSite.naeycId = parseInt(e.target.value);
              return e.target.value;
            }}
            allowEmpty={true}
            //  @ts-ignore
            hideSteppers={true}
            light={true}
          />
        </div>
      </div>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-3 margin-top-3">
          <Button
            className="margin-top-2 margin-bottom-4"
            appearance="unstyled"
            text="Remove"
            onClick={() => {
              remove(numberOnPage);
            }}
          />
        </div>
      </div>
    </Card>
  );
};
