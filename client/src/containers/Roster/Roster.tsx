import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { Site, AgeGroup } from '../../shared/models'
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { stringify } from 'query-string';
import { apiGet } from '../../utils/api';
import pluralize from 'pluralize';
import { AgeGroupCount } from '../../shared/payloads/AgeGroupCount';
import { RosterSummaryCard } from './RosterSummaryCard';

const Roster: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const userOrg = (user?.organizations || [])[0]
  const h1ref = getH1RefForTitle();

  const [childCounts, setChildCounts] = useState<AgeGroupCount>(
    Object.values(AgeGroup).reduce((a, v) => ({ ...a, [v]: 0 }), {}) as AgeGroupCount
  );
  
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getRosterSubHeader() {
        const counts = await apiGet(`children/count?${stringify({
          organizationId: userOrg.id,
        })}`, accessToken);
        setChildCounts(counts);
      })()
    }
  }, [user, userOrg, accessToken]);

  const [sites, setSites] = useState<Site[]>([]);
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getSites() {
        const sites = await apiGet('sites', accessToken);
        setSites(sites);
      })()
    }
  }, [user, userOrg, accessToken])

  return (
    <div className="margin-top-4 grid-container">
      <h1 ref={h1ref}>{userOrg.providerName}</h1>
      <p>
        {`Your roster has 
          ${
            Object.values(childCounts).reduce(
              (a: number, v: any) => a += v, 0)
          }
        children enrolled across ${pluralize('sites', sites.length, true)}.`
        }
      </p>
      <div className="grid-row three-column-layout">
        <RosterSummaryCard
          ageGroup={AgeGroup.InfantToddler}
          count={childCounts[AgeGroup.InfantToddler]}
        />
        <RosterSummaryCard
          ageGroup={AgeGroup.Preschool}
          count={childCounts[AgeGroup.Preschool]}
        />
        <RosterSummaryCard
          ageGroup={AgeGroup.SchoolAge}
          count={childCounts[AgeGroup.SchoolAge]}
        />
      </div>
    </div>
  );
};

export default Roster;