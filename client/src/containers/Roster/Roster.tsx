import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { Site, AgeGroup } from '../../shared/models'
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { stringify } from 'query-string';
import { apiGet } from '../../utils/api';
import pluralize from 'pluralize';
import { AgeGroupCount } from '../../shared/payloads/AgeGroupCount';
import { Card } from '@ctoec/component-library';

const Roster: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  const userOrg = (user?.organizations || [])[0]
  const h1ref = getH1RefForTitle();

  const [childCounts, setChildCounts] = useState<AgeGroupCount>(
    Object.values(AgeGroup).reduce((a, v) => {return {...a, [v]: 0}}, {}) as AgeGroupCount
  );
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getRosterSubHeader() {
        try {
          const counts = await apiGet(`children?${stringify({
            organizationId: userOrg.id,
            count: true,
          })}`, accessToken);
          setChildCounts(counts);
        } catch (error) {
          console.error(error);
          throw new Error(error);
        }
      })()
    }
  }, [user, userOrg, accessToken]);

  const [sites, setSites] = useState<Site[]>([]);
  useEffect(() => {
    if (user && userOrg && accessToken) {
      (async function getSites() {
        try {
          const sites = await apiGet('sites', accessToken);
          setSites(sites);
        } catch (error) {
          console.error(error);
          throw new Error(error);
        }
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
              (accumulator: number, value: any) => accumulator += value, 0)
          }
        children enrolled across ${pluralize('sites', sites.length, true)}.`
        }
      </p>
      <div className="grid-row three-column-layout">
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">Infant/toddler</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {childCounts['Infant/toddler']}
            </p>
          </Card>
        </div>
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">Preschool</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {childCounts.Preschool}
            </p>
          </Card>
        </div>
        <div className="desktop:grid-col-4 three-column-card">
          <Card className="font-body-lg">
            <p className="margin-top-0 margin-bottom-0">School aged</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {childCounts['School aged']}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Roster;