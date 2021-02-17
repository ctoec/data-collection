import React, { useState, useEffect } from 'react';
import {
  FundingSource,
  Funding,
  Enrollment,
  FundingSpace,
  EnrichedValidationError,
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
import { getValidationStatusForFields } from '../../../../utils/getValidationStatus';
import { HideErrorProps } from '../../types';
import { getCurrentFunding } from '../../../../utils/models';
import { getStrippedFundingSourceName } from '../../../../containers/Home/utils/getFundingSpaceDisplayName';

type FundingFieldProps<T> = {
  fundingAccessor?: (_: TObjectDriller<T>) => TObjectDriller<Funding>;
  getEnrollment: (_: TObjectDriller<T>) => Enrollment;
  organizationId: number;
  isEdit?: boolean;
  missingFundedEnrollmentError?: EnrichedValidationError;
} & HideErrorProps;

const fsToId = (fs: string) => fs.replace(/\s/g, '');

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
  missingFundedEnrollmentError,
  hideStatus,
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

  const currentFunding = getCurrentFunding({ enrollment });
  const selectedSource = fundingSourceOptions.find(
    (source: FundingSource) => source === currentFunding?.fundingSpace?.source
  );
  const defaultSelectedItemId = selectedSource
    ? fsToId(selectedSource)
    : undefined;

  return (
    <RadioButtonGroup
      // The radio buttons only really control what expansions are shown
      // They don't change any form data on their own
      key={selectedSource}
      id={`funding-source-${enrollment?.id}`}
      defaultSelectedItemId={defaultSelectedItemId}
      hint={
        !!enrollment?.ageGroup
          ? undefined
          : 'Choose an age group to see available funding types'
      }
      inputName="fundingSource"
      legend="Funding source options"
      showLegend
      status={
        hideStatus
          ? undefined
          : getValidationStatusForFields(enrollment, ['fundings']) ||
            getValidationStatusForFields(
              {
                validationErrors: missingFundedEnrollmentError
                  ? [missingFundedEnrollmentError]
                  : [],
              },
              ['enrollments']
            )
      }
      options={fundingSourceOptions.map((fundingSource) => {
        const id = fsToId(fundingSource);
        return {
          id,
          value: id,
          text: getStrippedFundingSourceName(fundingSource),
          onChange: () => {},
          expansion: (
            <>
              <ContractSpaceField<T>
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
      })}
    />
  );
};
