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
          return fst.fundingTimes.map((time) => {
            const rep = ag + ' - ' + fst.displayName + ' - ' + time.value;
            return (
              <Checkbox
                id={`funding-space-check-${ag}-${
                  fst.displayName + ' - ' + time.value
                }`}
                text={fst.displayName + ' - ' + time.value}
                defaultChecked={
                  userFundingSpaces.find((elt) => {
                    let match;
                    if (elt.fundingSpace.includes('School Readiness')) {
                      match =
                        elt.fundingSpace ===
                          ag +
                            ' - ' +
                            'Priority School Readiness' +
                            ' - ' +
                            time.value ||
                        elt.fundingSpace ===
                          ag +
                            ' - ' +
                            'Competitive School Readiness' +
                            ' - ' +
                            time.value ||
                        elt.fundingSpace ===
                          ag + ' - ' + 'School Readiness' + ' - ' + time.value;
                    } else {
                      match = elt.fundingSpace === rep;
                    }
                    return match;
                  })?.shouldHave
                    ? true
                    : false
                }
                onChange={(e) => {
                  const checked = e.target.checked;
                  const rep = ag + ' - ' + fst.displayName + ' - ' + time.value;
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
        }
      })}
    </>
  ));
};
