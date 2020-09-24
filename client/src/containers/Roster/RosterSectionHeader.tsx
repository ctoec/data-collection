import React from 'react';
import { Child, AgeGroup, FundingSpace } from '../../shared/models';
import { getCurrentFunding } from '../../utils/models';
import pluralize from 'pluralize';

type RosterSectionHeaderProps = {
  ageGroup: AgeGroup;
  children: Child[];
};

/**
 * The header for a roster section comprised of children of a single age group.
 * Header contains total child count and information about funding space utilization
 * for the given age group.
 */
export const RosterSectionHeader: React.FC<RosterSectionHeaderProps> = ({
  ageGroup,
  children,
}) => {
  const fundingSpaceCounts: {
    fundingSpace: FundingSpace;
    count: number;
  }[] = [];
  children.reduce((_counts, _child) => {
    const fundingSpace = getCurrentFunding(_child)?.fundingSpace;
    if (fundingSpace) {
      const entry = _counts.find((e) => e.fundingSpace.id === fundingSpace.id);
      if (entry) {
        entry.count += 1;
      } else {
        _counts.push({ fundingSpace, count: 1 });
      }
    }

    return _counts;
  }, fundingSpaceCounts);

  return (
    <div>
      <p className="margin-top-0 margin-bottom-1">
        <span className="text-bold">{ageGroup} </span>
        {pluralize('child', children.length, true)}
      </p>

      <div className="display-flex">
        {fundingSpaceCounts.map(({ fundingSpace, count }) => {
          return (
            <div
              key={fundingSpace.id}
              className="margin-top-2 margin-right-2 font-body-sm text-base-darker"
            >
              {fundingSpace.source} {fundingSpace.time} — {count}/
              {fundingSpace.capacity}
            </div>
          );
        })}
      </div>
    </div>
  );
};
