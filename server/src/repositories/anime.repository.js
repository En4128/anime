import slugify from 'slugify';
import { supabase } from '../lib/supabase.js';
import { mapDoc } from '../utils/mapId.js';

const populateEpisodes = async (anime) => {
  if (!anime) return null;
  const { data: episodes } = await supabase
    .from('episodes')
    .select('*')
    .eq('anime_id', anime.id)
    .order('number', { ascending: true });
  anime.episodes = mapDoc(episodes || []);
  return mapDoc(anime);
};

export const AnimeRepository = {
  create: async (payload) => {
    const title = payload.title;
    const slug = payload.slug || slugify(title, { lower: true, strict: true });
    
    const record = {
      title,
      slug,
      synopsis: payload.synopsis || '',
      genres: payload.genres || [],
      tags: payload.tags || [],
      rating: payload.rating || 0,
      release_year: payload.releaseYear || new Date().getFullYear(),
      status: payload.status || 'ongoing',
      poster_image: payload.posterImage || '',
      banner_image: payload.bannerImage || '',
      featured: payload.featured !== undefined ? payload.featured : false,
      trending_score: payload.trendingScore || 0,
      popularity: payload.popularity || 0,
      created_by: payload.createdBy,
      likes: payload.likes || 0,
    };

    const { data, error } = await supabase
      .from('anime')
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  update: async (id, payload) => {
    const updates = {};
    if (payload.title !== undefined) {
      updates.title = payload.title;
      updates.slug = slugify(payload.title, { lower: true, strict: true });
    }
    if (payload.synopsis !== undefined) updates.synopsis = payload.synopsis;
    if (payload.genres !== undefined) updates.genres = payload.genres;
    if (payload.tags !== undefined) updates.tags = payload.tags;
    if (payload.rating !== undefined) updates.rating = payload.rating;
    if (payload.releaseYear !== undefined) updates.release_year = payload.releaseYear;
    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.posterImage !== undefined) updates.poster_image = payload.posterImage;
    if (payload.bannerImage !== undefined) updates.banner_image = payload.bannerImage;
    if (payload.featured !== undefined) updates.featured = payload.featured;
    if (payload.trendingScore !== undefined) updates.trending_score = payload.trendingScore;
    if (payload.popularity !== undefined) updates.popularity = payload.popularity;
    if (payload.createdBy !== undefined) updates.created_by = payload.createdBy;
    if (payload.likes !== undefined) updates.likes = payload.likes;

    const { data, error } = await supabase
      .from('anime')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  remove: async (id) => {
    const { data, error } = await supabase
      .from('anime')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  findById: async (id) => {
    const { data } = await supabase
      .from('anime')
      .select('*')
      .eq('id', id)
      .single();
    if (!data) return null;
    return populateEpisodes(data);
  },

  findBySlug: async (slug) => {
    const { data } = await supabase
      .from('anime')
      .select('*')
      .eq('slug', slug)
      .single();
    if (!data) return null;
    return populateEpisodes(data);
  },

  list: async (filter = {}, options = {}) => {
    let query = supabase.from('anime').select('*');

    // Filter by genres overlap
    if (filter.genres) {
      const genresList = filter.genres.$in || (Array.isArray(filter.genres) ? filter.genres : [filter.genres]);
      if (genresList.length > 0) {
        query = query.filter('genres', 'ov', `{${genresList.join(',')}}`);
      }
    }

    // Filter by status
    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    // Filter by search term ($or query in mongoose)
    if (filter.$or) {
      const searchObj = filter.$or.find(o => o.title && o.title.$regex);
      if (searchObj) {
        const searchTerm = searchObj.title.$regex;
        query = query.or(`title.ilike.%${searchTerm}%,synopsis.ilike.%${searchTerm}%`);
      }
    }

    // Direct key comparison for other fields
    for (const key in filter) {
      if (key !== 'genres' && key !== 'status' && key !== '$or') {
        const pgKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        query = query.eq(pgKey, filter[key]);
      }
    }

    // Sort order
    if (options.sort) {
      const sortField = Object.keys(options.sort)[0];
      const ascending = options.sort[sortField] !== -1;
      const pgField = sortField.replace(/([A-Z])/g, "_$1").toLowerCase();
      query = query.order(pgField, { ascending });
    }

    // Pagination limit & range offset
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.skip) {
      const limit = options.limit || 10;
      query = query.range(options.skip, options.skip + limit - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return mapDoc(data || []);
  },

  count: async (filter = {}) => {
    let query = supabase.from('anime').select('*', { count: 'exact', head: true });

    if (filter.genres) {
      const genresList = filter.genres.$in || (Array.isArray(filter.genres) ? filter.genres : [filter.genres]);
      if (genresList.length > 0) {
        query = query.filter('genres', 'ov', `{${genresList.join(',')}}`);
      }
    }

    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    if (filter.$or) {
      const searchObj = filter.$or.find(o => o.title && o.title.$regex);
      if (searchObj) {
        const searchTerm = searchObj.title.$regex;
        query = query.or(`title.ilike.%${searchTerm}%,synopsis.ilike.%${searchTerm}%`);
      }
    }

    for (const key in filter) {
      if (key !== 'genres' && key !== 'status' && key !== '$or') {
        const pgKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
        query = query.eq(pgKey, filter[key]);
      }
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  like: async (id, amount = 1) => {
    const { data: anime } = await supabase.from('anime').select('likes').eq('id', id).single();
    const currentLikes = anime?.likes || 0;
    const newLikes = currentLikes + amount;
    const { data, error } = await supabase
      .from('anime')
      .update({ likes: newLikes })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },
};
