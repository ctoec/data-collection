import { Card, Button } from '@ctoec/component-library';
import { NumberInput, Select, SelectItem } from 'carbon-components-react';
import React, { useState } from 'react';
import { FundingSource, AgeGroup, FundingTime } from '../../shared/models';
import { FUNDING_SOURCE_TIMES } from '../../shared/constants';
import { FundingSpaceWithErrors } from './CreateOrg';

type NewFundingSpaceFormCardProps = {
  newFundingSpace: Partial<FundingSpaceWithErrors>;
  numberOnPage: number;
  remove: Function;
  showErrors: Boolean;
};

type FundingSpaceErrors = {
  source: String;
  ageGroup: String;
  capacity: String;
  time: String;
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

  const Errors: FundingSpaceErrors = {
    source: 'SOURCE',
    ageGroup: 'AGE_GROUP',
    capacity: 'CAPACITY',
    time: 'TIME',
  };

  //  Array of different field booleans so the form updates whenever
  //  any field is updated.
  const getMissingInfo = () => {
    const tmp: String[] = [];
    Object.keys(Errors).forEach((k) => {
      const spaceKey = k as keyof FundingSpaceWithErrors;
      const errorKey = k as keyof FundingSpaceErrors;
      if (!newFundingSpace[spaceKey]) tmp.push(Errors[errorKey]);
    });
    return tmp;
  };

  const updateErrors = () => {
    newFundingSpace.errors = getMissingInfo();
    setMissingInfo(newFundingSpace.errors.join(','));
  };

  const [fundingTimes, setFundingTimes] = useState<FundingTime[]>(
    newFundingSpace.source ? getFundingTimes(newFundingSpace.source) : []
  );

  const [missingInfo, setMissingInfo] = useState<String>(
    getMissingInfo().join(',')
  );

  newFundingSpace.errors = getMissingInfo();

  return (
    <Card>
      <>
        {!!missingInfo && showErrors && (
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
            invalid={
              showErrors && !!newFundingSpace.errors?.includes(Errors.source)
            }
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
            invalid={
              showErrors && newFundingSpace.errors?.includes(Errors.ageGroup)
            }
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
            invalid={
              showErrors && newFundingSpace.errors?.includes(Errors.time)
            }
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
            invalid={
              showErrors && newFundingSpace.errors?.includes(Errors.capacity)
            }
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
