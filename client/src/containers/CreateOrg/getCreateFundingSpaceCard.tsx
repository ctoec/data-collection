import { Card, Select, TextInput } from '@ctoec/component-library';
import React from 'react';
import {
  Region,
  Site,
  FundingSource,
  AgeGroup,
  FundingTime,
} from '../../shared/models';
import { FundingSpace } from '../../shared/models/db/FundingSpace';

/**
 * Function that maps the state information in a new site object
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const getNewFundingSpaceCard = (
  card: Partial<FundingSpace>,
  numberOnPage: number
) => {
  return (
    <Card>
      <div className="display-flex flex-row grid-row grid-gap">
        <div className="tablet:grid-col-3">
          <Select
            id={`new-funding-space-${numberOnPage}-funding-source-select`}
            label="Funding source"
            options={Object.values(FundingSource).map((r) => ({
              text: r,
              value: r,
            }))}
            onChange={(e: any) => {
              card.source = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <Select
            id={`new-funding-space-${numberOnPage}-age-group-select`}
            label="Age group"
            options={Object.values(AgeGroup).map((r) => ({
              text: r,
              value: r,
            }))}
            onChange={(e: any) => {
              card.ageGroup = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <Select
            id={`new-funding-space-${numberOnPage}-space-type-select`}
            label="Space type"
            options={Object.values(FundingTime).map((r) => ({
              text: r,
              value: r,
            }))}
            onChange={(e: any) => {
              card.time = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <TextInput
            label={`Capacity`}
            id={`new-funding-space-${numberOnPage}-capacity-input`}
            type="input"
            onChange={(e: any) => {
              card.capacity = e.target.value;
              return e.target.value;
            }}
          />
        </div>
      </div>
    </Card>
  );
};
