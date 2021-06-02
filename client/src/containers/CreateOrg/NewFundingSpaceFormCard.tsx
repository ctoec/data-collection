import { Card, TextInput, Button, Select } from '@ctoec/component-library';
import { NumberInput } from 'carbon-components-react';
import React, { useState } from 'react';
import { FundingSource, AgeGroup, FundingTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { FundingSpace } from '../../shared/models/db/FundingSpace';

type NewFundingSpaceFormCardProps = {
  newFundingSpace: Partial<FundingSpace>;
  numberOnPage: number;
  remove: Function;
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
  remove,
}) => {
  const getFundingTimes = (source: FundingSource) => {
    let tmp: FundingTime[] = [];
    FUNDING_SOURCE_TIMES.forEach((fst) => {
      if (fst.fundingSources.includes(source)) {
        tmp = [...fst.fundingTimes.map((ft) => ft.value)];
      }
    });
    return tmp;
  };

  const [fundingTimes, setFundingTimes] = useState<FundingTime[]>(
    newFundingSpace.source ? getFundingTimes(newFundingSpace.source) : []
  );

  return (
    <Card>
      <div className="display-flex flex-row grid-row grid-gap">
        <div
          className="tablet:grid-col-3"
          key={`new-funding-space-${numberOnPage}-funding-source-select-${newFundingSpace.source}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-funding-source-select`}
            label="Funding source"
            options={Object.values(FundingSource).map((r) => ({
              text: r,
              value: r,
            }))}
            defaultValue={newFundingSpace.source ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.source = e.target.value;
              setFundingTimes(getFundingTimes(e.target.value));
              return e.target.value;
            }}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`new-funding-space-${numberOnPage}-age-group-select-${newFundingSpace.ageGroup}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-age-group-select`}
            label="Age group"
            options={Object.values(AgeGroup).map((r) => ({
              text: r,
              value: r,
            }))}
            defaultValue={newFundingSpace.ageGroup ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.ageGroup = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div
          className="tablet:grid-col-3"
          key={`new-funding-space-${numberOnPage}-space-type-select-${newFundingSpace.time}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-space-type-select`}
            label="Space type"
            options={(newFundingSpace.source
              ? getFundingTimes(newFundingSpace.source)
              : fundingTimes
            ).map((f) => ({
              text: f,
              value: f,
            }))}
            defaultValue={newFundingSpace.time ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.time = e.target.value;
              return e.target.value;
            }}
          />
        </div>
        <div className="tablet:grid-col-3">
          <NumberInput
            label={`Capacity`}
            id={`new-funding-space-${numberOnPage}-capacity-input`}
            value={newFundingSpace.capacity ?? ''}
            onChange={(e: any) => {
              newFundingSpace.capacity = e.target.value;
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
