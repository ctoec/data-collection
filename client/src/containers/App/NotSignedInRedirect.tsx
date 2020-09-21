import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';

export const NotSignedInRedirect: React.FC = ({ children }) => {
  const history = useHistory();
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <></>;
  } else {
    if (!user) {
      history.push('/');
      return <></>;
    }
    return <>{children}</>;
  }
};
