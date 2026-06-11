import { useEffect, useRef, useState } from 'react';

export const useAsync = (asyncFn, deps = [], { immediate = true } = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const fnRef = useRef(asyncFn);
  fnRef.current = asyncFn;

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { execute, loading, error, data, setData };
};

