import { supabase } from '../lib/supabase.js';
import { mapDoc } from '../utils/mapId.js';

export const EpisodeRepository = {
  create: async (payload) => {
    const record = {
      anime_id: payload.anime,
      title: payload.title,
      number: payload.number,
      synopsis: payload.synopsis || '',
      video_url: payload.videoUrl,
      thumbnail: payload.thumbnail || '',
      duration: payload.duration || 0,
      release_date: payload.releaseDate || new Date().toISOString()
    };
    const { data, error } = await supabase
      .from('episodes')
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  update: async (id, payload) => {
    const updates = {};
    if (payload.anime !== undefined) updates.anime_id = payload.anime;
    if (payload.title !== undefined) updates.title = payload.title;
    if (payload.number !== undefined) updates.number = payload.number;
    if (payload.synopsis !== undefined) updates.synopsis = payload.synopsis;
    if (payload.videoUrl !== undefined) updates.video_url = payload.videoUrl;
    if (payload.thumbnail !== undefined) updates.thumbnail = payload.thumbnail;
    if (payload.duration !== undefined) updates.duration = payload.duration;
    if (payload.releaseDate !== undefined) updates.release_date = payload.releaseDate;

    const { data, error } = await supabase
      .from('episodes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  remove: async (id) => {
    const { data, error } = await supabase
      .from('episodes')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  findById: (id) => {
    const promise = (async () => {
      const { data } = await supabase
        .from('episodes')
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
          const episode = await promise;
          if (!episode) return resolve(null);
          const formatted = mapDoc(episode);
          if (populateField === 'anime' && episode.anime_id) {
            const { data: anime } = await supabase
              .from('anime')
              .select('*')
              .eq('id', episode.anime_id)
              .single();
            formatted.anime = mapDoc(anime);
          }
          resolve(formatted);
        } catch (err) {
          reject(err);
        }
      }
    };
    return chain;
  },

  listByAnime: async (animeId) => {
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('anime_id', animeId)
      .order('number', { ascending: true });
    if (error) throw error;
    return mapDoc(data || []);
  },
};
