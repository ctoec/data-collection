import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';
import { LoadingWrapper } from '@ctoec/component-library';
import { Redirect } from 'react-router-dom';

export const AdminRedirect: React.FC = ({ children }) => {
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <LoadingWrapper loading={true} />;
  }

  return user?.isAdmin ? <>{children}</> : <Redirect to="/" />;
};