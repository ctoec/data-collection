import { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { ReadOnlyDataCache } from './DataCacheContext';
import { apiGet } from '../../utils/api';

export const useReadOnlyCache = <T extends { id: any }>(apiPath: string) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [haveFetched, setHaveFetched] = useState(false);

  const refetch = () => setHaveFetched(false);
  const getRecordById = (id: number | string) =>
    records.find((r) => r.id === id);

  useEffect(() => {
    if (!haveFetched && accessToken) {
      setLoading(true);
      apiGet(apiPath, accessToken)
        .then((_records) => {
          if (_records) setRecords(_records);
        })
        .finally(() => {
          setLoading(false);
          setHaveFetched(true);
        });
    }
  }, [accessToken, apiPath, haveFetched]);

  return {
    records,
    loading,
    refetch,
    getRecordById,
  } as ReadOnlyDataCache<T>;
};
