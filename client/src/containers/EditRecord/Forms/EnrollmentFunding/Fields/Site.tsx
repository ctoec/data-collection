import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  TObjectDriller,
} from '@ctoec/component-library';
import { Site, Enrollment } from '../../../../../shared/models';
import { ChangeEnrollment } from '../../../../../shared/payloads';

type SiteProps<T> = {
  sites: Site[];
  accessor: (_: TObjectDriller<T>) => TObjectDriller<Site>;
};

/**
 * Component for updating the site of an enrollment
 */
export const SiteField = <T extends Enrollment | ChangeEnrollment>({
  sites,
  accessor,
}: SiteProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, number | null>
      getValue={(data) => accessor(data).at('id')}
      parseOnChangeEvent={(e: React.ChangeEvent<any>) =>
        parseInt(e.target.value) || null
      }
      inputComponent={RadioButtonGroup}
      name="site"
      id="site-radiogroup"
      legend="Site"
      options={sites.map((site) => ({
        render: (props: RadioOptionRenderProps) => (
          <RadioButton text={`${site.name}`} {...props} />
        ),
        value: `${site.id}`,
      }))}
    />
  );
};
