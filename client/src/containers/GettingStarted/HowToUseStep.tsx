import React from 'react';
import { TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';

type HowToUseStepProps = {
  stepHeader: string;
  paragraphText: string;
  buttonText: string;
  linkTo: string;
};

export const HowToUseStep: React.FC<HowToUseStepProps> = ({
  stepHeader,
  paragraphText,
  buttonText,
  linkTo,
}) => {
  return (
    <>
      <p className="how-to-header">{stepHeader}</p>
      <p className="how-to-body">{paragraphText}</p>
      <p className="how-to-button">
        {/* Need to use an a tag to get href for an external link,
            since the how-to guide is hosted on documize */}
        <a className="usa-button usa-button--unstyled" href={linkTo}>
          <TextWithIcon text={buttonText} Icon={Arrow} iconSide="right" />
        </a>
      </p>
    </>
  );
};
