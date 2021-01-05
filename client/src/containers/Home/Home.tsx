import React, { useContext, useEffect } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';
import { PreSubmitHome } from './PreSubmit';
import { PostSubmitHome } from './PostSubmit';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';

const Home: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);
  let isPostSubmit = true;
  useEffect(() => {
    user?.organizations?.forEach((org) => {
      apiGet(`oec-report/${org.id}`, accessToken).then((res) => {
        if (!res.submitted) {
          isPostSubmit = false;
          return;
        }
      });
    });
  }, [user, accessToken]);

  return isPostSubmit ? <PostSubmitHome /> : <PreSubmitHome />;
};

export default Home;
