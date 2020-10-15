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
      appearance="unstyled"
      options={orgs.map((org) => ({
        text: org.providerName,
        href: '/create-record',
        onClick: (e: any) => {
          if (e) {
            e.preventDefault();
          }
          history.push('/create-record', { organization: org });
        },
      }))}
    />
  );
};
