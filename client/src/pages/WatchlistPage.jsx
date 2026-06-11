import { useEffect, useState } from 'react';
import AnimeCard from '../components/anime/AnimeCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { userApi } from '../api/user.api.js';

const WatchlistPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userApi.getWatchlist();
      setList(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">My Watchlist</h1>
        <p className="text-white/60">Quick access to anime you saved for later.</p>
      </div>
      {loading ? (
        <Loader message="Loading watchlist..." />
      ) : list.length ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((anime) => (
            <AnimeCard key={anime._id} anime={anime} />
          ))}
        </div>
      ) : (
        <EmptyState title="Watchlist is empty" description="Start adding anime to see them here." />
      )}
    </div>
  );
};

export default WatchlistPage;

