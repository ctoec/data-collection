import React from 'react';

import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
} from '@ctoec/component-library';
import { Enrollment, Site } from '../../../../../shared/models';
import { ChangeEnrollment } from '../../../../../shared/payloads';
import { EnrollmentFieldProps } from './FieldProps';

export const SiteField: React.FC<EnrollmentFieldProps & { sites: Site[] }> = ({
  sites,
  isChangeEnrollment = false,
}) => {
  const commonProps = {
    parseOnChangeEvent: (e: React.ChangeEvent<any>) =>
      parseInt(e.target.value) || null,
    inputComponent: RadioButtonGroup,
    name: 'site',
    id: 'site-radiogroup',
    legend: 'Site',
    options: sites.map((site) => ({
      render: (props: RadioOptionRenderProps) => (
        <RadioButton text={`${site.name}`} {...props} />
      ),
      value: `${site.id}`,
    })),
  };

  return isChangeEnrollment ? (
    <FormField<ChangeEnrollment, RadioButtonGroupProps, number | null>
      getValue={(data) => data.at('newEnrollment').at('site').at('id')}
      {...commonProps}
    />
  ) : (
    <FormField<Enrollment, RadioButtonGroupProps, number | null>
      getValue={(data) => data.at('site').at('id')}
      {...commonProps}
    />
  );
};
