import React from 'react';
import { Card } from '@ctoec/component-library';
import { NestedFundingSpaces } from '../../../shared/payloads/NestedFundingSpaces';
import { AgeGroup, FundingSource } from '../../../shared/models';
import { getStrippedFundingSourceName } from './getFundingSpaceDisplayName';

// Map each calculated funding space distribution into a card
// element that we can format for display
export const mapFundingSpacesToCards = (nestedSpaces: NestedFundingSpaces) =>
  Object.keys(nestedSpaces).map((source) => (
    <div className="desktop:grid-col-4 three-column-card">
      <Card>
        <div className="padding-0">
          <h3 className="margin-top-0">
            {getStrippedFundingSourceName(source as FundingSource)}
          </h3>
          {Object.keys(nestedSpaces[source as FundingSource]).map(
            (ageGroup) => (
              <>
                <div>
                  <p className="text-bold">{ageGroup}</p>
                </div>
                <>
                  {nestedSpaces[source as FundingSource][
                    ageGroup as AgeGroup
                  ].map((fundingSpace) => {
                    // Account for fundings that have negative capacities stored
                    // Also hide capacities for SR fundings, since we're less
                    // confident on those and they change a lot
                    let spaceNumbers = `${fundingSpace.filled}`;
                    if (
                      fundingSpace.capacity !== -1 &&
                      !source.includes('School Readiness')
                    )
                      spaceNumbers += `/${fundingSpace.capacity} `;
                    else spaceNumbers += ` `;
                    return (
                      <p className="text-base-darker padding-0 margin-0">
                        <b>{spaceNumbers}</b>
                        {` ${fundingSpace.time}`}
                      </p>
                    );
                  })}
                </>
              </>
            )
          )}
        </div>
      </Card>
    </div>
  ));
