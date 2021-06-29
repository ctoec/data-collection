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
  SearchBar,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { apiGet, apiPut } from '../../utils/api';
import { User } from '../../shared/models/db/User';
import pluralize from 'pluralize';
import { Organization } from '../../shared/models/db/Organization';
import produce from 'immer';

const EditUser: React.FC = () => {
  const [alertElements, setAlerts] = useAlerts();
  const { accessToken } = useContext(AuthenticationContext);
  const { user: adminUser } = useContext(UserContext);
  
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const h1Ref = getH1RefForTitle();

  const [user, setUser] = useState<User>();
  const [saving, setSaving] = useState(false);
  const [cancelToggle, setCancelToggle] = useState(false);

  console.log(user);

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
  }, [adminUser, accessToken]);

  const { updateData } = useGenericContext<User>(
    FormContext
  );

  const [foundOrgs, setFoundOrgs] = useState<Organization[] | null>(null);
  const searchForOrgs = async (query: string) => {
    await apiGet(`/organizations/?name=${query}`, accessToken).then((res) => {
      setFoundOrgs(res);
    });
  };

  return !adminUser?.isAdmin ? (
    <Redirect to="/home" />
  ) : (
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
                      {user.organizations.map((userOrg) => (
                        <div className="grid-row grid-gap margin-bottom-1">
                          <div className="tablet:grid-col-3">
                            {userOrg.providerName}
                          </div>
                          <div className="tablet:grid-col-6">
                            {}
                          </div>
                          <div className="tablet:grid-col-2">
                            <Button
                              appearance="unstyled"
                              className="marginless-button"
                              text="Remove organization"
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>

                <FormSubmitButton
                  text={saving ? 'Saving...' : 'Save changes'}
                  disabled={saving}
                />
                <Button
                  text="Cancel"
                  appearance="outline"
                  onClick={() => setCancelToggle(!cancelToggle)}
                />
              </Form>
            </>
          ) : (
            <LoadingWrapper loading={true} />
          )}
        </div>
      </div>
      
      <h3 className="margin-top-4">Add Organization</h3>
      <Divider />
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
                          draft.organizations?.push(o);
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
    </div>
  );
};

export default EditUser;
