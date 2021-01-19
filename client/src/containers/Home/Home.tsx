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
  const orgsToCheck = (user?.organizations || []).length;

  // Want to show the presubmit page unless every org the user represents
  // has submitted their data (corner case cuz there's only one user who
  // has multiple orgs)
  const [isPostSubmit, setIsPostSubmit] = useState<boolean | undefined>();
  const [numCheckedOrgs, setNumCheckedOrgs] = useState<number>(0);
  useEffect(() => {
    user?.organizations?.forEach((org) => {
      apiGet(`oec-report/${org.id}`, accessToken).then((res) => {
        if (!res.submitted) {
          setIsPostSubmit(false);
        }
        setNumCheckedOrgs((n) => n + 1);
      });
    });
  }, [user, accessToken]);

  useEffect(() => {
    // Need this second state variable because the timing of React executing
    // checks vs the dispatch of setting postSubmit after the API call leads
    // to flashing if isPostSubmit can be altered after it's already been
    // set
    if (isPostSubmit === undefined && numCheckedOrgs === orgsToCheck) {
      setIsPostSubmit(true);
    }
  }, [numCheckedOrgs]);

  return (
    <LoadingWrapper loading={isPostSubmit === undefined}>
      {isPostSubmit ? <PostSubmitHome /> : <PreSubmitHome />}
    </LoadingWrapper>
  );
};

export default Home;
