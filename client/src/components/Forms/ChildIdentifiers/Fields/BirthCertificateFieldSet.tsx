import React from 'react';
import { FormFieldSet } from '@ctoec/component-library';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthTownField } from './BirthTown';
import { BirthStateField } from './BirthState';
import { Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

/**
 * Component that wraps BirthCertificateId, BirthTown, and BirthState in a fieldset.
 */
export const BirthCertificateFormFieldSet: React.FC = () => {
  return (
    <FormFieldSet<Child>
      id="birth-certificate-fields"
      legend="Birth certificate"
      className="display-inline-block"
      showLegend
      status={(data) =>
        getValidationStatusForFields(
          data,
          ['birthCertificateId', 'birthTown', 'birthState'],
          { message: 'Birth certificate is required for OEC reporting.' }
        )
      }
      childrenGroupClassName="grid-col grid-gap"
    >
      <div className="mobile-lg:grid-col-12">
        <BirthCertificateIdField />
      </div>
      <div className="display-flex flex-row flex-align-end grid-row grid-gap">
        <div className="mobile-lg:grid-col-8 display-inline-block flex-align-self-end">
          <BirthTownField />
        </div>
        <div className="mobile-lg:grid-col-4 display-inline-block flex-align-self-end">
          <BirthStateField />
        </div>
      </div>
    </FormFieldSet>
  );
};
