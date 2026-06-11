import { supabase } from '../lib/supabase.js';
import { mapDoc } from '../utils/mapId.js';

export const CommentRepository = {
  create: async (payload) => {
    const record = {
      anime_id: payload.anime,
      episode_id: payload.episode || null,
      user_id: payload.user,
      content: payload.content
    };
    const { data, error } = await supabase
      .from('comments')
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    
    const formatted = mapDoc(data);
    const { data: user } = await supabase
      .from('users')
      .select('username, avatar')
      .eq('id', payload.user)
      .single();
    formatted.user = mapDoc(user);
    formatted.likes = [];
    return formatted;
  },

  update: async (id, payload) => {
    const { data, error } = await supabase
      .from('comments')
      .update({ content: payload.content })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    const formatted = mapDoc(data);
    const { data: user } = await supabase
      .from('users')
      .select('username, avatar')
      .eq('id', data.user_id)
      .single();
    formatted.user = mapDoc(user);

    const { data: likes } = await supabase
      .from('comment_likes')
      .select('user_id')
      .eq('comment_id', id);
    formatted.likes = likes?.map(l => l.user_id) || [];
    return formatted;
  },

  remove: async (id) => {
    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return mapDoc(data);
  },

  findById: async (id) => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();
    if (!data) return null;

    const formatted = mapDoc(data);
    const { data: likes } = await supabase
      .from('comment_likes')
      .select('user_id')
      .eq('comment_id', id);
    formatted.likes = likes?.map(l => l.user_id) || [];
    return formatted;
  },

  listByAnime: async (animeId) => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:users(id, username, avatar), comment_likes(user_id)')
      .eq('anime_id', animeId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(item => {
      const formatted = mapDoc(item);
      formatted.likes = item.comment_likes?.map(cl => cl.user_id) || [];
      delete formatted.commentLikes;
      return formatted;
    });
  },

  toggleLike: async (id, userId) => {
    const { data: existing } = await supabase
      .from('comment_likes')
      .select('*')
      .eq('comment_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', id)
        .eq('user_id', userId);
    } else {
      await supabase
        .from('comment_likes')
        .insert({ comment_id: id, user_id: userId });
    }

    const { data: comment } = await supabase
      .from('comments')
      .select('*')
      .eq('id', id)
      .single();
    if (!comment) return null;

    const formatted = mapDoc(comment);
    const { data: user } = await supabase
      .from('users')
      .select('username, avatar')
      .eq('id', comment.user_id)
      .single();
    formatted.user = mapDoc(user);

    const { data: likes } = await supabase
      .from('comment_likes')
      .select('user_id')
      .eq('comment_id', id);
    formatted.likes = likes?.map(l => l.user_id) || [];
    return formatted;
  },
};
