import React from 'react';
import { Alert, QuestionIllustration } from '@ctoec/component-library';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { BackButton } from '../../components/BackButton';

const SupportRequest: React.FC = () => {
  const h1Ref = getH1RefForTitle();
  return (
    <div className="grid-container margin-top-4">
      <BackButton />
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-8">
          <h1 ref={h1Ref}>Send a support request</h1>
          <p>
            Fill out the form below to get in touch with the ECE Reporter team.
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
      <div className="grid-row margin-top-4">
        <iframe
          className="survey"
          src="https://forms.monday.com/forms/embed/f8fc70e961cc2d22488a3210385daaab?r=use1"
        ></iframe>
      </div>
    </div>
  );
};

export default SupportRequest;
