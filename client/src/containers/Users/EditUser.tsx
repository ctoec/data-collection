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
} from '@ctoec/component-library';
import { BackButton } from '../../components/BackButton';
import AuthenticationContext from '../../contexts/AuthenticationContext/AuthenticationContext';
import UserContext from '../../contexts/UserContext/UserContext';
import { useAlerts } from '../../hooks/useAlerts';
import { getH1RefForTitle } from '../../utils/getH1RefForTitle';
import { apiGet, apiPut } from '../../utils/api';
import { User } from '../../shared/models/db/User';

const EditUser: React.FC = () => {
  const [alertElements, setAlerts] = useAlerts();
  const { accessToken } = useContext(AuthenticationContext);
  const { user: adminUser } = useContext(UserContext);
  const history = useHistory();
  const { id } = useParams() as { id: string };
  const h1Ref = getH1RefForTitle();

  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

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

  return !adminUser?.isAdmin ? (
    <Redirect to="/home" />
  ) : (
    <div className="grid-container">
      <div className="grid-row grid-gap">
        <div className="tablet:grid-col-12 margin-top-4 margin-bottom-2">
          <BackButton text="Back to users" location="/users" />
          {alertElements}
          {user ? (
            <>
              <h1 ref={h1Ref}>{`${user.lastName}, ${user.firstName}`}</h1>
              <h2 className="margin-top-4">User Information</h2>
              <Divider />
              {user.email && (
                <>
                  <h3>Email Address</h3>
                  <p>{user.email}</p>
                  <p>
                    If you need to make changes to user emails, please{' '}
                    <a
                      className="usa-button usa-button--unstyled"
                      href="/support"
                    >
                      send us a support request
                    </a>
                    .
                  </p>
                </>
              )}
              <Form<User>
                id="change-enrollment-form"
                className="usa-form"
                data={user}
                onSubmit={(_user: User) => {
                  setSaving(true);
                  apiPut(`users/${user.id}`, _user, { accessToken })
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
                <FormField<User, TextInputProps, string | null>
                  getValue={(data) => data.at('firstName')}
                  parseOnChangeEvent={(e) => e.target.value}
                  inputComponent={TextInput}
                  type="input"
                  id="firstName"
                  label={<h3>First name</h3>}
                />
                {user.middleName && (
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('middleName')}
                    parseOnChangeEvent={(e) => e.target.value}
                    inputComponent={TextInput}
                    type="input"
                    id="middleName"
                    label={<h3>Middle name</h3>}
                  />
                )}
                <FormField<User, TextInputProps, string | null>
                  getValue={(data) => data.at('lastName')}
                  parseOnChangeEvent={(e) => e.target.value}
                  inputComponent={TextInput}
                  type="input"
                  id="lastName"
                  label={<h3>Last name</h3>}
                />
                {user.suffix && (
                  <FormField<User, TextInputProps, string | null>
                    getValue={(data) => data.at('suffix')}
                    parseOnChangeEvent={(e) => e.target.value}
                    inputComponent={TextInput}
                    type="input"
                    id="suffix"
                    label={<h3>Suffix</h3>}
                  />
                )}
                <FormSubmitButton
                  text={saving ? 'Saving...' : 'Save changes'}
                  disabled={saving}
                />
                <Button text="Cancel" appearance="outline" />
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
