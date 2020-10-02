import React, { createContext, useState, useEffect, useContext } from 'react';
import { Child } from '../../shared/models';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { apiGet } from '../../utils/api';

type ReadOnlyDataCache<T> = {
  records: T[];
  loading: boolean;
};
type ReadWriteDataCache<T> = ReadOnlyDataCache<T> & {
  addOrUpdateRecord: (record: T) => void;
};

export type DataCacheContextType = {
  children: ReadWriteDataCache<Child>;
};

const DataCacheContext = createContext<DataCacheContextType>({
  children: { records: [], addOrUpdateRecord: (_) => {}, loading: true },
});

const { Provider, Consumer } = DataCacheContext;

const DataCacheProvider: React.FC = ({ children: childNodes }) => {
  // CHILD CACHE
  const [children, setChildren] = useState<Child[]>([]);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [haveFetchedChildren, setHaveFetchedChildren] = useState(false);
  const addOrUpdateChild = (_record: Child) => {
    setChildren((existingRecords) => [
      ...existingRecords.filter((r) => r.id !== _record.id),
      _record,
    ]);
  };
  const childCache = {
    records: children,
    loading: childrenLoading,
    addOrUpdateRecord: addOrUpdateChild,
  };
  // END CHILD CACHE

  const { accessToken } = useContext(AuthenticationContext);
  useEffect(() => {
    if (!haveFetchedChildren) {
      setChildrenLoading(true);
      apiGet('children', { accessToken })
        .then((_children) => {
          if (_children) setChildren(_children);
        })
        .finally(() => {
          setChildrenLoading(false);
          setHaveFetchedChildren(true);
        });
    }
  }, [accessToken]);

  return <Provider value={{ children: childCache }}>{childNodes}</Provider>;
};

export { DataCacheProvider };
export { Consumer as DataCacheConsumer };
export default DataCacheContext;
