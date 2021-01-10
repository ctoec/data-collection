import React, { useContext } from 'react';
import {
  ButtonProps,
  Button,
  ButtonWithDropdown,
  PlusCircle,
  TextWithIcon,
} from '@ctoec/component-library';
import { useHistory } from 'react-router-dom';
import UserContext from '../contexts/UserContext/UserContext';

// Need to require an ID for the dropdown, so don't let it be undefined like
// it could be in a buttonn
type AddRecordButtonProps = {
  id: string;
} & Pick<ButtonProps, 'className' | 'appearance'>;

export const AddRecordButton: React.FC<AddRecordButtonProps> = ({
  id, // Needs to be unique to associate with dropdown
  className,
  appearance,
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
          appearance={appearance || 'unstyled'}
          className={className}
          text={<TextWithIcon Icon={PlusCircle} text="Add a record" />}
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
    </div>
  );
};
