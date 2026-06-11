import { Link } from 'react-router-dom';

const EpisodeList = ({ anime, episodes = [] }) => (
  <div className="space-y-3 rounded-2xl border border-white/5 bg-secondary/40 p-4">
    <h3 className="font-semibold text-white">Episodes</h3>
    <div className="space-y-2">
      {episodes.map((episode) => (
        <Link
          to={`/watch/${anime._id}/${episode._id}`}
          key={episode._id}
          className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-sm hover:border-primary"
        >
          <div>
            <p className="font-semibold text-white">{`Episode ${episode.number} • ${episode.title}`}</p>
            <p className="text-xs text-white/60 line-clamp-2">{episode.synopsis}</p>
          </div>
          <span className="text-xs text-white/60">{Math.round((episode.duration || 24 * 60) / 60)} min</span>
        </Link>
      ))}
    </div>
  </div>
);

export default EpisodeList;

