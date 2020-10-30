import React from 'react';
import {
  ButtonWithDropdown,
  PlusCircle,
  TextWithIcon,
} from '@ctoec/component-library';
import { Organization } from '../shared/models';
import { Link, useHistory } from 'react-router-dom';

type AddRecordButtonProps = {
  id: string;
  orgs?: Organization[];
  className?: string;
};

export const AddRecordButton: React.FC<AddRecordButtonProps> = ({
  id, // Needs to be unique to associate with dropdown
  orgs,
  className,
}) => {
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
        className={className}
      >
        <TextWithIcon Icon={PlusCircle} text="Add a record" />
      </Link>
    );
  }

  return (
    <ButtonWithDropdown
      className={className}
      text={<TextWithIcon Icon={PlusCircle} text="Add a record" />}
      id={id}
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
