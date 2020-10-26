import React from 'react';
import {
  RadioButtonGroup, RadioOptionInForm,
} from '@ctoec/component-library';
import { BirthCertificateType, Child } from '../../../../shared/models';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { BirthCertificateIdField } from './BirthCertificateId';
import { BirthStateField } from './BirthState';
import { BirthTownField } from './BirthTown';

type BirthCertificateFieldsetProps = {
  child: Child;
};

export const BirthCertificateFieldSet: React.FC<BirthCertificateFieldsetProps> = ({ child }) => {
  return <RadioButtonGroup<Child>
    inForm
    id="birth-certificate-fields"
    legend="Birth certificate"
    showLegend
    options={[
      ...Object.values(BirthCertificateType).map((certificateType): RadioOptionInForm<Child> => {
        const id = certificateType.replace(' ', '_')
        return {
          getValue: (data) => data.at('birthCertificateType'),
          text: certificateType,
          id,
          value: id,
          name: id,
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
        }
      }),
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
};
