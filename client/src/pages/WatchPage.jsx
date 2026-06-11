import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { animeApi } from '../api/anime.api.js';
import Loader from '../components/common/Loader.jsx';
import VideoPlayer from '../components/anime/VideoPlayer.jsx';
import EpisodeList from '../components/anime/EpisodeList.jsx';

const WatchPage = () => {
  const { animeId, episodeId } = useParams();
  const [anime, setAnime] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await animeApi.getById(animeId);
      setAnime(data.data);
      const selected = data.data.episodes?.find((ep) => ep._id === episodeId) || data.data.episodes?.[0];
      
      if (!selected) {
        throw new Error('Episode not found');
      }
      
      if (!selected.videoUrl) {
        console.warn('Episode has no videoUrl:', selected);
      }
      
      setEpisode(selected);
    } catch (err) {
      console.error('Error loading episode:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [animeId, episodeId]);

  if (loading || !anime || !episode) {
    return <Loader message="Preparing your stream..." />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase text-white/60">{anime.title}</p>
        <h1 className="font-display text-3xl">{episode.title}</h1>
      </div>
      <VideoPlayer animeId={animeId} episode={episode} />
      <EpisodeList anime={anime} episodes={anime.episodes} />
    </div>
  );
};

export default WatchPage;

