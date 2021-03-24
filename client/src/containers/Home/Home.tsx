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
  const [isPostSubmit, setIsPostSubmit] = useState<boolean | undefined>(
    undefined
  );
  useEffect(() => {
    (async function checkSubmitStatus() {
      if (user && accessToken) {
        const { allSubmitted } = await apiGet(
          'oec-report/are-all-orgs-submitted',
          accessToken
        );
        setIsPostSubmit(allSubmitted);
      }
    })();
  }, [user, accessToken]);

  return (
    <LoadingWrapper loading={isPostSubmit === undefined}>
      {isPostSubmit ? <PostSubmitHome /> : <PreSubmitHome />}
    </LoadingWrapper>
  );
};

export default Home;
