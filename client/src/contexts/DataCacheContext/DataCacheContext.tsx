import React, { createContext } from 'react';
import { Child, FundingSpace, ReportingPeriod } from '../../shared/models';
import { useReadWriteCache } from './useReadWriteCache';
import { useReadOnlyCache } from './useReadOnlyCache';

export type ReadOnlyDataCache<T> = {
  records: T[];
  loading: boolean;
  refetch: () => void;
};

export type ReadWriteDataCache<T> = ReadOnlyDataCache<T> & {
  addOrUpdateRecord: (record: T) => void;
  deleteRecordById: (id: string) => void;
};

export type DataCacheContextType = {
  children: ReadWriteDataCache<Child>;
  fundingSpaces: ReadOnlyDataCache<FundingSpace>;
  reportingPeriods: ReadOnlyDataCache<ReportingPeriod>;
};

const DataCacheContext = createContext<DataCacheContextType>({
  children: {
    records: [],
    addOrUpdateRecord: (_) => {},
    deleteRecordById: (_) => {},
    loading: true,
    refetch: () => {},
  },
  fundingSpaces: { records: [], loading: true, refetch: () => {} },
  reportingPeriods: { records: [], loading: true, refetch: () => {} },
});

const { Provider, Consumer } = DataCacheContext;

const DataCacheProvider: React.FC = ({ children: childNodes }) => {
  const childCache = useReadWriteCache<Child>('/children');
  const reportingPeriodCache = useReadOnlyCache<ReportingPeriod>(
    '/reporting-periods'
  );
  const fundingSpaceCache = useReadOnlyCache<FundingSpace>('/funding-spaces');
  return (
    <Provider
      value={{
        children: childCache,
        reportingPeriods: reportingPeriodCache,
        fundingSpaces: fundingSpaceCache,
      }}
    >
      {childNodes}
    </Provider>
  );
};

export { DataCacheProvider };
export { Consumer as DataCacheConsumer };
export default DataCacheContext;
