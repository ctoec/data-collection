import React, { useContext } from 'react';
import cx from 'classnames';
import {
  Button,
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
  // Use block display to ensure correct inline format
  // (e.g. spacing with other buttons and text)
  const formattedClassName = cx('display-block', className);
  const history = useHistory();
  const { user } = useContext(UserContext);
  const organizations = user?.organizations;
  if (!organizations || !organizations.length) {
    return <></>;
  }

  if (organizations.length === 1) {
    return (
      // Wrap in button so that icon is vertically centered with
      // the same alignment the text is
      <Button
        appearance="unstyled"
        className={formattedClassName}
        text={
          <Link
            to={{
              pathname: '/create-record',
              state: { organization: organizations[0] },
            }}
          >
            <TextWithIcon Icon={PlusCircle} text="Add a record" />
          </Link>
        }
      />
    );
  }

  return (
    <ButtonWithDropdown
      className={formattedClassName}
      text={
        <TextWithIcon Icon={PlusCircle} text="Add a record" iconSide="left" />
      }
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
