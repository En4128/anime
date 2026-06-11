import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { animeApi } from '../api/anime.api.js';
import Loader from '../components/common/Loader.jsx';
import EpisodeList from '../components/anime/EpisodeList.jsx';
import CommentSection from '../components/anime/CommentSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { userApi } from '../api/user.api.js';

const AnimeDetailsPage = () => {
  const { slug } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, refreshProfile } = useAuth();

  const loadAnime = async () => {
    setLoading(true);
    try {
      const { data } = await animeApi.getBySlug(slug);
      setAnime(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnime();
  }, [slug]);

  if (loading || !anime) {
    return <Loader message="Loading anime..." />;
  }

  const inWatchlist = user?.watchlist?.some?.((id) => id === anime._id);
  const liked = user?.likedAnime?.some?.((id) => id === anime._id);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) return;
    await userApi.toggleWatchlist(anime._id);
    await refreshProfile();
  };

  const toggleLike = async () => {
    if (!isAuthenticated) return;
    await animeApi.like(anime._id);
    await refreshProfile();
    loadAnime();
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-3xl border border-white/5 bg-secondary/30 p-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-primary">{anime.status}</span>
          <h1 className="font-display text-4xl">{anime.title}</h1>
          <p className="text-sm text-white/70">{anime.synopsis}</p>
          <div className="flex flex-wrap gap-3 text-xs uppercase text-white/60">
            <span>⭐ {anime.rating?.toFixed?.(1) ?? anime.rating}</span>
            <span>{anime.releaseYear}</span>
            <span>{anime.genres?.join(' • ')}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={toggleWatchlist}
              className={`rounded-full px-6 py-2 text-sm font-semibold ${
                inWatchlist ? 'bg-white/10 text-white' : 'bg-primary text-secondary'
              }`}
            >
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={`rounded-full border px-6 py-2 text-sm ${
                liked ? 'border-primary text-primary' : 'border-white/20 text-white/80'
              }`}
            >
              {liked ? 'Liked' : 'Like'}
            </button>
            {anime.episodes?.length > 0 && (
              <Link
                to={`/watch/${anime._id}/${anime.episodes[0]._id}`}
                className="rounded-full border border-white/20 px-6 py-2 text-sm text-white"
              >
                Start Episode 1
              </Link>
            )}
          </div>
        </div>
        <img src={anime.bannerImage || anime.posterImage} alt={anime.title} className="w-full rounded-2xl object-cover" />
      </section>

      <EpisodeList anime={anime} episodes={anime.episodes} />
      <CommentSection animeId={anime._id} />
    </div>
  );
};

export default AnimeDetailsPage;

