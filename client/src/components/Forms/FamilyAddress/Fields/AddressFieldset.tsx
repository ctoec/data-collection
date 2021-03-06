import React from 'react';
import {
  FormField,
  FormFieldSet,
  TextInputProps,
  TextInput,
  SelectProps,
  Select,
} from '@ctoec/component-library';
import { Family } from '../../../../shared/models';
import {
  getValidationStatusForFieldInFieldset,
  getValidationStatusForFields,
} from '../../../../utils/getValidationStatus';

// Listing of all possible US states to serve as options
// in the address selector
const POSSIBLE_STATES = ['CT', 'MA', 'NY', 'RI'];

export const AddressFieldset: React.FC = () => {
  return (
    <FormFieldSet<Family>
      id="family-address"
      legend="Address"
      childrenGroupClassName="grid-col"
      className="display-inline-block"
      status={(data) =>
        getValidationStatusForFields(
          data,
          ['streetAddress', 'town', 'state', 'zipCode'],
          {
            message: 'Address is required for OEC reporting.',
          }
        )
      }
    >
      <div className="grid-col-12 margin-top-2">
        <FormField<Family, TextInputProps, string>
          getValue={(data) => data.at('streetAddress')}
          type="input"
          inputComponent={TextInput}
          id="street-address"
          label="Street address"
          parseOnChangeEvent={(e) => e.target.value}
          status={getValidationStatusForFieldInFieldset}
        />
      </div>
      <div className="grid-row grid-gap display-flex flex-row flex-align-end">
        <div className="grid-col-8 display-inline-block flex-align-self-end">
          <FormField<Family, TextInputProps, string>
            getValue={(data) => data.at('town')}
            type="input"
            inputComponent={TextInput}
            id="town"
            label="Town"
            parseOnChangeEvent={(e) => e.target.value}
            status={getValidationStatusForFieldInFieldset}
          />
        </div>
        <div className="grid-col-4 display-inline-block flex-align-self-end">
          <FormField<Family, SelectProps, string>
            id="state"
            label="State"
            inputComponent={Select}
            getValue={(data) => data.at('state')}
            parseOnChangeEvent={(e) => e.target.value}
            options={POSSIBLE_STATES.map((state) => ({
              text: state,
              value: state,
            }))}
            name="state"
            status={getValidationStatusForFieldInFieldset}
          />
        </div>
      </div>
      <div className="grid-col-6">
        <FormField<Family, TextInputProps, string>
          getValue={(data) => data.at('zipCode')}
          type="input"
          inputComponent={TextInput}
          id="zip"
          label="Zip code"
          parseOnChangeEvent={(e) => e.target.value}
          status={getValidationStatusForFieldInFieldset}
        />
      </div>
    </FormFieldSet>
  );
};
