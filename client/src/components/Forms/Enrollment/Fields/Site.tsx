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
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

type SiteProps<T> = {
  sites: Site[];
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};

/**
 * Component for updating the site of an enrollment
 */
export const SiteField = <T extends Enrollment | ChangeEnrollment>({
  sites,
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: SiteProps<T>) => {
  return (
    <FormField<T, RadioButtonGroupProps, number | null>
      getValue={(data) => enrollmentAccessor(data).at('site').at('id')}
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
      status={(data, _, props) =>
        getValidationStatusForField(
          enrollmentAccessor(data),
          enrollmentAccessor(data).at('site').path,
          props
        )
      }
    />
  );
};
