import React, { useState, useEffect, useContext } from 'react';
import {
  ReportingPeriod,
  Funding,
  Enrollment,
  FundingSource,
} from '../../../../../shared/models';
import {
  useGenericContext,
  FormContext,
  SelectProps,
  FormField,
  Select,
  TObjectDriller,
} from '@ctoec/component-library';
import moment from 'moment';
import {
  ChangeFunding,
  ChangeEnrollment,
  Withdraw,
} from '../../../../../shared/payloads';
import { reportingPeriodFormatter } from '../../../../../utils/formatters';
import { getValidationStatusForField } from '../../../../../utils/getValidationStatus';
import { FieldStatusFunc } from '@ctoec/component-library/dist/components/Form/FormStatusFunc';
import { useAuthenticatedSWR } from '../../../../../hooks/useAuthenticatedSWR';
import { stringify } from 'query-string';
import { getShortFundingSourceName } from '../../../../../utils/models';

type ReportingPeriodProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<ReportingPeriod>;
  fundingSource: FundingSource;
  isLast?: boolean;
  label?: string;
  optional?: boolean;
  showStatus?: boolean;
};

/**
 * Component for altering the first or last reporting period on a
 * funding.
 *
 * Expects that provided reporting periods are already filtered by FundingSource;
 * this component does not do any funding source checking/filtering
 */
export const ReportingPeriodField = <
  T extends Funding | ChangeFunding | Withdraw | ChangeEnrollment | Enrollment
>({
  accessor,
  fundingSource,
  isLast,
  label,
  optional,
  showStatus = true,
}: ReportingPeriodProps<T>) => {
  const { data: reportingPeriods } = useAuthenticatedSWR<ReportingPeriod[]>(
    `reporting-periods?${stringify({
      source: getShortFundingSourceName(fundingSource),
    })}`
  );

  const { dataDriller } = useGenericContext<T>(FormContext);
  const [reportingPeriodOptions, setReportingPeriodOptions] = useState<
    ReportingPeriod[]
  >([]);

  const currentReportingPeriod = accessor(dataDriller).value;
  useEffect(() => {
    if (!reportingPeriods) return;
    // Only display 5 options, centered around existing value or today
    // No need to account for "isChangeFunding", because in that situation
    // a reporting period value will never exist
    const existingValueOrThisMonth =
      currentReportingPeriod?.period || moment.utc().startOf('month');
    const twoMonthsPrior = existingValueOrThisMonth.clone().add(-2, 'months');
    const twoMonthsAfter = existingValueOrThisMonth.clone().add(2, 'months');
    const _reportingPeriodOptions = reportingPeriods.filter(
      (rp) =>
        rp.type === fundingSource &&
        rp.period.isSameOrAfter(twoMonthsPrior) &&
        rp.period.isSameOrBefore(twoMonthsAfter)
    );

    setReportingPeriodOptions(_reportingPeriodOptions);
  }, [reportingPeriods, fundingSource, currentReportingPeriod]);

  const statusFunc: FieldStatusFunc<T, SelectProps> = (
    data: TObjectDriller<T>,
    _,
    props
  ) => {
    let objDriller: TObjectDriller<Funding> = data as TObjectDriller<Funding>;

    //  Properly handle status changes when pertaining directly to enrollments as well
    if ((data as TObjectDriller<Enrollment>).at('fundings').value) {
      objDriller = (data as TObjectDriller<Enrollment>).at('fundings').at(0);
    } else if (
      (data as TObjectDriller<ChangeEnrollment>)
        .at('newEnrollment')
        .at('fundings').value
    ) {
      objDriller = (data as TObjectDriller<ChangeEnrollment>)
        .at('newEnrollment')
        .at('fundings')
        .at(0);
    }

    return getValidationStatusForField(
      objDriller,
      isLast ? 'lastReportingPeriod' : 'firstReportingPeriod',
      props
    );
  };

  return (
    <FormField<T, SelectProps, number | null>
      getValue={(data) => accessor(data).at('id')}
      parseOnChangeEvent={(e) => parseInt(e.target.value) || null}
      inputComponent={Select}
      id={`${isLast ? 'last' : 'first'}-reporting-period`}
      name={`${isLast ? 'last' : 'first'}-reporting-period`}
      label={label || `${isLast ? 'Last' : 'First'} reporting period`}
      options={reportingPeriodOptions.map((rp) => ({
        text: reportingPeriodFormatter(rp),
        value: `${rp.id}`,
      }))}
      optional={optional}
      status={
        showStatus ? (statusFunc as FieldStatusFunc<T, SelectProps>) : undefined
      }
    />
  );
};
