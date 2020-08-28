import React, { useState, useEffect } from 'react';
import { ReportingPeriod, Funding } from '../../../../../../shared/models';
import {
  useGenericContext,
  FormContext,
  SelectProps,
  FormField,
  Select,
} from '@ctoec/component-library';
import moment from 'moment';
import { ChangeFunding } from '../../../../../../shared/payloads/ChangeFunding';

type LastReportingPeriodProps = {
  reportingPeriods: ReportingPeriod[];
  isLast?: boolean;
  isChangeFunding?: boolean;
};

export const ReportingPeriodField: React.FC<LastReportingPeriodProps> = ({
  reportingPeriods,
  isLast = false,
  isChangeFunding = false,
}) => {
  const { data } = useGenericContext<Funding>(FormContext);
  const [reportingPeriodOptions, setReportingPeriodOptions] = useState<
    ReportingPeriod[]
  >([]);

  useEffect(() => {
    // Only display 5 options, centered around existing value or today
    const existingValueOrThisMonth =
      (isLast
        ? data.lastReportingPeriod?.period
        : data.firstReportingPeriod?.period) || moment.utc().startOf('month');
    const twoMonthsPrior = existingValueOrThisMonth.clone().add(-2, 'months');
    const twoMonthsAfter = existingValueOrThisMonth.clone().add(2, 'months');
    const _reportingPeriodOptions = reportingPeriods.filter(
      (rp) =>
        rp.period.isSameOrAfter(twoMonthsPrior) &&
        rp.period.isSameOrBefore(twoMonthsAfter)
    );

    setReportingPeriodOptions(_reportingPeriodOptions);
  }, [reportingPeriods]);

  const commonProps = {
    parseOnChangeEvent: (e: React.ChangeEvent<any>) =>
      parseInt(e.target.value) || null,
    inputComponent: Select,
    id: !isLast ? 'first-reporting-period' : 'last-reporting-period',
    name: !isLast ? 'first-reporting-period' : 'last-reporting-period',
    label: !isLast
      ? 'First reporting period'
      : !isChangeFunding
      ? 'Last reporting period'
      : 'Last reporting period for current funding',
    options: reportingPeriodOptions.map((rp) => ({
      text: getReportingPeriodString(rp),
      value: `${rp.id}`,
    })),
  };

  return isChangeFunding ? (
    <FormField<ChangeFunding, SelectProps, number | null>
      getValue={(data) =>
        isLast
          ? data.at('oldFunding').at('lastReportingPeriod').at('id')
          : data.at('newFunding').at('firstReportingPeriod').at('id')
      }
      {...commonProps}
    />
  ) : (
    <FormField<Funding, SelectProps, number | null>
      getValue={(data) =>
        data
          .at(!isLast ? 'firstReportingPeriod' : 'lastReportingPeriod')
          .at('id')
      }
      {...commonProps}
    />
  );
};

const getReportingPeriodString = (reportingPeriod: ReportingPeriod) =>
  `${reportingPeriod.period.format(
    'MMMM YYYY'
  )} (${reportingPeriod.periodStart.format(
    'M/D'
  )}-${reportingPeriod.periodEnd.format('M/D')})`;
