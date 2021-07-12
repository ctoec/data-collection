import React, { useContext, useState, useEffect } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Divider,
  Form,
  FormField,
  FormSubmitButton,
  LoadingWrapper,
  TextInputProps,
  TextInput,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import { MultiSelect } from 'carbon-components-react';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { apiGet, apiPut } from '../../utils/api';
import { User } from '../../shared/models/db/User';
import { OrgSearchBar } from './OrgSearchBar';
import produce from 'immer';
import { Organization } from '../../shared/models';
import { stringify } from 'query-string';

const EditUser: React.FC = () => {
  const [alertElements, setAlerts] = useAlerts();
  const { accessToken } = useContext(AuthenticationContext);
  const { user: adminUser } = useContext(UserContext);
  
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const h1Ref = getH1RefForTitle();

  const [user, setUser] = useState<User>();
  const [orgsOnPage, setOrgsOnPage] = useState<Organization[]>([]);
  const [saving, setSaving] = useState(false);
  const [cancelToggle, setCancelToggle] = useState(false);

  useEffect(() => {
    (async function loadUser() {
      if (adminUser && accessToken)
        apiGet(`users/${id}`, accessToken)
          .then((res: User) => setUser(res))
          .catch((err) => {
            console.error(err);
            history.push({
              pathname: '/users',
              state: {
                alerts: [
                  {
                    type: 'error',
                    text: 'Unable to fetch user information',
                  },
                ],
              },
            });
          });
    })();
  }, [adminUser, accessToken, cancelToggle]);

  // Have to maintain both an org's "full" list of sites, as well as
  // the subset of those sites the user has access to, because 
  // the multiselect options have to always show the full list
  useEffect(() => {
    (async function loadAccessibleOrgs() {
      if (adminUser && accessToken && user) {
        // For site-level users, this will still contain the orgs 
        // associated with the sites they can access
        const orgsToSend = (user.organizations || []).map((o) => o.id);
        apiGet(`organizations?${stringify({ orgIds: orgsToSend })}`, accessToken)
          .then((res: Organization[]) => setOrgsOnPage(res))
          .catch((err) => {
            console.error(err);
            history.push({
              pathname: '/users',
              state: {
                alerts: [
                  {
                    type: 'error',
                    text: 'Unable to determine sites associated with orgs'
                  }
                ]
              }
            })
          })
      }
    })();
  }, [adminUser, accessToken, user, user?.organizations]);

  const { updateData } = useGenericContext<User>(
    FormContext
  );

  const getLabelText = (org: Organization): string => {
    if (!user) return "";
    if (org.sites?.every((orgSite) => !user.sites?.some((userSite) => orgSite.siteName === userSite.siteName))) {
      return "Select one or more sites for this organization";
    }
    if (org.sites?.every((orgSite) => user.sites?.some((userSite) => orgSite.siteName === userSite.siteName))) {
      return "All sites selected at this organization";
    }
    return "Some sites selected for this organization";
  };

  return (
    <div className="grid-container">
      <BackButton text="Back to users" location="/users" />
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          {alertElements}
          {user ? (
            <>
              <h1 ref={h1Ref}>{`${user.lastName}, ${user.firstName}`}</h1>
              <h2 className="margin-top-4">User Information</h2>
              <Divider />
              <p className="text-bold">
                Email Address
              </p>
              <p>
                {user.email ? user.email : 'No saved email'}
              </p>
              <p>
                If you need to add or make changes to a user email, please{' '}
                <a
                  className="usa-button usa-button--unstyled"
                  href="/support"
                >
                  send us a support request
                </a>
                .
              </p>
              
              <Form<User>
                id="edit-user-form"
                className="full-page-form usa-form"
                data={user}
                key={cancelToggle.toString()}
                onSubmit={(_user: User) => {
                  setSaving(true);
                  apiPut(`users/${user.id}`, _user, { accessToken })
                    .then(() => {
                      setAlerts([
                        {
                          type: 'success',
                          text: 'Your changes have been saved',
                        },
                      ]);
                    })
                    .catch((err) => {
                      console.error(err);
                      setAlerts([
                        {
                          type: 'error',
                          text: 'Unable to save user information',
                        },
                      ]);
                    })
                    .finally(() => setSaving(false));
                }}
              >
                <div className="tablet:grid-col-3">
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('firstName')}
                    inputComponent={TextInput}
                    type="input"
                    id="firstName"
                    label={<span className="text-bold">First name</span>}
                    status={(data) =>
                      !data.at('firstName').value
                        ? {
                            type: 'error',
                            id: `status-firstName`,
                            message: 'First name cannot be empty',
                          }
                        : undefined
                    }
                  />
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('middleName')}
                    inputComponent={TextInput}
                    type="input"
                    id="middleName"
                    label={<span className="text-bold">Middle name</span>}
                  />
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('lastName')}
                    inputComponent={TextInput}
                    type="input"
                    id="lastName"
                    label={<span className="text-bold">Last name</span>}
                    status={(data) =>
                      !data.at('lastName').value
                        ? {
                            type: 'error',
                            id: `status-lastName`,
                            message: 'Last name cannot be empty',
                          }
                        : undefined
                    }
                  />
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('suffix')}
                    inputComponent={TextInput}
                    type="input"
                    id="suffix"
                    label={<span className="text-bold">Suffix</span>}
                  />
                </div>
                <h2 className="margin-top-4">Permissions</h2>
                <Divider />
                <>
                  {(user.organizations && user.organizations.length > 0) && (
                    <>
                      <div className="grid-row grid-gap">
                        <div className="tablet:grid-col-3">
                          <p className="text-bold">Organization</p>
                        </div>
                        <div className="tablet:grid-col-6">
                          <p className="text-bold">Site permissions</p>
                        </div>
                        <div className="tablet:grid-col-3">
                          <p className="text-bold">Remove?</p>
                        </div>
                      </div>
                      {user.organizations.map((userOrg, idx) => {
                        // These will always generate a match because it's just the full
                        // version of the orgs the user can access
                        // Never _actually_ undefined
                        const fullOrg = orgsOnPage.find((o) => o.providerName === userOrg.providerName);
                        const fullSites = (fullOrg?.sites || []).map((s) => ({ ...s, label: s.siteName }));
                        const initSites = (fullSites).filter((fullSite) => user.sites?.some((uSite) => uSite.siteName === fullSite.siteName));
                        let updatedUser: User;
                        return (
                          <LoadingWrapper loading={!fullSites.length}>
                            <div className="grid-row grid-gap margin-bottom-1">
                              <div className="tablet:grid-col-3 site-perm-field">
                                {userOrg.providerName}
                              </div>
                              <div className="tablet:grid-col-6" key={`${userOrg.providerName}-${idx}-multiselect-${Date.now()}`}>
                                <MultiSelect
                                  id="user-site-perms-multiselect"
                                  label={getLabelText(fullOrg || {} as Organization)}
                                  items={fullSites}
                                  selectionFeedback="fixed"
                                  initialSelectedItems={initSites}
                                  // item is never actually undefined here--will always have a name
                                  onMenuChange={(open: boolean) => {
                                    if (!open && updatedUser) {
                                      updateData(updatedUser);
                                      setUser(u => updatedUser);
                                    }
                                  }}
                                  onChange={({ selectedItems }) => {
                                    updatedUser = produce<User>((user || {}) as User, draft => {
                                      fullSites.forEach((fs) => {
                                        // If it's in selected but not user's, add it
                                        if (selectedItems.some((s) => fs.siteName === s.siteName)
                                          && !draft.sites?.some((s) => s.siteName === fs.siteName)) {
                                            draft.sites?.push(fs);
                                        }
                                        // If it's in user's but not selected, remove it
                                        else if (draft.sites?.some((s) => s.siteName === fs.siteName)
                                          && !selectedItems.some((s) => s.siteName === fs.siteName)) {
                                            draft.sites = draft.sites?.filter((s) => s.siteName !== fs.siteName);
                                        }
                                      });
                                      return draft;
                                    });
                                  }}
                                />
                              </div>
                              <div className="tablet:grid-col-2 site-perm-field">
                                <Button
                                  appearance="unstyled"
                                  className="marginless-button"
                                  text="Remove organization"
                                  onClick={() => {
                                    setUser(u => {
                                      const updatedUser = produce<User>((user || {}) as User, draft => {
                                        draft.organizations = draft.organizations?.filter(
                                          o => o.providerName !== userOrg.providerName
                                        );
                                        draft.sites = draft.sites?.filter((s) => fullSites.every((fs) => fs.siteName !== s.siteName));
                                        return draft;
                                      });
                                      updateData(updatedUser);
                                      return updatedUser;
                                    })
                                  }}
                                />
                              </div>
                            </div>
                          </LoadingWrapper>
                        )
                      })}
                    </>
                  )}
                </>
                <h3 className="margin-top-4">Add Organization</h3>
                <OrgSearchBar
                  user={user}
                  accessToken={accessToken}
                  setUser={setUser}
                  updateData={updateData}
                />
                <FormSubmitButton
                  text={saving ? 'Saving...' : 'Save changes'}
                  disabled={saving}
                />
                <Button
                  text="Cancel"
                  appearance="outline"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setCancelToggle(!cancelToggle);
                  }}
                />
              </Form>
            </>
          ) : (
            <LoadingWrapper loading={true} />
          )}
        </div>
      </div>
      
      
    </div>
  );
};

export default EditUser;
