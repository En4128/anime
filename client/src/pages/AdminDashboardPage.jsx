import { useEffect, useState } from 'react';
import StatCard from '../components/dashboard/StatCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { dashboardApi } from '../api/dashboard.api.js';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.stats().then((res) => setStats(res.data.data));
  }, []);

  if (!stats) {
    return <Loader message="Loading analytics..." />;
  }

  const cards = [
    { label: 'Users', value: stats.totalUsers },
    { label: 'Anime', value: stats.totalAnime },
    { label: 'Episodes', value: stats.totalEpisodes },
    { label: 'Comments', value: stats.totalComments },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <div className="rounded-3xl border border-white/5 bg-secondary/30 p-6">
        <h2 className="font-semibold">Latest Anime</h2>
        <div className="mt-4 space-y-3 text-sm text-white/80">
          {stats.latestAnime.map((anime) => (
            <div key={anime._id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
              <div>
                <p className="font-semibold">{anime.title}</p>
                <p className="text-xs text-white/50">{anime.releaseYear}</p>
              </div>
              <span className="text-primary">{anime.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

