import React from 'react';
import { Card } from '@ctoec/component-library';

// Map each calculated funding space distribution into a card
// element that we can format for display
export const mapFundingSpacesToCards = (fundingSpacesDisplay: any) => {
  const fundingCards = (fundingSpacesDisplay || []).map((fsd: any) => (
    <div className="desktop:grid-col-4 three-column-card">
      <Card>
        <div className="padding-0">
          <h3>{fsd.sourceName}</h3>
          {fsd.includedAgeGroups.map((ag: any) => (
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
  return fundingCards;
};
