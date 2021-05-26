import {
  Card,
  Form,
  Select,
  TextInput,
  Button,
} from '@ctoec/component-library';
import { NumberInput } from 'carbon-components-react';
import React from 'react';
import { Region, Site } from '../../shared/models';

type NewSiteFormCardProps = {
  newSite: Partial<Site>;
  numberOnPage: number;
  remove: Function;
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
}) => {
  console.log('newSite', newSite);
  return (
    <Card>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-6">
          <TextInput
            label={`Site Name #${numberOnPage}`}
            id={`new-site-${numberOnPage}-name-input`}
            type="input"
            value={newSite.siteName ?? undefined}
            onChange={(e: any) => {
              newSite.siteName = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3" key={newSite.titleI?.toString()}>
          <Select
            id={`new-site-${numberOnPage}-title1-select`}
            label="Title I"
            defaultValue={newSite.titleI?.toString() ?? undefined}
            options={[
              {
                text: 'Yes',
                value: 'true',
              },
              {
                text: 'No',
                value: 'false',
              },
            ]}
            onChange={(e: any) => {
              newSite.titleI = e.target.value === 'true' ? true : false;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3" key={newSite.region}>
          <Select
            id={`new-site-${numberOnPage}-region-select`}
            label="Region"
            defaultValue={newSite.region ?? undefined}
            options={Object.values(Region).map((r) => ({
              text: r,
              value: r,
            }))}
            onChange={(e: any) => {
              newSite.region = e.target.value;
              return e.target.value;
            }}
          />
        </div>
      </div>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-3">
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
        <div className="tablet:grid-col-3">
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
        <div className="tablet:grid-col-3">
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
        <div className="tablet:grid-col-3">
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
