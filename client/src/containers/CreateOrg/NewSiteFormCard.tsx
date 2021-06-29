import { Card, Button } from '@ctoec/component-library';
import {
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from 'carbon-components-react';
import React, { useState, useEffect } from 'react';
import { Region, Site } from '../../shared/models';
import { SiteWithErrors } from './CreateOrg';

type NewSiteFormCardProps = {
  newSite: Partial<SiteWithErrors>;
  numberOnPage: number;
  remove: Function;
  showErrors: Boolean;
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
  const getMissingInfo = () => {
    const errors: Partial<Record<keyof Site, boolean>> = {
      siteName: false,
      titleI: false,
      region: false,
    };
    Object.keys(errors).forEach((k) => {
      const key = k as keyof Site;
      errors[key] = !newSite[key];
    });
    return errors;
  };

  const updateErrors = () => {
    newSite.errors = Object.values(getMissingInfo()).includes(true);
    setMissingInfo(getMissingInfo());
  };

  const [missingInfo, setMissingInfo] = useState<
    Partial<Record<keyof Site, boolean>>
  >(getMissingInfo());

  useEffect(() => {
    newSite.errors = Object.values(getMissingInfo()).includes(true);
  }, []);

  return (
    <Card>
      {newSite.errors && showErrors ? (
        <div className="display-flex flex-row grid-row grid-gap error-text">
          <div>Please enter all required site information.</div>
        </div>
      ) : (
        <></>
      )}
      <div className="display-flex flex-row grid-row grid-gap">
        <div
          className="tablet:grid-col-6"
          key={`newsite-siteName-${newSite.siteName}`}
        >
          <TextInput
            labelText={`Site Name #${numberOnPage}`}
            id={`new-site-${numberOnPage}-name-input`}
            type="input"
            defaultValue={newSite.siteName ?? undefined}
            invalid={showErrors && missingInfo.siteName}
            onChange={(e: any) => {
              newSite.siteName = e.target.value;
              return e.target.value;
            }}
            onBlur={() => updateErrors()}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`titleI-${numberOnPage}-${newSite.titleI?.toString()}`}
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
            invalid={showErrors && missingInfo.titleI}
            onChange={(e: any) => {
              newSite.titleI = e.target.value === 'Yes' ? true : false;
              updateErrors();
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
          key={`region-${numberOnPage}-${newSite.region}`}
        >
          <Select
            id={`new-site-${numberOnPage}-region-select`}
            labelText="Region"
            defaultValue={newSite.region ?? undefined}
            invalid={showErrors && missingInfo.region}
            onChange={(e: any) => {
              newSite.region = e.target.value;
              updateErrors();
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
          key={`new-site-${numberOnPage}-facility-input-${newSite.facilityCode}`}
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
          key={`new-site-${numberOnPage}-license-input-${newSite.licenseNumber}`}
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
          key={`new-site-${numberOnPage}-registry-input-${newSite.registryId}`}
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
          key={`new-site-${numberOnPage}-naeyc-input-${newSite.naeycId}`}
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
