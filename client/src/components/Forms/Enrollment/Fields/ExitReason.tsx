import {
  Select,
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import React from 'react';
import { ExitReason, Enrollment } from '../../../../shared/models';
import { WithdrawRequest } from '../../../../shared/payloads';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

export const ExitReasonField = <T extends Enrollment | WithdrawRequest>({}) => {
  const { dataDriller, immutableUpdateData } = useGenericContext<T>(
    FormContext
  );
  return (
    <Select
      id="exit-reason"
      label={<span className="text-bold">Exit reason</span>}
      options={Object.values(ExitReason).map((reason) => ({
        text: reason,
        value: reason,
      }))}
      onChange={(e) => {
        immutableUpdateData(dataDriller.at('exitReason'), e.target.value);
      }}
      // TODO make a version of this that has a more reasonable func signature
      // for use without form fields
      status={getValidationStatusForField(
        dataDriller as TObjectDriller<Enrollment>,
        dataDriller.at('exitReason').path,
        {}
      )}
    />
  );
};
