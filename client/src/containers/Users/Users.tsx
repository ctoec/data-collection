import React, { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';
import { UserSummary } from '../../shared/payloads/UsersResponse';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { UsersTable } from './UsersTable';
import { apiGet } from '../../utils/api';
import { useAlerts } from '../../hooks/useAlerts';

const Users: React.FC = () => {
  const [alertElements] = useAlerts();
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const { accessToken } = useContext(AuthenticationContext);

  const [data, setData] = useState<UserSummary[]>([]);

  useEffect(() => {
    (async function loadUsers() {
      if (user && accessToken) {
        await apiGet(`users`, accessToken).then((res: UserSummary[]) =>
          setData(res)
        );
      }
    })();
  }, [user, accessToken]);

  return (
    <div className="grid-container">
      <div className="grid-row grid-gap">
        {alertElements}
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          <h1 ref={h1Ref} className="margin-top-0">
            Users
          </h1>
          <div className="tablet:grid-col-12 margin-top-4">
            <UsersTable users={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
