import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthenticationProviderPropsType } from './AuthenticationContext';

export const usePath = (authProps: AuthenticationProviderPropsType) => {
  const { loginEndpoint, redirectEndpoint, logoutEndpoint } = authProps;
  const { pathname } = useLocation();

  const [whichPath, setWhichPath] = useState({
    isLogin: pathname === loginEndpoint,
    isCallback: pathname === redirectEndpoint,
    isLogout: pathname === logoutEndpoint,
  });
  useEffect(() => {
    const isLogin = pathname === loginEndpoint;
    const isCallback = pathname === redirectEndpoint;
    const isLogout = pathname === logoutEndpoint;
    setWhichPath({
      isLogin,
      isCallback,
      isLogout,
    });
  }, [pathname, authProps]);
  return whichPath;
};
