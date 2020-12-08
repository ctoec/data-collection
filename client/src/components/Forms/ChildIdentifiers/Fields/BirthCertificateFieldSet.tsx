import React from 'react';
import { RadioButtonGroup, RadioOptionInForm } from '@ctoec/component-library';
import { BirthCertificateType, Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthStateField } from './BirthState';
import { BirthTownField } from './BirthTown';

/**
 * Component that allows a user to select a birth certificate type.
 * If type selected is US birth certificate, user is prompted to
 * enter additional required information in an expansion.
 */
export const BirthCertificateFieldSet: React.FC = () => (
  <RadioButtonGroup<Child>
    inForm
    inputName="birthCertificateType"
    id="birth-certificate-fields"
    legend="Birth certificate"
    showLegend
    options={[
      ...Object.values(BirthCertificateType).map(
        (certificateType): RadioOptionInForm<Child> => {
          const id = certificateType.replace(/\s/g, '-');
          return {
            getValue: (data) => data.at('birthCertificateType'),
            preprocessForDisplay: (value) => {
              return value === certificateType;
            },
            id,
            value: certificateType,
            text: certificateType,
            expansion: certificateType === BirthCertificateType.US && (
              <>
                <div className="mobile-lg:grid-col-12">
                  <BirthCertificateIdField />
                </div>
                <div className="display-flex flex-row flex-align-end grid-row grid-gap">
                  <BirthTownField />
                  <div className="margin-top-2">
                    <BirthStateField />
                  </div>
                </div>
              </>
            ),
          };
        }
      ),
    ]}
    status={(_child) =>
      getValidationStatusForFields(
        _child,
        [
          'birthCertificateType',
          'birthCertificateId',
          'birthTown',
          'birthState',
        ],
        {
          message:
            'Birth certificate ID, birth town, and birth state are required (or must be "Unknown/not collected") for US birth certificates.',
        }
      )
    }
  />
);
