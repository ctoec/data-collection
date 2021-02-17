import React from 'react';
import { Divider } from '@ctoec/component-library';
import { Child, FundingSource } from '../../shared/models';
import { getCurrentFunding } from '../../utils/models';
import { getStrippedFundingSourceName } from '../Home/utils/getFundingSpaceDisplayName';

type RosterSectionFundingSpacesMapProps = {
  children: Child[];
  hideCapacity: boolean;
};

type TimeAndCount = {
  time: string;
  count: number;
};

type SourceToTimes = {
  sourceName: string;
  capacity: number;
  times: TimeAndCount[];
};

/**
 * The "header" area for a roster section comprised of children of a
 * single age group. Contains information about capacity and filled
 * spaces of each funding group included in the children.
 */
export const RosterSectionFundingSpacesMap: React.FC<RosterSectionFundingSpacesMapProps> = ({
  children,
  hideCapacity,
}) => {
  const fundingSpacesMap: SourceToTimes[] = [];
  children.forEach((c) => {
    const fundingSpace = getCurrentFunding({ child: c })?.fundingSpace;
    if (fundingSpace) {
      let sourceMatch = fundingSpacesMap.find(
        (fs) => fs.sourceName === fundingSpace.source
      );
      if (!sourceMatch) {
        sourceMatch = {
          sourceName: fundingSpace.source,
          capacity: fundingSpace.capacity,
          times: [],
        } as SourceToTimes;
        fundingSpacesMap.push(sourceMatch);
      }
      let timeMatch = sourceMatch.times.find(
        (t) => t.time === fundingSpace.time
      );
      if (!timeMatch) {
        timeMatch = { time: fundingSpace.time, count: 0 } as TimeAndCount;
        sourceMatch.times.push(timeMatch);
      }
      timeMatch.count += 1;
    }
  });

  return (
    <div>
      <Divider />
      {fundingSpacesMap.map((sourceToTimes) => {
        let displayStr = (
          <>
            {sourceToTimes.times.map((t) => (
              <>
                <b>{t.time}</b> {t.count}
                {hideCapacity || sourceToTimes.capacity === -1
                  ? ''
                  : `/${sourceToTimes.capacity}`}{' '}
                &nbsp;&nbsp;
              </>
            ))}
          </>
        );
        return (
          <>
            <div key={sourceToTimes.sourceName} className="grid-row grid-gap">
              <div className="tablet:grid-col-3 font-body-sm text-bold margin-top-1 margin-left-2">
                {getStrippedFundingSourceName(
                  sourceToTimes.sourceName as FundingSource
                )}
              </div>
              <div className="tablet:grid-col-8 font-body-sm usa-hint margin-top-1">
                {displayStr}
              </div>
            </div>
            <div className="margin-top-1 margin-bottom-1">
              <Divider />
            </div>
          </>
        );
      })}
    </div>
  );
};
