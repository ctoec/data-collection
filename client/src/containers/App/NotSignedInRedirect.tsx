import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';

export const NotSignedInRedirect: React.FC = ({ children }) => {
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <></>;
  }

  return user ? <>{children}</> : <Redirect to="/" />;
};
