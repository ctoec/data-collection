import React, { useContext } from 'react';
import {
  ButtonProps,
  Button,
  ButtonWithDropdown,
} from '@ctoec/component-library';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext/UserContext';

// Need to require an ID for the dropdown, so don't let it be undefined like
// it could be in a button
type AddRecordButtonProps = {
  id: string;
} & Pick<ButtonProps, 'className'>;

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
      // Use an inline block button so that icon is vertically centered with
      // the same alignment the text is
      <div className="display-inline-block">
        <Button
          className={className}
          text="Add Record"
          href="/create-record"
          onClick={(e: any) => {
            if (e) e.preventDefault();
            history.push('/create-record', { organization: organizations[0] });
          }}
        />
      </div>
    );
  }

  return (
    <div className="display-inline-block">
      <ButtonWithDropdown
        className={className}
        text="Add Record"
        id={id}
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
    </div>
  );
};
