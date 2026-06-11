import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { userApi } from '../api/user.api.js';
import { useAuth } from './AuthContext.jsx';

const PlayerContext = createContext({
  current: null,
  continueWatching: [],
  setCurrent: () => {},
  saveProgress: async () => {},
});

export const PlayerProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [current, setCurrent] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);

  useEffect(() => {
    setContinueWatching(user?.continueWatching || []);
  }, [user]);

  const saveProgress = async (payload) => {
    if (!isAuthenticated) return;
    setContinueWatching((prev) => {
      const filtered = prev.filter((item) => item.anime !== payload.anime);
      return [...filtered, payload];
    });
    await userApi.saveProgress(payload);
  };

  const value = useMemo(
    () => ({
      current,
      setCurrent,
      continueWatching,
      setContinueWatching,
      saveProgress,
    }),
    [current, continueWatching, isAuthenticated]
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = () => useContext(PlayerContext);

