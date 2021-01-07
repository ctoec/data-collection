import React, { useContext, useEffect, useState } from 'react';
import UserContext from '../../contexts/UserContext/UserContext';
import { PreSubmitHome } from './PreSubmit';
import { PostSubmitHome } from './PostSubmit';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';
import { LoadingWrapper } from '@ctoec/component-library';

const Home: React.FC = () => {
  const { user } = useContext(UserContext);
  const { accessToken } = useContext(AuthenticationContext);

  // Want to show the presubmit page unless every org the user represents
  // has submitted their data (corner case cuz there's only one user who
  // has multiple orgs)
  const [isPostSubmit, setIsPostSubmit] = useState<boolean | undefined>();
  useEffect(() => {
    user?.organizations?.forEach((org) => {
      apiGet(`oec-report/${org.id}`, accessToken).then((res) => {
        if (!res.submitted) {
          setIsPostSubmit(false);
          return;
        }
      });
    });
    setIsPostSubmit(true);
  }, [user, accessToken]);

  return (
    <LoadingWrapper loading={isPostSubmit === undefined}>
      {isPostSubmit ? <PostSubmitHome /> : <PreSubmitHome />}
    </LoadingWrapper>
  );
};

export default Home;
