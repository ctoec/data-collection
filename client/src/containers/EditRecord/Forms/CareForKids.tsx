import React from 'react';
import {
  Form,
  FormSubmitButton,
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
} from '@ctoec/component-library';
import { Child } from '../../../shared/models';

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
  const onSubmit = (updatedChild: Child) => {
    refetchChild();
    alert('Data saved successfully!');
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
            preprocessForDisplay={(data) => (data === true ? 'yes' : 'no')}
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
            <FormSubmitButton text="Save edits" />
          </div>
        </Form>
      </div>
    </div>
  );
};
