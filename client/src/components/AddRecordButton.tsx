import React from 'react';
import {
  ButtonWithDropdown,
  PlusCircle,
  TextWithIcon,
} from '@ctoec/component-library';
import { Organization } from '../shared/models';
import { Link, useHistory } from 'react-router-dom';

// TODO: change after org => providers PR is merged
export const AddRecordButton = ({
  providers,
}: {
  providers?: Organization[];
}) => {
  const history = useHistory();

  if (!providers) {
    return <></>;
  }

  if (providers.length === 1) {
    return (
      <Link
        to={{
          pathname: '/create-record',
          state: { organization: providers[0] },
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
      options={providers.map((p) => ({
        text: p.providerName,
        // TODO: better to have button that navigates or links with same href but different behavior?
        href: 'create-record',
        onClick: () => {
          history.push('/create-record', { state: { organization: p } });
        },
      }))}
    />
  );
};
