import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/anime/HeroSlider.jsx';
import CarouselRow from '../components/anime/CarouselRow.jsx';
import Loader from '../components/common/Loader.jsx';
import { animeApi } from '../api/anime.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ContinueWatchingList from '../components/anime/ContinueWatchingList.jsx';
import TopAiringSidebar from '../components/anime/TopAiringSidebar.jsx';

const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Thriller'];

const HomePage = () => {
  const [sections, setSections] = useState({ featured: [], trending: [], popular: [], recent: [] });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const loadSections = async () => {
    setLoading(true);
    try {
      const { data } = await animeApi.homepage();
      setSections(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, []);

  const handleLike = async (animeId) => {
    if (!isAuthenticated) return;
    await animeApi.like(animeId);
    await refreshProfile();
    loadSections();
  };

  const likedIds = user?.likedAnime?.map((id) => id.toString()) || [];

  return (
    <div className="pb-10">
      {loading ? (
        <Loader message="Summoning anime magic..." />
      ) : (
        <div className="space-y-12">
          {/* Hero Section */}
          <HeroSlider items={sections.featured} />

          {/* Genre Quick Links */}
          <div className="relative overflow-hidden py-2">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => navigate(`/browse?genres=${genre}`)}
                  className="whitespace-nowrap rounded-2xl bg-secondary-light/20 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary hover:shadow-glow hover:scale-105 active:scale-95"
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-secondary to-transparent" />
          </div>

          {/* User Specific Section */}
          {isAuthenticated && user?.continueWatching?.length > 0 && (
            <div className="animate-slide-up">
              <ContinueWatchingList items={user.continueWatching} />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-12">
              <CarouselRow
                title="Trending Now"
                description="What the community is hyped about"
                items={sections.trending}
                onLike={handleLike}
                likedIds={likedIds}
              />
              
              <CarouselRow
                title="Recently Added"
                description="Fresh stories added this week"
                items={sections.recent}
                onLike={handleLike}
                likedIds={likedIds}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <TopAiringSidebar items={sections.popular} />
              
              {/* Optional: Newsletter or Mobile App Promo Card */}
              <div className="rounded-2xl bg-gradient-to-br from-primary to-purple-600 p-6 shadow-xl">
                <h4 className="text-xl font-bold text-white">Join our Discord</h4>
                <p className="mt-2 text-sm text-white/80">Connect with fellow anime lovers and get instant updates!</p>
                <button className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-105 active:scale-95">
                  Join Now
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Full Width Section */}
          <div className="pt-8">
            <CarouselRow
              title="Popular Hits"
              description="All-time favorites everyone loves"
              items={sections.popular}
              onLike={handleLike}
              likedIds={likedIds}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

