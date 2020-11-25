import { LoadingWrapper } from '@ctoec/component-library';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext/UserContext';

export const NotSignedInRedirect: React.FC = ({ children }) => {
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <LoadingWrapper loading={true} />;
  }

  return user ? <>{children}</> : <Redirect to="/" />;
};
