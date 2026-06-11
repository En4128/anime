import { supabase } from '../lib/supabase.js';
import { mapDoc } from '../utils/mapId.js';

export const StatsService = {
  getDashboardMetrics: async () => {
    const [usersCount, animeCount, episodesCount, commentsCount, latestAnimeRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('anime').select('*', { count: 'exact', head: true }),
      supabase.from('episodes').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('anime')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    return {
      totalUsers: usersCount.count || 0,
      totalAnime: animeCount.count || 0,
      totalEpisodes: episodesCount.count || 0,
      totalComments: commentsCount.count || 0,
      latestAnime: mapDoc(latestAnimeRes.data || []),
    };
  },
};
