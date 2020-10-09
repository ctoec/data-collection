import { useContext, useState, useEffect } from 'react';
import AuthenticationContext from '../AuthenticationContext/AuthenticationContext';
import { ReadOnlyDataCache } from './DataCacheContext';
import { apiGet } from '../../utils/api';

export const useReadOnlyCache = <T extends { id: any }>(apiPath: string) => {
  const { accessToken } = useContext(AuthenticationContext);
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [haveFetched, setHaveFetched] = useState(false);

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
  }, [accessToken, apiPath, haveFetched]);

  return {
    records,
    loading,
    refetch,
  } as ReadOnlyDataCache<T>;
};