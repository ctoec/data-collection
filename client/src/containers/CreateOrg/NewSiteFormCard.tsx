import { Card, Form, Select, TextInput } from '@ctoec/component-library';
import React from 'react';
import { Region, Site } from '../../shared/models';

type NewSiteFormCardProps = {
  newSite: Partial<Site>;
  numberOnPage: number;
}

/**
 * Component that maps the state information in a new site object to
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const NewSiteFormCard: React.FC<NewSiteFormCardProps> = ({
  newSite,
  numberOnPage
}) => {
  return (
    <Card>
      <Form<Partial<Site>>
        className="full-width-form"
        data={newSite}
        onSubmit={() => {}}
        autoComplete="off"
      >
        <div className="display-flex flex-row grid-row grid-gap">
          <div className="tablet:grid-col-6">
            <TextInput
              label={`Site Name #${numberOnPage}`}
              id={`new-site-${numberOnPage}-name-input`}
              type="input"
              onChange={(e: any) => {
                newSite.siteName = e.target.value;
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
                newSite.titleI = e.target.value === 'Yes' ? true : false;
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
                newSite.region = e.target.value;
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
                newSite.facilityCode = parseInt(e.target.value);
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
                newSite.licenseNumber = parseInt(e.target.value);
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
                newSite.registryId = parseInt(e.target.value);
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
                newSite.naeycId = parseInt(e.target.value);
                return e.target.value;
              }}
            />
          </div>
        </div>
      </Form>
    </Card>
  );
};