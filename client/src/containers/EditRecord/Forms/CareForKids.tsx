import React, { useState, useContext } from 'react';
import {
  Form,
  FormSubmitButton,
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../shared/models';
import { apiPut } from '../../../utils/api';
import AuthenticationContext from '../../../contexts/AuthenticationContext/AuthenticationContext';

type CareForKidsProps = {
  child: Child;
  refetchChild: () => void;
};

/*
 * Basic functional component designed to allow user to edit
 * the Care For Kids field of a Child object.
 */
export const CareForKidsForm: React.FC<CareForKidsProps> = ({
  child,
  refetchChild,
}) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = (updatedChild: Child) => {
    setIsSaving(true);
    apiPut(`children/${child.id}`, updatedChild, { accessToken })
      .then(() => refetchChild())
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="grid-container margin-top-2">
      <h2 className="grid-row">Receiving Care For Kids?</h2>
      <div>
        <Form<Child>
          className="CareForKidsForm"
          data={child}
          onSubmit={onSubmit}
          noValidate
          autoComplete="off"
        >
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
          <div className="grid-row margin-top-2">
            <FormSubmitButton text={isSaving ? 'Saving...' : 'Save'} />
          </div>
        </Form>
      </div>
    </div>
  );
};
