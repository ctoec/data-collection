import React from 'react';

type OrganizationOverviewProps = {
  match: {
    params: {
      id: number;
    };
  };
};

export const OrganizationOverview: React.FC<OrganizationOverviewProps> = ({
  match: {
    params: { id },
  },
}) => {
  return <div>Organization {id}</div>;
};
