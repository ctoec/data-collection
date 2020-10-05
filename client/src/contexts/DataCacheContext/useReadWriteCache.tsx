import { useState, useEffect, useContext } from 'react';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { ReadWriteDataCache } from './DataCacheContext';

export const useReadWriteCache = <T extends { id: any }>(apiPath: string) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [haveFetched, setHaveFetched] = useState(false);

  const addOrUpdateRecord = (_record: T) => {
    setRecords((existingRecords) => [
      ...existingRecords.filter((r) => r.id !== _record.id),
      _record,
    ]);
  };

  const refetch = () => setHaveFetched(false);

  useEffect(() => {
    if (!haveFetched) {
      setLoading(true);
      apiGet(apiPath, { accessToken })
        .then((_records) => {
          if (_records) setRecords(_records);
        })
        .finally(() => {
          setLoading(false);
          setHaveFetched(true);
        });
    }
  }, [accessToken, haveFetched]);

  return {
    records,
    loading,
    addOrUpdateRecord,
    refetch,
  } as ReadWriteDataCache<T>;
};
