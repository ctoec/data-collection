import { useCallback, useEffect, useRef } from 'react';

// From https://dev.to/rodw1995/cancel-your-promises-when-a-component-unmounts-gkl
export default (): (() => boolean) => {
  const mountedRef = useRef<boolean>(false);

  // Basically the same as "useDidMount" because it has no dependencies
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      // The cleanup function of useEffect is called by React on unmount
      mountedRef.current = false;
    };
  }, []);

  return useCallback(() => mountedRef.current, []);
};
