import { Card, Button } from '@ctoec/component-library';
import { NumberInput, Select, SelectItem } from 'carbon-components-react';
import React, { useState } from 'react';
import { FundingSource, AgeGroup, FundingTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { FundingSpace } from '../../shared/models/db/FundingSpace';

type NewFundingSpaceFormCardProps = {
  newFundingSpace: Partial<FundingSpace>;
  numberOnPage: number;
  remove: Function;
  showErrors: Boolean;
};

type FundingSpaceValidation = {
  source: Boolean;
  ageGroup: Boolean;
  capacity: Boolean;
  time: Boolean;
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
  showErrors,
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

  //  Array of different field booleans so the form updates whenever
  //  any field is updated.
  const getMissingInfo = () => {
    return {
      source: !newFundingSpace.source,
      ageGroup: !newFundingSpace.ageGroup,
      capacity: !newFundingSpace.capacity && newFundingSpace.capacity != 0,
      time: !newFundingSpace.time,
    };
  };

  const updateMissingInfo = () => {
    if (
      Object.values(getMissingInfo()).toString() !=
      Object.values(missingInfo).toString()
    ) {
      setMissingInfo(getMissingInfo());
    }
  };

  const [fundingTimes, setFundingTimes] = useState<FundingTime[]>(
    newFundingSpace.source ? getFundingTimes(newFundingSpace.source) : []
  );

  const [missingInfo, setMissingInfo] = useState<FundingSpaceValidation>(
    getMissingInfo()
  );

  const errorClass = (fieldError: Boolean) =>
    showErrors && fieldError ? 'error-div' : '';

  return (
    <Card>
      <>
        {Object.values(missingInfo).some((f) => f) && showErrors && (
          <div className="display-flex flex-row grid-row grid-gap error-text">
            <div>Please enter all required funding space information.</div>
          </div>
        )}
      </>
      <div className="display-flex flex-row grid-row grid-gap">
        <div
          className={`tablet:grid-col-3`}
          key={`new-funding-space-${numberOnPage}-funding-source-select-${newFundingSpace.source}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-funding-source-select`}
            labelText="Funding source"
            invalid={showErrors && !!missingInfo.source}
            defaultValue={newFundingSpace.source ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.source = e.target.value;
              setFundingTimes(getFundingTimes(e.target.value));
              updateMissingInfo();
              return e.target.value;
            }}
          >
            <SelectItem value text="- Select -" />
            {Object.values(FundingSource).map((r) => (
              <SelectItem value={r} text={r} />
            ))}
          </Select>
        </div>
        <div
          className={`tablet:grid-col-3`}
          key={`new-funding-space-${numberOnPage}-age-group-select-${newFundingSpace.ageGroup}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-age-group-select`}
            labelText="Age group"
            invalid={showErrors && !!missingInfo.ageGroup}
            defaultValue={newFundingSpace.ageGroup ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.ageGroup = e.target.value;
              updateMissingInfo();
              return e.target.value;
            }}
          >
            <SelectItem value text="- Select -" />
            {Object.values(AgeGroup).map((r) => (
              <SelectItem value={r} text={r} />
            ))}
          </Select>
        </div>
        <div
          className={`tablet:grid-col-3`}
          key={`new-funding-space-${numberOnPage}-space-type-select-${newFundingSpace.time}`}
        >
          <Select
            id={`new-funding-space-${numberOnPage}-space-type-select`}
            labelText="Space type"
            invalid={showErrors && !!missingInfo.time}
            defaultValue={newFundingSpace.time ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.time = e.target.value;
              updateMissingInfo();
              return e.target.value;
            }}
          >
            <SelectItem value text="- Select -" />
            {(newFundingSpace.source
              ? getFundingTimes(newFundingSpace.source)
              : fundingTimes
            ).map((r) => (
              <SelectItem value={r} text={r} />
            ))}
          </Select>
        </div>

        <div
          className={`tablet:grid-col-3`}
          key={`new-funding-space-${numberOnPage}-capacity-${newFundingSpace.capacity}`}
        >
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
            onBlur={() => updateMissingInfo()}
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
