import { Card } from '@ctoec/component-library';
import React from 'react';

type RosterSummaryCardProps = {
  ageGroup: string;
  count: number;
}

export const RosterSummaryCard: React.FC<RosterSummaryCardProps> = ({
  ageGroup,
  count,
}) => {
  return (
    <div className="desktop:grid-col-4 three-column-card">
      <Card className="font-body-lg">
        <p className="margin-top-0 margin-bottom-0">{ageGroup}</p>
        <p className="text-bold margin-top-0 margin-bottom-0">
          {count}
        </p>
      </Card>
    </div>
  );
};