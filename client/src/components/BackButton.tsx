import React from 'react';
import { Button, TextWithIcon } from '@ctoec/component-library';
import { ReactComponent as Arrow } from '@ctoec/component-library/dist/assets/images/arrowRight.svg';
import { useHistory } from 'react-router-dom';

type BackButtonParams = {
  text?: string;
}

export default ({ text = 'Back' }: BackButtonParams) => {

  const { goBack } = useHistory();

  return (<Button
    className="margin-bottom-2 text-bold"
    appearance="unstyled"
    text={
      <TextWithIcon
        text={text}
        Icon={Arrow}
        direction="left"
        iconSide="left"
      />
    }
    onClick={goBack}
  />)
}