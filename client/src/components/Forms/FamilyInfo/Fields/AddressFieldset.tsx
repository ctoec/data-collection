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
import { getValidationStatusForFieldset } from '../../../../utils/getValidationStatus';

// Listing of all possible US states to serve as options
// in the address selector
const POSSIBLE_STATES = ['CT', 'MA', 'NY', 'RI'];

export const AddressFieldset: React.FC = () => {
  return (
    <FormFieldSet<Family>
      id="family-address"
      legend="Address"
      horizontal
      className="display-inline-block"
      status={(data) =>
        getValidationStatusForFieldset(
          data,
          ['streetAddress', 'town', 'state', 'zip'],
          { message: 'Family address is required' }
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
        />
      </div>
      <div className="grid-row grid-gap">
        <div className="grid-col-8 display-inline-block">
          <FormField<Family, TextInputProps, string>
            getValue={(data) => data.at('town')}
            type="input"
            inputComponent={TextInput}
            id="town"
            label="Town"
            parseOnChangeEvent={(e) => e.target.value}
          />
        </div>
        <div className="grid-col-4 display-inline-block">
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
        />
      </div>
    </FormFieldSet>
  );
};
