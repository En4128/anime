import AnimeCard from './AnimeCard.jsx';

const CarouselRow = ({ title, description, items = [], onLike, likedIds = [] }) => {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="font-righteous text-2xl font-bold tracking-wider text-white md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm font-medium text-white/50">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {items.map((anime, i) => (
          <AnimeCard
            key={anime._id}
            anime={anime}
            onLike={onLike}
            isLiked={likedIds.includes(anime._id)}
            index={i}
          />
        ))}
      </div>
    </section>
  );
};

export default CarouselRow;
