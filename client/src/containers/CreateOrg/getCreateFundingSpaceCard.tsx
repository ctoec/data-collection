import { Card, Select, TextInput } from '@ctoec/component-library';
import React, { useState, useEffect } from 'react';
import {
  Region,
  Site,
  FundingSource,
  AgeGroup,
  FundingTime,
} from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { FundingSpace } from '../../shared/models/db/FundingSpace';

type NewFundingSpaceFormCardProps = {
  newFundingSpace: Partial<FundingSpace>;
  numberOnPage: number;
};

/**
 * Function that maps the state information in a new funding Space object
 * the card-contained JSX field style that will show up on the page.
 * Each card maintains its own state data and we collect it at
 * the end.
 */
export const NewFundingSpaceCard: React.FC<NewFundingSpaceFormCardProps> = ({
  newFundingSpace,
  numberOnPage,
}) => {
  const [fundingTimes, setFundingTimes] = useState<FundingTime[]>([]);

  const updateFundingTime = (source: FundingSource) => {
    FUNDING_SOURCE_TIMES.forEach((fst) => {
      if (fst.fundingSources.includes(source)) {
        setFundingTimes(fst.fundingTimes.map((ft) => ft.value));
      }
    });
  };

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
              newFundingSpace.source = e.target.value;
              updateFundingTime(e.target.value);
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
              newFundingSpace.ageGroup = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <Select
            id={`new-funding-space-${numberOnPage}-space-type-select`}
            label="Space type"
            options={fundingTimes.map((f) => ({
              text: f,
              value: f,
            }))}
            onChange={(e: any) => {
              newFundingSpace.time = e.target.value;
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
              newFundingSpace.capacity = e.target.value;
              return e.target.value;
            }}
          />
        </div>
      </div>
    </Card>
  );
};
