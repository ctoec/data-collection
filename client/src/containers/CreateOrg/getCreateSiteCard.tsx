import { Card, Select, TextInput } from '@ctoec/component-library';
import React from 'react';
import { Region, Site } from '../../shared/models';

/**
 * Function that maps the state information in a new site object
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const getNewSiteCard = (card: Partial<Site>, numberOnPage: number) => {
  return (
    <Card>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-6">
          <TextInput
            label={`Site Name #${numberOnPage}`}
            id={`new-site-${numberOnPage}-name-input`}
            type="input"
            onChange={(e: any) => {
              card.siteName = e.target.value;
              return e.target.value;
            }}
          />
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
        </div>
      </div>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-3">
          <TextInput
            label="Facility code (optional)"
            id={`new-site-${numberOnPage}-facility-input`}
            type="input"
            onChange={(e: any) => {
              card.facilityCode = parseInt(e.target.value);
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <TextInput
            label="License number (optional)"
            id={`new-site-${numberOnPage}-license-input`}
            type="input"
            onChange={(e: any) => {
              card.licenseNumber = parseInt(e.target.value);
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <TextInput
            label="Registry id (optional)"
            id={`new-site-${numberOnPage}-registry-input`}
            type="input"
            onChange={(e: any) => {
              card.registryId = parseInt(e.target.value);
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <TextInput
            label="NAEYC ID (optional)"
            id={`new-site-${numberOnPage}-naeyc-input`}
            type="input"
            onChange={(e: any) => {
              card.naeycId = parseInt(e.target.value);
              return e.target.value;
            }}
          />
        </div>
      </div>        
    </Card>
  );
};