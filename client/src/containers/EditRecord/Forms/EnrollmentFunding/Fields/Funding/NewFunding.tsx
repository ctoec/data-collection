import React, { useState, useEffect } from 'react';
import {
  AgeGroup,
  FundingSpace,
  Site,
  FundingSource,
  ReportingPeriod,
  Funding,
} from '../../../../../../shared/models';
import {
  RadioButtonGroup,
  RadioButton,
  RadioOptionRenderProps,
  useGenericContext,
  FormContext,
} from '@ctoec/component-library';
import { ContractSpaceField } from './ContractSpace/ContractSpace';
import { ReportingPeriodField } from './ReportingPeriod';

const PRIVATE_PAY = 'private-pay';

type FundingFieldProps = {
  ageGroup: AgeGroup | undefined;
  site: Site;
  fundingSpaces: FundingSpace[];
  reportingPeriods: ReportingPeriod[];
  isChangeFunding?: boolean;
};

export const FundingField: React.FC<FundingFieldProps> = ({
  ageGroup,
  site,
  fundingSpaces,
  reportingPeriods,
  isChangeFunding = false,
}) => {
  const { data } = useGenericContext<Funding>(FormContext);

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
      (fs) =>
        fs.ageGroup === ageGroup && fs.organization.id === site.organization.id
    );
    setFundingSpaceOptions(_fundingSpaceOptions);

    const _fundingSourceOptions = new Set(
      _fundingSpaceOptions.map((fs) => fs.source)
    );

    setFundingSourceOptions(Array.from(_fundingSourceOptions));
  }, [ageGroup, site, fundingSpaces]);

  const radioOptions = [
    {
      render: (props: RadioOptionRenderProps) => (
        <RadioButton {...props} text="Private pay" />
      ),
      value: PRIVATE_PAY,
    },
    ...fundingSourceOptions.map((fundingSource) => ({
      render: (props: RadioOptionRenderProps) => (
        <RadioButton {...props} text={fundingSource} />
      ),
      value: fundingSource,
      expansion: (
        <FundingOptionExpansion
          fundingSpaceOptions={fundingSpaceOptions.filter(
            (fs) => fs.source === fundingSource
          )}
          reportingPeriodOptions={reportingPeriods.filter(
            (rp) => rp.type === fundingSource
          )}
          showLastReportingPeriod={!!data.lastReportingPeriod}
          isChangeFunding={isChangeFunding}
        />
      ),
    })),
  ];

  return (
    <RadioButtonGroup
      defaultValue={data.fundingSpace ? data.fundingSpace.source : PRIVATE_PAY}
      id="funding-source"
      name="funding-source"
      options={radioOptions}
      legend="Funding source options"
    />
  );
};

type FundingOptionExpansionProps = {
  fundingSpaceOptions: FundingSpace[];
  reportingPeriodOptions: ReportingPeriod[];
  showLastReportingPeriod?: boolean;
  isChangeFunding?: boolean;
};

const FundingOptionExpansion: React.FC<FundingOptionExpansionProps> = ({
  fundingSpaceOptions,
  reportingPeriodOptions,
  showLastReportingPeriod = false,
  isChangeFunding = false,
}) => {
  return (
    <>
      <ContractSpaceField
        fundingSpaceOptions={fundingSpaceOptions}
        isChangeFunding={isChangeFunding}
      />
      <ReportingPeriodField
        reportingPeriods={reportingPeriodOptions}
        isChangeFunding={isChangeFunding}
      />
      {showLastReportingPeriod && (
        <ReportingPeriodField
          reportingPeriods={reportingPeriodOptions}
          isLast={true}
          isChangeFunding={isChangeFunding}
        />
      )}
    </>
  );
};
