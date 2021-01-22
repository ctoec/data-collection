import React from 'react';
import Divider from '@material-ui/core/Divider';
import { Child } from '../../shared/models';
import { getCurrentFunding } from '../../utils/models';

type RosterSectionHeaderProps = {
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
 * The header for a roster section comprised of children of a single age group.
 * While it technically serves as the header, we want to be able to hide it
 * when the accordion for this content is closed, and so it will actually live
 * in the content section.
 */
export const RosterSectionHeader: React.FC<RosterSectionHeaderProps> = ({
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
      {fundingSpacesMap.map((st) => {
        let displayStr = (
          <>
            {st.times.map((t) => (
              <>
                <b>{t.time}</b> {t.count}
                {hideCapacity || st.capacity === -1
                  ? ''
                  : `/${st.capacity}`}{' '}
                &nbsp;&nbsp;
              </>
            ))}
          </>
        );
        return (
          <>
            <div key={st.sourceName} className="grid-row grid-gap">
              <div className="tablet:grid-col-2 font-body-sm text-bold margin-top-1">
                {st.sourceName.split('-')[1].trim()}
              </div>
              <div className="tablet:grid-col-10 font-body-sm usa-hint margin-top-1">
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
