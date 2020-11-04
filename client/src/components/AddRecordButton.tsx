import React, { useContext } from 'react';
import {
  ButtonWithDropdown,
  PlusCircle,
  TextWithIcon,
} from '@ctoec/component-library';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext/UserContext';

type AddRecordButtonProps = {
  id: string;
  className?: string;
};

export const AddRecordButton: React.FC<AddRecordButtonProps> = ({
  id, // Needs to be unique to associate with dropdown
  className,
}) => {
  const history = useHistory();
  const { user } = useContext(UserContext);
  const organizations = user?.organizations;
  if (!organizations || !organizations.length) {
    return <></>;
  }

  if (organizations.length === 1) {
    return (
      <Link
        to={{
          pathname: '/create-record',
          state: { organization: organizations[0] },
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
      options={organizations.map((org) => ({
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
