import React from 'react';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthTownField } from './BirthTown';
import { BirthStateField } from './BirthState';
import { FormFieldSet } from '@ctoec/component-library';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFieldset } from '../../../../utils/getValidationStatus';

/**
 * Component that wraps BirthCertificateId, BirthTown, and BirthState in a fieldset.
 */
export const BirthCertificateFormFieldSet: React.FC = () => {
  return (
    <FormFieldSet<Child>
      id="birth-certificate-fields"
      legend="Birth certificate"
      className="display-inline-block margin-top-3"
      showLegend
      status={(data) =>
        getValidationStatusForFieldset(
          data,
          ['birthCertificateId', 'birthTown', 'birthState'],
          { message: 'Birth certificate details are required' }
        )
      }
    >
      <div className="mobile-lg:grid-col-12">
        <BirthCertificateIdField />
      </div>
      <div className="mobile-lg:grid-col-8 display-inline-block">
        <BirthTownField />
      </div>
      <div className="mobile-lg:grid-col-4 display-inline-block">
        <BirthStateField />
      </div>
    </FormFieldSet>
  );
};