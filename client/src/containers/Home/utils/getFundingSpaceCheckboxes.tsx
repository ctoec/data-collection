import { Checkbox } from '@ctoec/component-library';
import React from 'react';
import { FUNDING_SOURCE_TIMES } from '../../../shared/constants';
import { AgeGroup } from '../../../shared/models';
import { ChangeFundingSpaceRequest } from '../../../shared/models/db/ChangeFundingSpaceRequest';

/**
 * Function that creates a series of checkboxes broken out by age
 * group at the bottom of the revision request form. Funding space
 * types that the user and their org already have access to are
 * pre-checked.
 * @param userFundingSpaces
 * @param setUserFundingSpaces
 */
export const getFundingSpaceCheckboxes = (
  userFundingSpaces: ChangeFundingSpaceRequest[],
  setUserFundingSpaces: React.Dispatch<
    React.SetStateAction<ChangeFundingSpaceRequest[]>
  >
) => {
  return Object.values(AgeGroup).map((ag) => (
    <>
      <p className="text-bold">{ag}</p>
      {FUNDING_SOURCE_TIMES.map((fst) => {
        if (!fst.ageGroupLimitations || fst.ageGroupLimitations.includes(ag)) {
          return fst.fundingSources.map((source) => {
            const sourceName = source.split('-')[1].trim();
            return fst.fundingTimes.map((time) => {
              const rep = ag + ' - ' + sourceName + ' - ' + time.value;
              return (
                <Checkbox
                  id={`funding-space-check-${ag}-${
                    sourceName + ' - ' + time.value
                  }`}
                  text={sourceName + ' - ' + time.value}
                  defaultChecked={
                    userFundingSpaces.find((elt) => elt.fundingSpace === rep)
                      ?.shouldHave
                      ? true
                      : false
                  }
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const rep = ag + ' - ' + sourceName + ' - ' + time.value;
                    setUserFundingSpaces((o: ChangeFundingSpaceRequest[]) => {
                      const match = o.find(
                        (elt: ChangeFundingSpaceRequest) =>
                          elt.fundingSpace === rep
                      );
                      if (match) match.shouldHave = checked;
                      return o;
                    });
                    return checked;
                  }}
                />
              );
            });
          });
        }
      })}
    </>
  ));
};
