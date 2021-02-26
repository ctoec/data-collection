import { Card } from '@ctoec/component-library';
import React from 'react';

type SummaryCardProps = {
  header: JSX.Element | string;
  body: JSX.Element | string;
};
export const SummaryCard: React.FC<SummaryCardProps> = ({ header, body }) => {
  return (
    <Card className="margin-2">
      <p className="text-bold">{header}</p>
      <p className="font-body-3xl">{body}</p>
    </Card>
  );
};
