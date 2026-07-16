import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const RANK_COLORS = ['bg-yellow-500', 'bg-slate-400', 'bg-amber-600', 'bg-primary', 'bg-primary'];

const SidebarItem = ({ item, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/anime/${item.slug}`}
      className="group flex gap-4 transition-transform hover:translate-x-1"
    >
      <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        {item.posterImage && !imgError ? (
          <img
            src={item.posterImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-indigo-700 to-purple-900 flex items-center justify-center">
            <span className="text-xs">🎌</span>
          </div>
        )}
        {/* Rank badge */}
        <div className={`absolute left-0 top-0 flex h-5 w-5 items-center justify-center ${RANK_COLORS[index] || 'bg-primary'} text-[10px] font-bold text-white`}>
          {index + 1}
        </div>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <h4 className="line-clamp-2 text-sm font-bold text-white transition-colors group-hover:text-primary leading-snug">
          {item.title}
        </h4>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
          <div className="flex items-center gap-1 text-yellow-400">
            <StarIcon className="h-3 w-3" />
            <span className="font-medium">{item.rating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {item.genres?.slice(0, 2).map((genre) => (
            <span
              key={genre}
              className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const TopAiringSidebar = ({ items = [] }) => {
  return (
    <div className="rounded-2xl bg-secondary-light/30 p-6 ring-1 ring-white/5">
      <h3 className="mb-6 font-righteous text-xl font-bold tracking-wide text-white">Top Airing</h3>
      <div className="space-y-5">
        {items.slice(0, 5).map((item, index) => (
          <SidebarItem key={item._id} item={item} index={index} />
        ))}
      </div>
      <Link
        to="/browse?sort=trending"
        className="mt-8 block w-full rounded-xl bg-white/5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10 cursor-pointer"
      >
        View Full List
      </Link>
    </div>
  );
};

export default TopAiringSidebar;
