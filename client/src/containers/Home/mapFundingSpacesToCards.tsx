import React from 'react';
import { Card } from '@ctoec/component-library';
import { NestedFundingSpaces } from '../../shared/payloads/NestedFundingSpaces';

// Map each calculated funding space distribution into a card
// element that we can format for display
export const mapFundingSpacesToCards = (
  nestedSpaces: NestedFundingSpaces
) => Object.keys(nestedSpaces).map((source) => (
  <div className="desktop:grid-col-4 three-column-card">
    <Card>
      <div className="padding-0">
        <h3 className="margin-top-0">{source}</h3>
        {Object.keys(nestedSpaces[source]).map((ag: any) => (
          <>
            <div>
              <p className="text-bold">{ag.ageGroup}</p>
            </div>
            <>
              {ag.includedTimes.map((t: any) => {
                // Account for fundings that have negative capacities stored
                // Also hide capacities for SR fundings, since we're less
                // confident on those and they change a lot
                let spaceNumbers = `${t.filled}`;
                if (
                  t.capacity !== -1 &&
                  !fsd.sourceName.includes('School Readiness')
                )
                  spaceNumbers += `/${t.capacity} `;
                else spaceNumbers += ` `;
                return (
                  <p className="text-base-darker padding-0 margin-0">
                    <b>{spaceNumbers}</b>
                    {` ${t.timeType}`}
                  </p>
                );
              })}
            </>
          </>
        ))}
      </div>
    </Card>
  </div>
));
