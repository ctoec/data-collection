import React from 'react';
import { RadioButtonGroup, RadioOptionInForm } from '@ctoec/component-library';
import { BirthCertificateType, Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthStateField } from './BirthState';
import { BirthTownField } from './BirthTown';

type BirthCertificateFieldsetProps = {
  child: Child;
};

/**
 * Component that allows a user to select a birth certificate type.
 * If type selected is US birth certificate, user is prompted to
 * enter additional required information in an expansion.
 */
export const BirthCertificateFieldSet: React.FC<BirthCertificateFieldsetProps> = ({
  child,
}) => {
  return (
    <RadioButtonGroup<Child>
      inForm
      id="birth-certificate-fields"
      legend="Birth certificate"
      inputName="birthCertificateType"
      showLegend
      options={[
        ...Object.values(BirthCertificateType).map(
          (certificateType): RadioOptionInForm<Child> => {
            const id = certificateType.replace(/\s/g, '-');
            return {
              getValue: (data) => data.at('birthCertificateType'),
              id,
              value: id,
              text: certificateType,
              expansion: certificateType === BirthCertificateType.US && (
                <>
                  <div className="mobile-lg:grid-col-12">
                    <BirthCertificateIdField />
                  </div>
                  <div className="display-flex flex-row flex-align-end grid-row grid-gap">
                    <BirthTownField child={child} />
                    <div className="margin-top-2">
                      <BirthStateField child={child} />
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
};
