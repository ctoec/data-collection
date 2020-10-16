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
import DataCacheContext from '../../../../../contexts/DataCacheContext/DataCacheContext';
import { getValidationStatusForFields } from '../../../../../utils/getValidationStatus';

type ReportingPeriodProps<T> = {
  accessor: (_: TObjectDriller<T>) => TObjectDriller<ReportingPeriod>;
  fundingSource: FundingSource;
  getFunding: (_: TObjectDriller<T>) => Funding;
  isLast?: boolean;
  label?: string;
  optional?: boolean;
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
  getFunding,
  isLast,
  label,
  optional,
}: ReportingPeriodProps<T>) => {
  const { reportingPeriods } = useContext(DataCacheContext);

  const { dataDriller } = useGenericContext<T>(FormContext);
  const [reportingPeriodOptions, setReportingPeriodOptions] = useState<
    ReportingPeriod[]
  >([]);
  const funding = getFunding(dataDriller);

  const currentReportingPeriod = accessor(dataDriller).value;
  useEffect(() => {
    // Only display 5 options, centered around existing value or today
    // No need to account for "isChangeFunding", because in that situation
    // a reporting period value will never exist
    const existingValueOrThisMonth =
      currentReportingPeriod?.period || moment.utc().startOf('month');
    const twoMonthsPrior = existingValueOrThisMonth.clone().add(-2, 'months');
    const twoMonthsAfter = existingValueOrThisMonth.clone().add(2, 'months');
    const _reportingPeriodOptions = reportingPeriods.records.filter(
      (rp) =>
        rp.type === fundingSource &&
        rp.period.isSameOrAfter(twoMonthsPrior) &&
        rp.period.isSameOrBefore(twoMonthsAfter)
    );

    setReportingPeriodOptions(_reportingPeriodOptions);
  }, [reportingPeriods, fundingSource, currentReportingPeriod]);

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
      status={(data, _, props) =>
        getValidationStatusForFields(funding, [
          isLast ? 'lastReportingPeriod' : 'firstReportingPeriod',
        ])
      }
    />
  );
};
