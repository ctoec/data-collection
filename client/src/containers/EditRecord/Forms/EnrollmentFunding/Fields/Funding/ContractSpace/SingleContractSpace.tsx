import React, { useEffect } from 'react';
import { useGenericContext, FormContext } from '@ctoec/component-library';
import { FundingSpace, Funding } from '../../../../../../../shared/models';
import { ChangeFunding } from '../../../../../../../shared/payloads/ChangeFunding';
import { getContractSpaceString } from './common';

type SingleContractSpaceProps = {
  fundingSpace: FundingSpace;
};

export const FundingSingleContractSpaceField: React.FC<SingleContractSpaceProps> = ({
  fundingSpace,
}) => {
  const { updateData, data } = useGenericContext<Funding>(FormContext);
  const currentFundingSpaceId = data?.fundingSpace?.id;

  useEffect(() => {
    if (currentFundingSpaceId !== fundingSpace.id) {
      updateData((_data) => ({
        ..._data,
        fundingSpace,
      }));
    }
  }, [fundingSpace]);

  return (
    <div>
      <span className="usa-hint text-italic">
        {getContractSpaceString(fundingSpace)}
      </span>
    </div>
  );
};

export const ChangeFundingSingleContractSpaceField: React.FC<SingleContractSpaceProps> = ({
  fundingSpace,
}) => {
  const { updateData, data } = useGenericContext<ChangeFunding>(FormContext);
  const currentFundingSpaceId = data?.newFunding?.fundingSpace?.id;

  useEffect(() => {
    if (currentFundingSpaceId !== fundingSpace.id) {
      updateData((_data) => ({
        ..._data,
        newFunding: {
          ..._data.newFunding,
          fundingSpace,
        } as Funding,
      }));
    }
  }, [fundingSpace]);

  return (
    <div>
      <span className="usa-hint text-italic">
        {getContractSpaceString(fundingSpace)}
      </span>
    </div>
  );
};
