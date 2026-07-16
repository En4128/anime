import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroSlider = ({ items = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;
  const active = items[index];

  const navigate = (direction) => {
    setIndex((prev) => {
      if (direction === 'next') return (prev + 1) % items.length;
      return (prev - 1 + items.length) % items.length;
    });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10">
      {/* Background slides */}
      {items.map((item, idx) => (
        <div
          key={item._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === index ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Gradient base — always visible so content is legible even when image fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900" />

          {/* Banner/poster image — hidden via onError if it fails to load */}
          {(item.bannerImage || item.posterImage) && (
            <img
              src={item.bannerImage || item.posterImage}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover opacity-70"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}

          {/* Overlay gradients for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/80 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:max-w-2xl">
        <div className="animate-slide-up space-y-6">
          <div className="flex items-center gap-3">
            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold uppercase text-white">
              Featured
            </span>
            <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/60">
              <span>{active.releaseYear}</span>
              {active.status && (
                <>
                  <span>•</span>
                  <span>{active.status}</span>
                </>
              )}
            </span>
          </div>

          <h1 className="font-righteous text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl drop-shadow-[0_0_15px_rgba(255,107,0,0.2)]">
            {active.title}
          </h1>

          <p className="line-clamp-3 text-base text-white/80 md:text-lg">
            {active.synopsis}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {active.genres?.slice(0, 3).map((g) => (
              <span key={g} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link
              to={`/anime/${active.slug}`}
              className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105 hover:shadow-glow cursor-pointer"
            >
              <span className="relative z-10">Watch Now</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/browse"
              className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10 cursor-pointer"
            >
              <span>More Info</span>
              <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <button
          onClick={() => navigate('prev')}
          className="group rounded-full border border-white/10 bg-black/20 p-3 text-white backdrop-blur-md transition hover:bg-primary hover:border-primary cursor-pointer active:scale-90"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => navigate('next')}
          className="group rounded-full border border-white/10 bg-black/20 p-3 text-white backdrop-blur-md transition hover:bg-primary hover:border-primary cursor-pointer active:scale-90"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-8 flex gap-2 md:left-16">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${idx === index ? 'w-8 bg-primary' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
