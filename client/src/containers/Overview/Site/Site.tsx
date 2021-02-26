import React from 'react';

type SiteOverviewProps = {
  match: {
    params: {
      id: number;
    };
  };
};

export const SiteOverview: React.FC<SiteOverviewProps> = ({
  match: {
    params: { id },
  },
}) => {
  return <div>Site {id}</div>;
};
