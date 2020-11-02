import React, { useState, useEffect, useContext } from 'react';
import {
  FundingSource,
  Funding,
  Enrollment,
  FundingSpace,
} from '../../../../shared/models';
import {
  RadioButtonGroup,
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import { ContractSpaceField, ReportingPeriodField } from '../Funding/Fields';
import { ChangeFunding, ChangeEnrollment } from '../../../../shared/payloads';
import { stringify } from 'querystring';
import { useAuthenticatedSWR } from '../../../../hooks/useAuthenticatedSWR';

const UNFUNDED = 'Unfunded';

type FundingFieldProps<T> = {
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
  getEnrollment: (_: TObjectDriller<T>) => Enrollment;
  organizationId: number;
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
  organizationId,
  isEdit,
}: FundingFieldProps<T>) => {
  const { data: fundingSpaces } = useAuthenticatedSWR<FundingSpace[]>(
    `funding-spaces?${stringify({ organizationId })}`
  );
  const { dataDriller } = useGenericContext<T>(FormContext);
  const enrollment = getEnrollment(dataDriller);

  const [fundingSourceOptions, setFundingSourceOptions] = useState<
    FundingSource[]
  >([]);

  // Funding source options is the deduped list of funding sources
  // from the funding spaces associated with the given site and agegroup
  // for the enrollment.
  useEffect(() => {
    if (!fundingSpaces) return;
    const _fundingSourceOptions = new Set(
      fundingSpaces
        .filter((fs) => fs.ageGroup === enrollment.ageGroup)
        .map((fs) => fs.source)
    );

    setFundingSourceOptions(Array.from(_fundingSourceOptions));
  }, [enrollment, fundingSpaces?.length]);

  return (
    <RadioButtonGroup
      // The radio buttons only really control what expansions are shown
      // They don't change any form data on their own
      id="funding-source"
      inputName="fundingSource"
      legend="Funding source options"
      showLegend
      defaultSelectedItemId={UNFUNDED}
      options={[
        {
          text: UNFUNDED,
          id: UNFUNDED,
          value: UNFUNDED,
          onChange: () => {},
        },
        ...fundingSourceOptions.map((fundingSource) => {
          const id = fundingSource.replace(/\s/g, '-');
          return {
            id,
            value: id,
            text: fundingSource,
            onChange: () => {},
            expansion: (
              <>
                <ContractSpaceField<T>
                  // Do not show status when field is editing an existing funding
                  // because the user will be creating this data for the first time
                  showStatus={!isEdit}
                  ageGroup={enrollment.ageGroup}
                  fundingSource={fundingSource}
                  organizationId={organizationId}
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
          };
        }),
      ]}
    />
  );
};
