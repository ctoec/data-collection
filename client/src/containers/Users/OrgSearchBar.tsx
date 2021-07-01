import React, { useState } from 'react';
import { Organization, User } from '../../shared/models';
import { Button, SearchBar } from '@ctoec/component-library';
import pluralize from 'pluralize';
import produce from 'immer';
import { apiGet } from '../../utils/api';

type OrgSearchProps = {
  user: User;
  accessToken: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  updateData: React.Dispatch<React.SetStateAction<User>>;
}

export const OrgSearchBar: React.FC<OrgSearchProps> = ({
  user,
  accessToken,
  setUser,
  updateData,
}) => {

  const [foundOrgs, setFoundOrgs] = useState<Organization[] | null>(null);
  const searchForOrgs = async (query: string) => {
    await apiGet(`/organizations/?name=${query}`, accessToken).then((res) => {
      setFoundOrgs(res);
    });
  };

  return (
    <>
      <SearchBar
        id="new-user-org-search"
        labelText="Search for organization to add"
        placeholderText="Search"
        onSearch={searchForOrgs}
        className="tablet:grid-col-6"
      />
      {foundOrgs && (
        <>
          <p className="margin-bottom-2 text-bold">
            {`We found ${pluralize(
              'organization',
              foundOrgs.length,
              true
            )} matching your criteria.`}
          </p>
          <div className="margin-bottom-4">
            {foundOrgs.map((o) => (
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-4">{o.providerName}</div>
                <div className="tablet:grid-col-2">
                  <Button
                    appearance="unstyled"
                    text={user?.organizations?.find(org => org.providerName === o.providerName) ? "User already has access to this organization" : "Add organization"}
                    onClick={() => {
                      setUser(u => {
                        const updatedUser = produce<User>((user || {}) as User, draft => {
                          console.log(o.sites);
                          draft.organizations?.push(o);
                          draft.sites = draft.sites?.concat(o.sites || []);
                        });
                        updateData(updatedUser);
                        return updatedUser;
                      })
                    }}
                    disabled={user?.organizations?.find(org => org.providerName === o.providerName) ? true : false}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};