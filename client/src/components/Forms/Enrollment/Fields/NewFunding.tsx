import React, { useState, useEffect, useContext } from 'react';
import { FundingSource, Funding, Enrollment } from '../../../../shared/models';
import {
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import { ContractSpaceField, ReportingPeriodField } from '../Funding/Fields';
import { ChangeFunding, ChangeEnrollment } from '../../../../shared/payloads';
import DataCacheContext from '../../../../contexts/DataCacheContext/DataCacheContext';

const UNFUNDED = 'Unfunded';

type FundingFieldProps<T> = {
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
  getEnrollment: (_: TObjectDriller<T>) => Enrollment;
  orgId: number;
  isEdit?: boolean;
};

/**
 * Component for creating a new funding, either for an existing enrollment
 * or as part of creating a new enrollment.
 */
export const NewFundingField = <
  T extends ChangeFunding | ChangeEnrollment | Enrollment | Funding
>({
  fundingAccessor = (data) => data as TObjectDriller<Funding>,
  getEnrollment,
  orgId,
  isEdit,
}: FundingFieldProps<T>) => {
  const { fundingSpaces } = useContext(DataCacheContext);
  const { dataDriller } = useGenericContext<T>(FormContext);
  const enrollment = getEnrollment(dataDriller);

  const [fundingSourceOptions, setFundingSourceOptions] = useState<
    FundingSource[]
  >([]);

  // Funding source options is the deduped list of funding sources
  // from the funding spaces associated with the given site and agegroup
  // for the enrollment.
  useEffect(() => {
    const _fundingSourceOptions = new Set(
      fundingSpaces.records
        .filter(
          (fs) =>
            fs.ageGroup === enrollment.ageGroup && fs.organization.id === orgId
        )
        .map((fs) => fs.source)
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
                // Do not show status when field is editing an existing funding
                // because the user will be creating this data for the first time
                showStatus={!isEdit}
                ageGroup={enrollment.ageGroup}
                fundingSource={fundingSource}
                organizationId={orgId}
                fundingAccessor={fundingAccessor}
              />
              <ReportingPeriodField<T>
                fundingSource={fundingSource}
                accessor={(data) =>
                  fundingAccessor(data).at('firstReportingPeriod')
                }
              />
              {/* Show last reporting period when field is editing an existing funding*/}
              {isEdit && (
                <ReportingPeriodField<T>
                  isLast={true}
                  fundingSource={fundingSource}
                  accessor={(data) =>
                    fundingAccessor(data).at('lastReportingPeriod')
                  }
                />
              )}
            </>
          ),
        })),
      ]}
    />
  );
};
