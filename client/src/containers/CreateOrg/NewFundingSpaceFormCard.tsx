import { Card, Button } from '@ctoec/component-library';
import { NumberInput, Select, SelectItem } from 'carbon-components-react';
import React, { useState, useEffect } from 'react';
import { FundingSource, AgeGroup, FundingTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { FundingSpaceWithErrors } from './CreateOrg';
import { FundingSpace } from '../../shared/models/db/FundingSpace';

type NewFundingSpaceFormCardProps = {
  newFundingSpace: Partial<FundingSpaceWithErrors>;
  numberOnPage: number;
  remove: Function;
  showErrors: Boolean;
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

  const getMissingInfo = () => {
    const errors: Partial<Record<keyof FundingSpace, boolean>> = {
      source: false,
      ageGroup: false,
      capacity: false,
      time: false,
    };
    Object.keys(errors).forEach((k) => {
      const key = k as keyof FundingSpace;
      errors[key] = !newFundingSpace[key];
    });
    return errors;
  };

  const updateErrors = () => {
    newFundingSpace.errors = Object.values(getMissingInfo()).includes(true);
    setMissingInfo(getMissingInfo());
  };

  const [fundingTimes, setFundingTimes] = useState<FundingTime[]>(
    newFundingSpace.source ? getFundingTimes(newFundingSpace.source) : []
  );

  const [missingInfo, setMissingInfo] = useState<
    Partial<Record<keyof FundingSpace, boolean>>
  >(getMissingInfo());

  useEffect(() => {
    newFundingSpace.errors = Object.values(getMissingInfo()).includes(true);
  }, []);

  return (
    <Card>
      <>
        {newFundingSpace.errors && showErrors && (
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
            invalid={showErrors && missingInfo.source}
            defaultValue={newFundingSpace.source ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.source = e.target.value;
              setFundingTimes(getFundingTimes(e.target.value));
              updateErrors();
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
            invalid={showErrors && missingInfo.ageGroup}
            defaultValue={newFundingSpace.ageGroup ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.ageGroup = e.target.value;
              updateErrors();
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
            invalid={showErrors && missingInfo.time}
            defaultValue={newFundingSpace.time ?? undefined}
            onChange={(e: any) => {
              newFundingSpace.time = e.target.value;
              updateErrors();
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
            invalid={showErrors && missingInfo.capacity}
            invalidText=""
            allowEmpty={true}
            //  @ts-ignore
            hideSteppers={true}
            light={true}
            onBlur={() => {
              updateErrors();
            }}
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
