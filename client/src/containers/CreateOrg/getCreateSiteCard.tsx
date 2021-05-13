import { Card, Select, TextInput } from '@ctoec/component-library';
import React from 'react';
import { Region } from '../../shared/models';

/**
 * Basic type to hold the state information for creating a new site
 * as part of creating a new organization.
 */
export type NewSite = {
  name: string;
  titleI: boolean;
  region: string;
  facilityCode?: string;
  licenseNumber?: string;
  registryId?: string;
  naeycId?: string;
}

/**
 * Function that maps the state information in a new site object
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const getNewSiteCard = (card: NewSite, numberOnPage: number) => {
  return (
    <Card>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-6">
          <TextInput
            label={`Site Name #${numberOnPage}`}
            id={`new-site-${numberOnPage}-name-input`}
            type="input"
            onChange={(e: any) => {
              card.name = e.target.value;
              return e.target.value;
            }}
          />
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <TextInput
                label="Facility code (optional)"
                id={`new-site-${numberOnPage}-facility-input`}
                type="input"
                onChange={(e: any) => {
                  card.facilityCode = e.target.value;
                  return e.target.value;
                }}
              />
            </div>
            <div className="tablet:grid-col-6">
              <TextInput
                label="License number (optional)"
                id={`new-site-${numberOnPage}-license-input`}
                type="input"
                onChange={(e: any) => {
                  card.licenseNumber = e.target.value;
                  return e.target.value;
                }}
              />
            </div>
          </div>
        </div>
        <div className="tablet:grid-col-3">
          <Select
            id={`new-site-${numberOnPage}-title1-select`}
            label="Title I"
            options={[
              {
                text: 'Yes',
                value: 'Yes'
              },
              {
                text: 'No',
                value: 'No'
              }
            ]}
            onChange={(e: any) => {
              card.titleI = e.target.value === 'Yes' ? true : false;
              return e.target.value;
            }}
          />
          <TextInput
            label="Registry id (optional)"
            id={`new-site-${numberOnPage}-registry-input`}
            type="input"
            onChange={(e: any) => {
              card.registryId = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <Select
            id={`new-site-${numberOnPage}-region-select`}
            label="Region"
            options={Object.values(Region).map((r) => ({
              text: r,
              value: r
            }))}
            onChange={(e: any) => {
              card.region = e.target.value;
              return e.target.value;
            }}
          />
          <TextInput
            label="NAEYC ID (optional)"
            id={`new-site-${numberOnPage}-naeyc-input`}
            type="input"
            onChange={(e: any) => {
              card.naeycId = e.target.value;
              return e.target.value;
            }}
          />
        </div>
      </div>
    </Card>
  );
};