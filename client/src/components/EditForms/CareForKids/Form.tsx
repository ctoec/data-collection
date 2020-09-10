import React, { useState, useContext } from 'react';
import {
  Form,
  FormSubmitButton,
<<<<<<< HEAD
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';
import { EditFormProps } from '../types';
=======
} from '@ctoec/component-library';
import { CareForKidsField } from './CareForKidsField';
import { EditFormProps } from '../types';
import AuthenticationContext from '../../../../contexts/AuthenticationContext/AuthenticationContext';
import { Child } from '../../../../shared/models';
import { apiPut } from '../../../../utils/api';
>>>>>>> 262909d... Align headers

/*
 * Basic functional component designed to allow user to edit
 * the Care For Kids field of a Child object.
 */
export const CareForKidsForm: React.FC<EditFormProps> = ({
  child,
  onSuccess,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [isSaving, setIsSaving] = useState(false);

  if (!child) return <></>;

  const onSubmit = (updatedChild: Child) => {
    setIsSaving(true);
    apiPut(`children/${child.id}`, updatedChild, { accessToken })
      .then(() => onSuccess())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="grid-container margin-top-2">
<<<<<<< HEAD
      <h2 className="grid-row">Receiving Care For Kids?</h2>
=======
      <h2 className="grid-row">Care 4 Kids</h2>
>>>>>>> 262909d... Align headers
      <div>
        <Form<Child>
          className="CareForKidsForm"
          data={child}
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
        >
<<<<<<< HEAD
          <FormField<Child, RadioButtonGroupProps, boolean>
            getValue={(data) => data.at('recievesC4K')}
            preprocessForDisplay={(data) => (data === true ? 'Yes' : 'No')}
            parseOnChangeEvent={(e) => {
              return e.target.value === 'Yes';
            }}
            inputComponent={RadioButtonGroup}
            id="c4k-radio-group"
            name="careforkids"
            legend="receives care for kids"
            options={[
              {
                render: (props) => (
                  <div>
                    <RadioButton text="Yes" {...props} />
                  </div>
                ),
                value: 'Yes',
              },
              {
                render: (props) => (
                  <div>
                    <RadioButton text="No" {...props} />
                  </div>
                ),
                value: 'No',
              },
            ]}
          />
=======
          <CareForKidsField />
>>>>>>> 262909d... Align headers
          <div className="grid-row margin-top-2">
            <FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} />
          </div>
        </Form>
      </div>
    </div>
  );
};
