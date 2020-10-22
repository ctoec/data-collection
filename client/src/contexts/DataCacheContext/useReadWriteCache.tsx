import { useState, useEffect, useContext } from 'react';
import { apiGet } from '../../utils/api';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { ReadWriteDataCache } from './DataCacheContext';

export const useReadWriteCache = <T extends { id: any }>(apiPath: string) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [haveFetched, setHaveFetched] = useState(false);

  const addOrUpdateRecord = (_record: T) => {
    setRecords((existingRecords) => [
      ...existingRecords.filter((r) => r.id !== _record.id),
      _record,
    ]);
  };

  const removeRecordById = (id: string) => {
    setRecords((existingRecords) => [
      ...existingRecords.filter((r) => r.id !== id),
    ]);
  };

  const getRecordById = (id: number | string) =>
    records.find((r) => r.id === id);

  const refetch = () => setHaveFetched(false);

  useEffect(() => {
    if (!haveFetched && accessToken) {
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
  }, [apiPath, accessToken, haveFetched]);

  return {
    records,
    loading,
    addOrUpdateRecord,
    removeRecordById,
    getRecordById,
    refetch,
  } as ReadWriteDataCache<T>;
};
