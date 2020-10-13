import React from 'react';
import {
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  RadioButtonGroupProps,
  FormField,
} from '@ctoec/component-library';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthTownField } from './BirthTown';
import { BirthStateField } from './BirthState';
import { BirthCertificateType, Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

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
    <FormField<Child, RadioButtonGroupProps, string>
      id="birth-certificate-fields"
      name="birth-certificate-fields"
      legend="Birth certificate"
      showLegend
      getValue={(data) => data.at('birthCertificateType')}
      inputComponent={RadioButtonGroup}
      status={(data) =>
        getValidationStatusForFields(
          data.value,
          [
            'birthCertificateType',
            'birthCertificateId',
            'birthTown',
            'birthState',
          ],
          {
            message:
              'Birth certificate ID, birth town, and birth state are required for US birth certificates.',
          }
        )
      }
      options={[
        ...Object.values(BirthCertificateType).map((certificateType) => ({
          render: (props: RadioOptionRenderProps) => (
            <RadioButton {...props} text={certificateType} />
          ),
          value: certificateType,
          expansion: certificateType === 'US birth certificate' && (
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
        })),
      ]}
    />
  );
};
