const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'];

const GenreFilter = ({ selected, onSelect }) => (
  <div className="flex flex-wrap gap-3">
    {genres.map((genre) => {
      const active = selected === genre;
      return (
        <button
          key={genre}
          type="button"
          onClick={() => onSelect(active ? null : genre)}
          className={`rounded-full border px-4 py-1 text-sm transition ${
            active ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 text-white/70 hover:text-white'
          }`}
        >
          {genre}
        </button>
      );
    })}
  </div>
);

export default GenreFilter;

