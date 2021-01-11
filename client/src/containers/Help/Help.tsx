import React from 'react';
import {
  Alert,
  QuestionIllustration,
  Card,
  HowToIcon,
  SupportIcon,
  TextWithIcon,
} from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { BackButton } from '../../components/BackButton';

const Help: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8">
          <h1 ref={h1Ref}>Help and Support</h1>
          <p>
            To get support with ECE Reporter, you can either browse our how-to
            guides or reach out to the support team.
          </p>
          <Alert
            heading="Help keep children's data safe and secure"
            type="info"
            text={
              <span>
                Don't share any personally identifying child information over
                the support form or email.
              </span>
            }
          />
        </div>
        <div className="tablet:grid-col-4" role="presentation">
          <QuestionIllustration />
        </div>
      </div>
      <div className="display-flex flex-row grid-row grid-gap margin-top-4">
        <div className="desktop:grid-col-5">
          <Card>
            <div className="grid-row">
              <HowToIcon className="height-8" />
            </div>
            <h2>How-to guides</h2>
            <p>Find your answers to common tasks and questions.</p>
            <a
              className="usa-button usa-button--unstyled"
              href="https://help.ece-reporter.ctoec.org/"
            >
              <TextWithIcon
                text="View guides"
                Icon={Arrow}
                direction="right"
                iconSide="right"
              />
            </a>
          </Card>
        </div>
        <div className="desktop:grid-col-5">
          <Card>
            <div className="grid-row">
              <SupportIcon className="height-8" />
            </div>
            <h2>Support requests</h2>
            <p>
              Reach out to the ECE Reporter team. We'll reply within 1 business
              day.
            </p>
            <a className="usa-button usa-button--unstyled" href="/support">
              <TextWithIcon
                text="Send a request"
                Icon={Arrow}
                direction="right"
                iconSide="right"
              />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;
