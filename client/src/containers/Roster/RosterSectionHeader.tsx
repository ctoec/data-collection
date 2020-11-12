import React from 'react';
import { Child, FundingSource, FundingSpace } from '../../shared/models';
import { getCurrentFunding } from '../../utils/models';

type RosterSectionHeaderProps = {
  children: Child[];
  hideCapacity: boolean;
};

/**
 * The header for a roster section comprised of children of a single age group.
 * Header contains total child count and information about funding space utilization
 * for the given age group.
 */
export const RosterSectionHeader: React.FC<RosterSectionHeaderProps> = ({
  children,
  hideCapacity,
}) => {
  const fundingSpaceCounts: {
    fundingSpace: FundingSpace;
    count: number;
  }[] = [];
  children.reduce((_counts, _child) => {
    const fundingSpace = getCurrentFunding({ child: _child })?.fundingSpace;
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
    <div className="display-flex flex-wrap">
      {fundingSpaceCounts.map(({ fundingSpace, count }) => {
        let displayStr = `${fundingSpace.source} ${fundingSpace.time} - ${count}`;
        const _hideCapacity =
          hideCapacity || fundingSpace.capacity === -1;
        displayStr += _hideCapacity
          ? ' spaces filled'
          : `/${fundingSpace.capacity}`;
        return (
          <div
            key={fundingSpace.id}
            className="margin-top-2 margin-right-2 font-body-sm text-base-darker text-no-wrap"
          >
            {displayStr}
          </div>
        );
      })}
    </div>
  );
};
