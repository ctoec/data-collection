import React from 'react';
import {
  FormField,
  RadioButtonGroupProps,
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  TObjectDriller,
} from '@ctoec/component-library';
import { Site, Enrollment } from '../../../../shared/models';
import { ChangeEnrollment } from '../../../../shared/payloads';
import { FieldStatusFunc } from '@ctoec/component-library/dist/components/Form/FormStatusFunc';

type SiteProps<T> = {
  sites: Site[];
  accessor: (_: TObjectDriller<T>) => TObjectDriller<Site>;
  status?: FieldStatusFunc<T, any>;
};

/**
 * Component for updating the site of an enrollment
 */
export const SiteField = <T extends Enrollment | ChangeEnrollment>({
  sites,
  accessor,
  status = () => {
    return undefined;
  },
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
      showLegend
      options={sites.map((site) => ({
        render: (props: RadioOptionRenderProps) => (
          <RadioButton text={`${site.siteName}`} {...props} />
        ),
        value: `${site.id}`,
      }))}
      status={status}
    />
  );
};
