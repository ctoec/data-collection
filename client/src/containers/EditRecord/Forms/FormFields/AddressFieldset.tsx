import React from 'react';
import {
  FormField,
  FormFieldSet,
  TextInputProps,
  TextInput,
  SelectProps,
  Select,
} from '@ctoec/component-library';
import { Family } from 'shared/models';

// Listing of all possible US states to serve as options
// in the address selector
const possibleStates = [
  'AK',
  'AL',
  'AR',
  'AZ',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'IA',
  'ID',
  'IL',
  'IN',
  'KS',
  'KY',
  'LA',
  'MA',
  'MD',
  'ME',
  'MI',
  'MN',
  'MO',
  'MS',
  'MT',
  'NC',
  'ND',
  'NE',
  'NH',
  'NJ',
  'NM',
  'NV',
  'NY',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VA',
  'VT',
  'WA',
  'WI',
  'WV',
  'WY',
];

export const AddressFieldset: React.FC = () => {
  return (
    <FormFieldSet<Family>
      id="family-address"
      legend="Address"
      horizontal
      className="display-inline-block"
    >
      <div className="grid-col-12 margin-top-2">
        <FormField<Family, TextInputProps, string>
          getValue={(data) => data.at('streetAddress')}
          type="input"
          inputComponent={TextInput}
          id="street-address"
          label="Street address"
          parseOnChangeEvent={(e) => {
            return e.target.value;
          }}
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
            parseOnChangeEvent={(e) => {
              return e.target.value;
            }}
          />
        </div>
        <div className="grid-col-4 display-inline-block">
          <FormField<Family, SelectProps, string>
            id="state"
            label="State"
            inputComponent={Select}
            getValue={(data) => data.at('state')}
            parseOnChangeEvent={(e) => {
              return e.target.value;
            }}
            options={possibleStates.map((state) => ({
              text: state,
              value: state,
            }))}
            name="state"
          />
        </div>
      </div>
      <div className="grid-col-6">
        <FormField<Family, TextInputProps, string>
          getValue={(data) => data.at('zip')}
          type="input"
          inputComponent={TextInput}
          id="zip"
          label="Zip code"
          parseOnChangeEvent={(e) => {
            return e.target.value;
          }}
        />
      </div>
    </FormFieldSet>
  );
};
