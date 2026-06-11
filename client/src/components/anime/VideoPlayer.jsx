import { useRef, useState, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';

const VideoPlayer = ({ animeId, episode }) => {
  const videoRef = useRef(null);
  const { saveProgress, continueWatching } = usePlayer();
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);

  // Find saved progress for this episode
  const savedProgress = continueWatching?.find(
    (item) => item.anime === animeId && item.episode === episode._id
  );

  useEffect(() => {
    setError(null);
    setReady(false);
    setHasResumed(false);
  }, [episode?._id, episode?.videoUrl]);

  const handleTimeUpdate = () => {
    if (ready && videoRef.current) {
      const playedSeconds = videoRef.current.currentTime;
      const duration = videoRef.current.duration || episode.duration || 0;

      saveProgress({
        anime: animeId,
        episode: episode._id,
        progress: Math.floor(playedSeconds),
        duration: Math.floor(duration),
      });
    }
  };

  const handleLoadedMetadata = () => {
    setReady(true);
    setError(null);

    // Resume from saved progress if available
    if (savedProgress?.progress && savedProgress.duration && videoRef.current && !hasResumed) {
      const progressRatio = savedProgress.progress / savedProgress.duration;
      if (progressRatio > 0 && progressRatio < 1) {
        videoRef.current.currentTime = savedProgress.progress;
        setHasResumed(true);
      }
    }
  };

  const handleError = (err) => {
    console.error('Video player error:', err);
    const rawUrl = episode?.videoUrl || '';
    setError(
      `Failed to load video. URL: ${rawUrl.substring(0, 50)}${rawUrl.length > 50 ? '...' : ''}. Please check the URL format.`
    );
    setReady(false);
  };

  // Construct proper video URL from various formats
  const constructVideoUrl = (url) => {
    if (!url) {
      // Fallback to demo video if no URL provided
      return 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }

    // If it's already an absolute URL (starts with http:// or https://), use it as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it starts with /, it's a server-relative path
    if (url.startsWith('/')) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
      // Remove /api/v1 from the end to get base server URL
      const baseUrl = apiUrl.replace(/\/api\/v1$/, '');
      return `${baseUrl}${url}`;
    }

    // Otherwise, assume it's a filename in the uploads directory
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const baseUrl = apiUrl.replace(/\/api\/v1$/, '');
    return `${baseUrl}/uploads/${url}`;
  };

  const videoUrl = constructVideoUrl(episode?.videoUrl);

  // Debug logging
  console.log('=== VideoPlayer Debug ===');
  console.log('Raw episode.videoUrl:', episode?.videoUrl);
  console.log('Constructed videoUrl:', videoUrl);
  console.log('Episode object:', episode);

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl ring-1 ring-white/5">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              controlsList="nodownload"
              className="h-full w-full"
              onLoadedMetadata={handleLoadedMetadata}
              onError={handleError}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>

          {/* Error Overlay */}
          {error && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-sm">
              <div className="text-center">
                <p className="mb-2 text-red-400">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {!ready && !error && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm font-medium uppercase tracking-widest text-white/60">Loading Stream</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {savedProgress && savedProgress.progress > 0 && (
        <div className="flex items-center gap-2 text-xs text-white/40">
          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
          <p>
            Resuming from {Math.floor(savedProgress.progress / 60)}:{(savedProgress.progress % 60).toString().padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

