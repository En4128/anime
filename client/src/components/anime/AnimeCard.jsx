import { Link } from 'react-router-dom';
import { HeartIcon, PlayIcon, StarIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useState } from 'react';

// Reliable fallback poster images mapped by index (cycles through)
const FALLBACK_COLORS = [
  'from-orange-600 to-red-800',
  'from-purple-600 to-indigo-800',
  'from-blue-600 to-cyan-800',
  'from-green-600 to-teal-800',
  'from-pink-600 to-rose-800',
  'from-yellow-600 to-orange-800',
  'from-indigo-600 to-purple-800',
  'from-teal-600 to-green-800',
];

const AnimeCard = ({ anime, onLike, isLiked, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const gradient = FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
      {/* Poster Image */}
      <div className="relative overflow-hidden rounded-t-2xl aspect-[2/3]">
        {anime.posterImage && !imgError ? (
          <img
            src={anime.posterImage}
            alt={anime.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Gradient fallback when image fails */
          <div className={`h-full w-full bg-gradient-to-b ${gradient} flex flex-col items-center justify-center p-4`}>
            <span className="text-4xl mb-2">🎌</span>
            <span className="text-center text-sm font-bold text-white/90 leading-tight">{anime.title}</span>
          </div>
        )}

        {/* Hover play overlay */}
        <Link
          to={`/anime/${anime.slug}`}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-glow">
            <PlayIcon className="h-6 w-6 text-secondary" />
          </div>
        </Link>

        {/* Like button top-right */}
        {onLike && (
          <button
            type="button"
            className={clsx(
              'absolute right-2 top-2 rounded-full border p-1.5 backdrop-blur-sm transition',
              isLiked
                ? 'border-primary/60 bg-primary/30 text-primary'
                : 'border-white/20 bg-black/40 text-white/60 hover:text-primary'
            )}
            onClick={() => onLike(anime._id)}
          >
            <HeartIcon className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Status badge */}
        <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur-sm">
          {anime.status}
        </span>
      </div>

      {/* Card Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link
          to={`/anime/${anime.slug}`}
          className="line-clamp-1 font-semibold text-white hover:text-primary transition-colors"
        >
          {anime.title}
        </Link>

        <p className="text-[11px] uppercase tracking-wide text-white/50 line-clamp-1">
          {anime.genres?.join(' · ')}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <StarIcon className="h-3 w-3 text-yellow-400" />
            <span className="text-yellow-300 font-medium">
              {anime.rating?.toFixed?.(1) ?? anime.rating}
            </span>
          </span>
          <span>{anime.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
