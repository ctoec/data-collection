import React from 'react';
import { Site } from '../../../shared/models';
import { RosterQueryParams } from '../Roster';
import pluralize from 'pluralize';

export function getRosterH2(
  childCount: number,
  sites?: Site[],
  query?: RosterQueryParams
) {
  if (!sites || sites?.length === 1) return;
  const siteText = query?.site
    ? sites.find((s) => `${s.id}` === query.site)?.siteName
    : 'All sites';
  return (
    <h2>
      {siteText}{' '}
      <span className="text-light">{pluralize('child', childCount, true)}</span>
    </h2>
  );
}
