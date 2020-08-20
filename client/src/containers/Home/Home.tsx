import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { ReactComponent as ArrowRight } from 'uswds/dist/img/arrow-right.svg';
import { Button, TextWithIcon } from '@ctoec/component-library';
import HomeCareerBubbleSrc from '@ctoec/component-library/dist/assets/images/homeCareerBubble.png';

import UserContext from '../../contexts/UserContext/UserContext';

import { MailToLink } from '../../components/MailToLink';
import { ExcelTemplateDownloadLink } from '../../components/ExcelTemplateDownloadLink';
import { CSVTemplateDownloadLink } from '../../components/CSVTemplateDownloadLink';

const Home: React.FC = () => {
  const { user, loading } = useContext(UserContext);
  const history = useHistory();

  // To prevent flash of splash page if user is logged in
  if (loading) {
    return <></>;
  }

  // If the user is logged in, don't show the splash page
  if (user) {
    history.push('/getting-started');
    return <></>;
  }

  return (
    <div className="Home">
      <div className="usa-hero">
        <div>
          <h1 className="margin-bottom-2">Upload your enrollment data</h1>
          <Button
            className="btn--inverse"
            href="/login"
            text="Sign in"
            appearance="base"
          />
        </div>
      </div>
      <div className="grid-container margin-top-4">
        <div className="grid-row">
          <div className="tablet:grid-col-auto margin-right-4 padding-4">
            <img className="hero-bubble" src={HomeCareerBubbleSrc} alt="" />
          </div>
          <div className="tablet:grid-col-fill">
            <h2 className="text-primary text-light margin-y-3">
              We support affordable child care in Connecticut
            </h2>
            <p className="line-height-sans-5">
              Publicly-funded early care and education programs use ECE Reporter
              to share data with the Connecticut Office of Early Childhood.
            </p>
            <p>
              The Office of Early Childhood uses this data to pay programs and
              help families access quality care.
            </p>
            <div className="margin-bottom-4">
              <p className="text-bold">Learn more</p>
              <Button
                appearance="unstyled"
                href="https://ctoec.org"
                className="text-bold margin-bottom-3 display-block"
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
              <Button
                appearance="unstyled"
                href="/privacy-policy"
                className="text-bold margin-bottom-3 display-block"
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
              <Button
                appearance="unstyled"
                href="/column-metadata"
                className="text-bold margin-bottom-3 display-block"
                text={
                  <TextWithIcon
                    text="See the data requirements"
                    Icon={ArrowRight}
                    direction="right"
                    iconSide="right"
                    className="text-underline"
                  />
                }
              />
            </div>
            <div>
              <p className="text-bold">Download the data collection template</p>
              <ExcelTemplateDownloadLink />
              <CSVTemplateDownloadLink />
            </div>
          </div>
        </div>
      </div>
      <footer className={cx('bg-base-lightest', 'padding-y-6', 'footer')}>
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
      </footer>
    </div>
  );
};

export default Home;
