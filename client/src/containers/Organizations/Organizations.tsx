import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { OrganizationSummary } from '../../shared/payloads/OrganizationsResponse';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { OrganizationsTable } from './OrganizationsTable';
import { apiGet } from '../../utils/api';
import { useAlerts } from '../../hooks/useAlerts';

const Organizations: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);

  const [data, setData] = useState<OrganizationSummary[]>([]);
  
  // We might have a success alert pushed from the create org page
  // so check whether we do (but filter so that we only show one
  // if a user created multiple orgs)
  const [alertElements, setAlerts] = useAlerts();
  useEffect(() => {
    setAlerts((_alerts) => [
      _alerts.find((a) => a?.heading === 'Organization created'),
    ]);
  }, []);

  useEffect(() => {
    (async function loadOrganizations() {
      if (user && accessToken) {
        await apiGet(
          `organizations`,
          accessToken
        ).then((res: OrganizationSummary[]) => setData(res));
      }
    })();
  }, [user, accessToken]);

  return (
    <div className="grid-container">
      {alertElements.length > 0 && alertElements}
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          <h1 ref={h1Ref} className="margin-top-0 margin-bottom-4">
            Organizations
          </h1>
          <a href="/create-org" className="usa-button">
            Create new organization
          </a>
          <div className="tablet:grid-col-12 margin-top-4">
            <OrganizationsTable orgs={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
