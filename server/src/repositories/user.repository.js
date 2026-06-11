import { supabase } from '../lib/supabase.js';
import { mapDoc } from '../utils/mapId.js';

const formatUser = (user) => {
  if (!user) return null;
  const formatted = mapDoc(user);
  formatted.toPublic = function() {
    const u = { ...this };
    delete u.password;
    delete u.toPublic;
    return u;
  };
  return formatted;
};

const loadUserRelations = async (user, options = {}) => {
  if (!user) return null;

  // 1. Get watchlist
  let watchlist = [];
  if (options.populateWatchlist) {
    const { data } = await supabase
      .from('user_watchlist')
      .select('anime:anime(*)')
      .eq('user_id', user.id);
    watchlist = data?.map(w => mapDoc(w.anime)).filter(Boolean) || [];
  } else {
    const { data } = await supabase
      .from('user_watchlist')
      .select('anime_id')
      .eq('user_id', user.id);
    watchlist = data?.map(w => w.anime_id) || [];
  }

  // 2. Get liked anime
  const { data: likedData } = await supabase
    .from('user_liked_anime')
    .select('anime_id')
    .eq('user_id', user.id);
  const likedAnime = likedData?.map(l => l.anime_id) || [];

  // 3. Get continue watching
  const { data: continueData } = await supabase
    .from('user_continue_watching')
    .select('*')
    .eq('user_id', user.id);
  const continueWatching = continueData?.map(c => ({
    anime: c.anime_id,
    episode: c.episode_id,
    progress: c.progress,
    duration: c.duration,
    lastWatchedAt: c.last_watched_at
  })) || [];

  user.watchlist = watchlist;
  user.likedAnime = likedAnime;
  user.continueWatching = continueWatching;
  return formatUser(user);
};

export const UserRepository = {
  create: async (payload) => {
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: payload.username,
        email: payload.email.toLowerCase(),
        password: payload.password,
        role: payload.role || 'user',
        avatar: payload.avatar || '',
        banner: payload.banner || '',
        bio: payload.bio || '',
      })
      .select()
      .single();
    if (error) throw error;
    return loadUserRelations(data);
  },

  findByEmail: async (email) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();
    if (!data) return null;
    return loadUserRelations(data);
  },

  findById: (id) => {
    const promise = (async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      return data;
    })();

    let populateField = null;

    const chain = {
      populate: (field) => {
        populateField = field;
        return chain;
      },
      then: async (resolve, reject) => {
        try {
          const user = await promise;
          if (!user) return resolve(null);
          const populated = await loadUserRelations(user, {
            populateWatchlist: populateField === 'watchlist'
          });
          resolve(populated);
        } catch (err) {
          reject(err);
        }
      }
    };
    return chain;
  },

  updateById: async (id, payload) => {
    const updates = {};
    if (payload.username !== undefined) updates.username = payload.username;
    if (payload.bio !== undefined) updates.bio = payload.bio;
    if (payload.avatar !== undefined) updates.avatar = payload.avatar;
    if (payload.banner !== undefined) updates.banner = payload.banner;
    if (payload.role !== undefined) updates.role = payload.role;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return loadUserRelations(data);
  },

  listAdmins: async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin');
    const list = [];
    for (const u of (data || [])) {
      list.push(await loadUserRelations(u));
    }
    return list;
  },

  addToWatchlist: async (userId, animeId) => {
    await supabase
      .from('user_watchlist')
      .upsert({ user_id: userId, anime_id: animeId }, { onConflict: 'user_id,anime_id' });
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return loadUserRelations(data, { populateWatchlist: true });
  },

  removeFromWatchlist: async (userId, animeId) => {
    await supabase
      .from('user_watchlist')
      .delete()
      .eq('user_id', userId)
      .eq('anime_id', animeId);
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return loadUserRelations(data, { populateWatchlist: true });
  },

  likeAnime: async (userId, animeId) => {
    await supabase
      .from('user_liked_anime')
      .upsert({ user_id: userId, anime_id: animeId }, { onConflict: 'user_id,anime_id' });
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return loadUserRelations(data);
  },

  unlikeAnime: async (userId, animeId) => {
    await supabase
      .from('user_liked_anime')
      .delete()
      .eq('user_id', userId)
      .eq('anime_id', animeId);
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return loadUserRelations(data);
  },

  updateContinueWatching: async (userId, payload) => {
    // payload.anime is the anime id, payload.episode is the episode id
    await supabase
      .from('user_continue_watching')
      .upsert({
        user_id: userId,
        anime_id: payload.anime,
        episode_id: payload.episode,
        progress: payload.progress || 0,
        duration: payload.duration || 0,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id,anime_id' });
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return loadUserRelations(data);
  },
};
