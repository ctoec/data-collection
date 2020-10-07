import React from 'react';
import {
  ButtonWithDropdown,
  PlusCircle,
  TextWithIcon,
} from '@ctoec/component-library';
import { Organization } from '../shared/models';
import { Link, useHistory } from 'react-router-dom';

type AddRecordButtonProps = {
  orgs?: Organization[];
};

export const AddRecordButton: React.FC<AddRecordButtonProps> = ({ orgs }) => {
  const history = useHistory();

  if (!orgs) {
    return <></>;
  }

  if (orgs.length === 1) {
    return (
      <Link
        to={{
          pathname: '/create-record',
          state: { organization: orgs[0] },
        }}
      >
        <TextWithIcon Icon={PlusCircle} text="Add a record" />
      </Link>
    );
  }

  return (
    <ButtonWithDropdown
      text={<TextWithIcon Icon={PlusCircle} text="Add a record" />}
      id="select-organization"
      options={orgs.map((p) => ({
        text: p.providerName,
        href: '/create-record',
        onClick: () => {
          history.push('/create-record', { state: { organization: p } });
        },
      }))}
    />
  );
};
