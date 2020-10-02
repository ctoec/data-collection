import React, { useState, useEffect } from 'react';
import {
  FundingSpace,
  FundingSource,
  ReportingPeriod,
  Funding,
  Enrollment,
} from '../../../../../shared/models';
import {
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import { ContractSpaceField } from './ContractSpace/ContractSpace';
import { ReportingPeriodField } from './ReportingPeriod';
import {
  ChangeFunding,
  ChangeEnrollment,
} from '../../../../../shared/payloads';

const UNFUNDED = 'Unfunded';

type FundingFieldProps<T> = {
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];
  fundingAccessor: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
  getEnrollment: (_: TObjectDriller<T>) => Enrollment;
};

/**
 * Component for creating a new funding, either for an existing enrollment
 * or as part of creating a new enrollment.
 */
export const FundingField = <
  T extends ChangeFunding | ChangeEnrollment | Enrollment
>({
  fundingSpaces,
  reportingPeriods,
  fundingAccessor,
  getEnrollment,
}: FundingFieldProps<T>) => {
  const { dataDriller } = useGenericContext<T>(FormContext);
  const enrollment = getEnrollment(dataDriller);

  const [fundingSpaceOptions, setFundingSpaceOptions] = useState<
    FundingSpace[]
  >([]);
  const [fundingSourceOptions, setFundingSourceOptions] = useState<
    FundingSource[]
  >([]);

  // Funding source options is the deduped list of funding sources
  // from the funding spaces associated with the given site and agegroup
  // for the enrollment.
  useEffect(() => {
    const _fundingSpaceOptions = fundingSpaces.filter(
      (fs) => fs.ageGroup === enrollment?.ageGroup
    );
    setFundingSpaceOptions(_fundingSpaceOptions);

    const _fundingSourceOptions = new Set(
      _fundingSpaceOptions.map((fs) => fs.source)
    );

    setFundingSourceOptions(Array.from(_fundingSourceOptions));
  }, [enrollment, fundingSpaces]);

  return (
    <RadioButtonGroup
      id="funding-source"
      name="funding-source"
      legend="Funding source options"
      showLegend
      defaultValue={UNFUNDED}
      options={[
        {
          render: (props: RadioOptionRenderProps) => (
            <RadioButton {...props} text={UNFUNDED} />
          ),
          value: UNFUNDED,
        },
        ...fundingSourceOptions.map((fundingSource) => ({
          render: (props: RadioOptionRenderProps) => (
            <RadioButton {...props} text={fundingSource} />
          ),
          value: fundingSource,
          expansion: (
            <>
              <ContractSpaceField<T>
                fundingSpaceOptions={fundingSpaceOptions.filter(
                  (fs) => fs.source === fundingSource
                )}
                accessor={(data) => fundingAccessor(data).at('fundingSpace')}
              />
              <ReportingPeriodField<T>
                reportingPeriods={reportingPeriods.filter(
                  (rp) => rp.type === fundingSource
                )}
                accessor={(data) =>
                  fundingAccessor(data).at('firstReportingPeriod')
                }
              />
            </>
          ),
        })),
      ]}
    />
  );
};
