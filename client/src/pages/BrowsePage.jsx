import { useEffect, useState } from 'react';
import GenreFilter from '../components/anime/GenreFilter.jsx';
import AnimeCard from '../components/anime/AnimeCard.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { animeApi } from '../api/anime.api.js';

const BrowsePage = () => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState(null);
  const [sort, setSort] = useState('popular');
  const [anime, setAnime] = useState([]);
  const [meta, setMeta] = useState({ page: 1 });
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 400);

  const fetchAnime = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await animeApi.list({
        search: debouncedSearch || undefined,
        genres: genre || undefined,
        sort,
        page,
      });
      setAnime(data.data);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(meta.page || 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, genre, sort]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/5 bg-secondary/40 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl">Browse Library</h1>
            <p className="text-white/60">Search thousands of titles by genre, theme, and vibe.</p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search anime..."
            className="w-full rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white focus:border-primary md:w-80"
          />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <GenreFilter selected={genre} onSelect={setGenre} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
          <label className="flex items-center gap-2">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-white/10 bg-black/40 px-4 py-1"
            >
              <option value="popular">Popularity</option>
              <option value="recent">Recently Added</option>
            </select>
          </label>
        </div>
      </div>

      {loading ? (
        <Loader message="Fetching anime catalog..." />
      ) : anime.length ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {anime.map((item) => (
            <AnimeCard key={item._id} anime={item} />
          ))}
        </div>
      ) : (
        <EmptyState title="No anime found" description="Try changing the filters or search term." />
      )}

      {meta.pages > 1 && (
        <div className="flex justify-center gap-3">
          {Array.from({ length: meta.pages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                type="button"
                key={page}
                onClick={() => fetchAnime(page)}
                className={`h-10 w-10 rounded-full border ${
                  page === meta.page ? 'border-primary text-primary' : 'border-white/10 text-white/60'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;

