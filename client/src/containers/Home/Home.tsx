import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import cx from 'classnames';
import { ReactComponent as ArrowRight } from '@ctoec/component-library/dist/assets/images/arrowForward.svg';
import { Button, LoadingWrapper, TextWithIcon } from '@ctoec/component-library';
import HomeCareerBubbleSrc from '@ctoec/component-library/dist/assets/images/homeCareerBubble.png';
import UserContext from '../../contexts/UserContext/UserContext';
import { MailToLink } from '../../components/MailToLink';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';

const Home: React.FC = () => {
  const { user, loading } = useContext(UserContext);
  const h1Ref = getH1RefForTitle();

  // To prevent flash of splash page if user is logged in
  if (loading) {
    return <LoadingWrapper loading={true} />;
  }

  // If the user is logged in, don't show the splash page
  if (user) {
    return <Redirect to="/getting-started" />;
  }

  return (
    <div className="Home">
      <div className="usa-hero">
        <div className="grid-container">
          <h1 ref={h1Ref} className="margin-bottom-2">
            Welcome to ECE Reporter
          </h1>
          <Button
            className="btn--inverse"
            href="/login"
            text="Log in"
            appearance="base"
          />
        </div>
      </div>
      <div className="grid-container margin-top-4">
        <div className="grid-row grid-gap">
          <div className="tablet:grid-col-3">
            <img className="hero-bubble" src={HomeCareerBubbleSrc} alt="" />
          </div>
          <div className="tablet:grid-col-6">
            <h2 className="text-primary text-light margin-y-3">
              We support affordable child care in Connecticut
            </h2>
            <p className="line-height-sans-5">
              Publicly-funded early care and education programs use ECE Reporter
              to share data with the Connecticut Office of Early Childhood (OEC).
            </p>
            <p>
              The Office of Early Childhood uses this data to pay programs and
              help families access quality care.
            </p>
            <div className="margin-bottom-4">
              <h2 className="text-primary text-light margin-y-3">Learn more</h2>
              <h3>See the data collected by ECE Reporter</h3>
              <Button
                appearance="unstyled"
                href="/data-requirements"
                className="margin-bottom-3 display-block"
                text={
                  <TextWithIcon
                    text="Learn the data requirements"
                    Icon={ArrowRight}
                    direction="right"
                    iconSide="right"
                    className="text-underline"
                  />
                }
              />
              <Button
                appearance="unstyled"
                href="/template"
                className="margin-bottom-3 display-block"
                text={
                  <TextWithIcon
                    text="See the latest data template"
                    Icon={ArrowRight}
                    direction="right"
                    iconSide="right"
                    className="text-underline"
                  />
                }
              />
              {/* <h3>Get help with ECE Reporter</h3> */}
              {/* TODO: HELP PAGE LINK */}
              <h3>Learn more about OEC</h3>
              <Button
                appearance="unstyled"
                external={true}
                href="https://ctoec.org"
                className="margin-bottom-3 display-block"
                text={
                  <TextWithIcon
                    text="Visit OEC's website"
                    Icon={ArrowRight}
                    direction="right"
                    iconSide="right"
                    className="text-underline"
                  />
                }
              />
              <h3>Learn how ECE Reporter collects and stores data</h3>
              <Button
                appearance="unstyled"
                href="/privacy-policy"
                className="margin-bottom-3 display-block"
                text={
                  <TextWithIcon
                    text="See the privacy policy"
                    Icon={ArrowRight}
                    direction="right"
                    iconSide="right"
                    className="text-underline"
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
      <footer className={cx('bg-base-lightest', 'padding-y-6', 'footer')}>
        <div className="grid-container">
          <div className="grid-row flex-justify flex-align-center">
            <div className="grid-col-10">
              <h2 className="text-primary text-light margin-y-3">
                Have feedback about OEC's data collection process?
            </h2>
              <p>
                Feedback from providers like you helps make this tool even better.
            </p>
              <p>
                Send us your feedback at <MailToLink />
              </p>
            </div>
          </div>
          <div className="grid-col-2">
            {/* TODO: Add icon of message bubbles */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
