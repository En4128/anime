import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animeApi } from '../../api/anime.api.js';
import Loader from '../common/Loader.jsx';

const ContinueWatchingList = ({ items = [] }) => {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await Promise.all(
          items.map(async (item) => {
            const { data: animeRes } = await animeApi.getById(item.anime);
            return { ...item, anime: animeRes.data };
          })
        );
        const map = {};
        data.forEach((entry) => {
          map[entry.anime._id] = entry;
        });
        setDetails(map);
      } finally {
        setLoading(false);
      }
    };
    if (items.length) {
      loadDetails();
    } else {
      setDetails({});
    }
  }, [items]);

  if (!items.length) return null;

  return (
    <section className="mt-10 space-y-4">
      <h2 className="font-display text-2xl">Continue Watching</h2>
      {loading && <Loader message="Fetching titles..." />}
      <div className="grid gap-4 md:grid-cols-2">
        {Object.values(details).map((item) => (
          <Link
            key={item.anime._id}
            to={`/watch/${item.anime._id}/${item.episode}`}
            className="flex gap-4 rounded-2xl border border-white/5 bg-secondary/30 p-4 hover:border-primary"
          >
            <img
              src={item.anime.posterImage}
              alt={item.anime.title}
              className="h-24 w-20 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="text-sm uppercase text-white/60">Episode {item.progress ? Math.ceil(item.progress / 60) : 1}</p>
              <h3 className="font-semibold">{item.anime.title}</h3>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${Math.min(100, (item.progress / item.duration) * 100 || 0)}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingList;

