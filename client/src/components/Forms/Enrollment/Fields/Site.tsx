import React from 'react';
import { RadioButtonGroup, TObjectDriller } from '@ctoec/component-library';
import { Site, Enrollment } from '../../../../shared/models';
import { ChangeEnrollmentRequest } from '../../../../shared/payloads';
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';

type SiteProps<T> = {
  sites: Site[];
  enrollmentAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Enrollment>;
};

/**
 * Component for updating the site of an enrollment
 */
export const SiteField = <T extends Enrollment | ChangeEnrollmentRequest>({
  sites,
  enrollmentAccessor = (data) => data as TObjectDriller<Enrollment>,
}: SiteProps<T>) => {
  return (
    <RadioButtonGroup<T>
      id="site-radiogroup"
      legend="Site"
      showLegend
      inForm
      inputName="site"
      options={sites.map((site) => ({
        text: site.siteName,
        getValue: (data) => enrollmentAccessor(data).at('site').at('id'),
        parseOnChangeEvent: (e: React.ChangeEvent<any>) =>
          parseInt(e.target.value) || null,
        value: `${site.id}`,
        id: `site-${site.id}`,
        preprocessForDisplay: (data) => data == site.id,
      }))}
      status={(_, dataDriller) =>
        getValidationStatusForFields(
          enrollmentAccessor(dataDriller).value,
          ['site'],
          { message: `Site is required for OEC reporting.` }
        )
      }
    />
  );
};
