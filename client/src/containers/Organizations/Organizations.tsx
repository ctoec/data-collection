import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAuthenticatedSWR } from '../../hooks/useAuthenticatedSWR';
import { OrganizationSummary } from '../../shared/payloads/OrganizationsResponse';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { OrganizationsTable } from './OrganizationsTable';

const Organizations: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();

  const { data } = useAuthenticatedSWR<OrganizationSummary[]>('organizations');

  return !user?.isAdmin ? (
    <Redirect to="/home" />
  ) : (
    <div className="grid-container">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          <h1 ref={h1Ref} className="margin-top-0">
            Organizations
          </h1>
          <div className="tablet:grid-col-12 margin-top-4">
            <OrganizationsTable orgs={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organizations;
