import { useEffect, useState } from 'react';
import { animeApi } from '../api/anime.api.js';
import Loader from '../components/common/Loader.jsx';

const initialAnime = {
  title: '',
  synopsis: '',
  genres: '',
  rating: 8,
  releaseYear: new Date().getFullYear(),
  status: 'Ongoing',
  posterImage: '',
  bannerImage: '',
};

const initialEpisode = {
  title: '',
  number: 1,
  synopsis: '',
  videoUrl: '',
};

const AdminAnimePage = () => {
  const [animeList, setAnimeList] = useState([]);
  const [animeForm, setAnimeForm] = useState(initialAnime);
  const [episodeForm, setEpisodeForm] = useState(initialEpisode);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAnime = async () => {
    setLoading(true);
    const { data } = await animeApi.list({ limit: 50, sort: 'recent' });
    setAnimeList(data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAnime();
  }, []);

  const handleAnimeSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (!animeForm.title || !animeForm.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!animeForm.synopsis || !animeForm.synopsis.trim()) {
      setError('Synopsis is required (minimum 1 character)');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare payload with proper data types
      const genresArray = animeForm.genres
        ? animeForm.genres.split(',').map((g) => g.trim()).filter((g) => g.length > 0)
        : [];

      const payload = {
        title: animeForm.title.trim(),
        synopsis: animeForm.synopsis.trim() || 'No synopsis available.',
        genres: genresArray,
        rating: animeForm.rating ? Number(animeForm.rating) : undefined,
        releaseYear: animeForm.releaseYear ? Number(animeForm.releaseYear) : undefined,
        status: animeForm.status || 'Ongoing',
        posterImage: animeForm.posterImage.trim() || '',
        bannerImage: animeForm.bannerImage.trim() || '',
      };

      if (animeForm._id) {
        await animeApi.update(animeForm._id, payload);
        setSuccess('Anime updated successfully!');
      } else {
        await animeApi.create(payload);
        setSuccess('Anime created successfully!');
      }

      setAnimeForm(initialAnime);
      setSelectedAnime(null);
      await loadAnime();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving anime:', err);
      setError(err.message || 'Failed to save anime. Please check the form and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEpisodeSubmit = async (event) => {
    event.preventDefault();
    if (!selectedAnime) return;

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await animeApi.upsertEpisode(selectedAnime._id, {
        ...episodeForm,
        number: Number(episodeForm.number),
        title: episodeForm.title.trim(),
        synopsis: episodeForm.synopsis.trim() || '',
        videoUrl: episodeForm.videoUrl.trim(),
      });
      const updated = await animeApi.getById(selectedAnime._id);
      setSelectedAnime(updated.data.data);
      setEpisodeForm(initialEpisode);
      setSuccess('Episode added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving episode:', err);
      setError(err.message || 'Failed to save episode. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (anime) => {
    setError(null);
    setSuccess(null);
    setAnimeForm({
      ...anime,
      genres: anime.genres?.join(', '),
    });
    const { data } = await animeApi.getById(anime._id);
    setSelectedAnime(data.data);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this anime?')) return;

    setError(null);
    try {
      await animeApi.remove(id);
      if (selectedAnime?._id === id) {
        setSelectedAnime(null);
        setAnimeForm(initialAnime);
      }
      await loadAnime();
      setSuccess('Anime deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting anime:', err);
      setError(err.message || 'Failed to delete anime. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Anime Manager</h1>

      {error && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-4 rounded-3xl border border-white/5 bg-secondary/30 p-6">
          <h2 className="font-semibold">{animeForm._id ? 'Edit Anime' : 'Add Anime'}</h2>
          <form onSubmit={handleAnimeSubmit} className="grid gap-4 md:grid-cols-2">
            {['title', 'posterImage', 'bannerImage', 'rating', 'releaseYear', 'status'].map((field) => (
              <input
                key={field}
                type={field === 'rating' || field === 'releaseYear' ? 'number' : 'text'}
                placeholder={field}
                value={animeForm[field] || ''}
                onChange={(e) => setAnimeForm((prev) => ({ ...prev, [field]: e.target.value }))}
                className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus:border-primary"
              />
            ))}
            <textarea
              placeholder="Synopsis"
              className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white"
              value={animeForm.synopsis}
              onChange={(e) => setAnimeForm((prev) => ({ ...prev, synopsis: e.target.value }))}
            />
            <input
              placeholder="Genres (comma separated)"
              className="md:col-span-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white"
              value={animeForm.genres}
              onChange={(e) => setAnimeForm((prev) => ({ ...prev, genres: e.target.value }))}
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-6 py-2 font-semibold text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : animeForm._id ? 'Update' : 'Create'}
              </button>
              {animeForm._id && (
                <button
                  type="button"
                  onClick={() => {
                    setAnimeForm(initialAnime);
                    setSelectedAnime(null);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="rounded-full border border-white/20 px-6 py-2 text-white/80"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
        <section className="rounded-3xl border border-white/5 bg-secondary/30 p-6">
          <h2 className="font-semibold">Episodes</h2>
          {selectedAnime ? (
            <>
              <p className="text-sm text-white/60">{selectedAnime.title}</p>
              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                {selectedAnime.episodes?.map((ep) => (
                  <div key={ep._id} className="flex items-center justify-between rounded-xl border border-white/5 px-3 py-2 text-sm">
                    <span>
                      {ep.number}. {ep.title}
                    </span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleEpisodeSubmit} className="mt-4 space-y-2">
                {['title', 'number'].map((field) => (
                  <input
                    key={field}
                    type={field === 'number' ? 'number' : 'text'}
                    placeholder={`Episode ${field}`}
                    value={episodeForm[field]}
                    onChange={(e) => setEpisodeForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm"
                  />
                ))}

                {/* Video URL Input with Upload Option */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={episodeForm.videoUrl}
                      onChange={(e) => setEpisodeForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                      className="flex-1 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm"
                    />
                    <label className="flex cursor-pointer items-center rounded-full border border-primary bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20">
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          setSubmitting(true);
                          try {
                            const formData = new FormData();
                            formData.append('video', file);

                            const response = await fetch(
                              `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/anime/upload/video`,
                              {
                                method: 'POST',
                                body: formData,
                                credentials: 'include',
                              }
                            );

                            if (!response.ok) throw new Error('Upload failed');

                            const data = await response.json();
                            setEpisodeForm((prev) => ({ ...prev, videoUrl: data.videoUrl }));
                            setSuccess('Video uploaded successfully!');
                            setTimeout(() => setSuccess(null), 3000);
                          } catch (err) {
                            console.error('Upload error:', err);
                            setError('Failed to upload video. Please try again.');
                          } finally {
                            setSubmitting(false);
                            e.target.value = ''; // Reset file input
                          }
                        }}
                      />
                      Upload
                    </label>
                  </div>
                  <p className="text-xs text-white/40">
                    Formats: Full URL (http://...), Server path (/uploads/video.mp4), or upload a file
                  </p>
                </div>

                <textarea
                  placeholder="Episode synopsis"
                  value={episodeForm.synopsis}
                  onChange={(e) => setEpisodeForm((prev) => ({ ...prev, synopsis: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-sm"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-primary py-2 font-semibold text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Episode'}
                </button>
              </form>
            </>
          ) : (
            <p className="text-sm text-white/60">Select an anime to manage episodes.</p>
          )}
        </section>
      </div>
      <section className="rounded-3xl border border-white/5 bg-secondary/30 p-6">
        <h2 className="font-semibold">Catalog</h2>
        {loading ? (
          <Loader message="Loading titles..." />
        ) : (
          <div className="mt-4 divide-y divide-white/5">
            {animeList.map((anime) => (
              <div key={anime._id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold">{anime.title}</p>
                  <p className="text-white/50">{anime.status}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="text-primary" onClick={() => handleEdit(anime)}>
                    Edit
                  </button>
                  <button type="button" className="text-red-400" onClick={() => handleDelete(anime._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminAnimePage;

