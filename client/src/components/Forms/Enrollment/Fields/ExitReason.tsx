import {
  Select,
  useGenericContext,
  FormContext,
  TObjectDriller,
} from '@ctoec/component-library';
import React from 'react';
import { ExitReason, Enrollment } from '../../../../shared/models';
import { Withdraw } from '../../../../shared/payloads';
import { getValidationStatusForField } from '../../../../utils/getValidationStatus';

export const ExitReasonField = <T extends Enrollment | Withdraw>({}) => {
  const { dataDriller, immutableUpdateData } = useGenericContext<T>(
    FormContext
  );

  const exitReason = dataDriller.at('exitReason');
  return (
    <Select
      id="exit-reason"
      label={<span className="text-bold">Exit reason</span>}
      options={Object.values(ExitReason).map((reason) => ({
        text: reason,
        value: reason,
      }))}
      onChange={(e) => {
        immutableUpdateData(exitReason, e.target.value);
      }}
      defaultValue={exitReason.value}
      // TODO make a version of this that has a more reasonable func signature
      // for use without form fields
      status={getValidationStatusForField(
        dataDriller as TObjectDriller<Enrollment>,
        exitReason.path,
        {}
      )}
    />
  );
};
