import React from 'react';
import { Child, AgeGroup, FundingSpace } from '../../shared/models';
import { getCurrentFunding } from '../../utils/models';

type RosterSectionHeaderProps = {
  ageGroup: AgeGroup;
  children: Child[];
};

export const RosterSectionHeader: React.FC<RosterSectionHeaderProps> = ({
  ageGroup,
  children,
}) => {
  const fundingSpaceCounts: {
    fundingSpace: FundingSpace;
    count: number;
  }[] = [];
  children.reduce((acc, child) => {
    const fundingSpace = getCurrentFunding(child)?.fundingSpace;
    if (fundingSpace) {
      const entry = acc.find((e) => e.fundingSpace.id === fundingSpace.id);
      if (entry) {
        entry.count += 1;
      } else {
        acc.push({ fundingSpace, count: 1 });
      }
    }

    return acc;
  }, fundingSpaceCounts);

  return (
    <div>
      <p className="margin-top-0 margin-bottom-1">
        <span className="text-bold">{ageGroup} </span>
        {children.length} children
      </p>

      <div className="display-flex">
        {fundingSpaceCounts.map(({ fundingSpace, count }) => {
          return (
            <div key={fundingSpace.id} className="margin-top-2 margin-right-2 font-body-sm text-base-darker">
              {fundingSpace.source} {fundingSpace.time} — {count}/
              {fundingSpace.capacity}
            </div>
          );
        })}
      </div>
    </div>
  );
};
