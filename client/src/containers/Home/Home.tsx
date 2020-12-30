import React, { useContext } from 'react';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import UserContext from '../../contexts/UserContext/UserContext';
import { PreSubmitHome } from './PreSubmit';
import { User } from '../../shared/models';
import { PostSubmitHome } from './PostSubmit';

export type HomeProps = {
  user: User | null;
  h1Ref: ((h1Node: HTMLHeadingElement) => void) | null;
};

const Home: React.FC = () => {
  const { user } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();
  const orgs = user?.organizations || [];
  let submitted = false;
  if (orgs.length !== 0 && orgs[0].submittedData) submitted = true;

  return submitted ? (
    <PostSubmitHome user={user} h1Ref={h1Ref} />
  ) : (
    <PreSubmitHome user={user} h1Ref={h1Ref} />
  );
};

export default Home;
