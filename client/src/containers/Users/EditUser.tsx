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
                  <p>
                    <span className="text-bold">Email</span>
                  </p>
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
    </div>
  );
};

export default EditUser;
