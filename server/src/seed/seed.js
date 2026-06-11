import { supabase } from '../lib/supabase.js';
import { UserRepository } from '../repositories/user.repository.js';
import { AnimeRepository } from '../repositories/anime.repository.js';
import { EpisodeRepository } from '../repositories/episode.repository.js';
import { hashPassword } from '../utils/password.js';
import { sampleAnime } from '../data/sampleAnime.js';

const seed = async () => {
  console.log('🧹 Clearing existing database data...');
  // Cascading deletes will handle the join tables
  // We use neq filter to bypass PostgREST's delete safety check
  await Promise.all([
    supabase.from('episodes').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    supabase.from('anime').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
    supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  ]);

  console.log('🌱 Seeding database...');

  const admin = await UserRepository.create({
    username: 'admin',
    email: 'admin@example.com',
    password: await hashPassword('password123'),
    role: 'admin',
  });

  console.log('✅ Admin user created');

  for (const animeData of sampleAnime) {
    const { episodes: episodeList, ...animeFields } = animeData;

    const anime = await AnimeRepository.create({
      ...animeFields,
      createdBy: admin._id,
    });

    if (episodeList && episodeList.length > 0) {
      const episodeDocs = episodeList.map((ep) => ({
        anime: anime._id,
        title: ep.title,
        number: ep.number,
        synopsis: ep.synopsis || animeFields.synopsis,
        videoUrl: ep.videoUrl,
        thumbnail: animeFields.posterImage || '',
        duration: (ep.duration || 24) * 60, // convert minutes to seconds
        releaseDate: new Date(animeFields.releaseYear, 0, 1 + (ep.number - 1) * 7).toISOString(),
      }));

      for (const epDoc of episodeDocs) {
        await EpisodeRepository.create(epDoc);
      }
      console.log(`  ✅ ${anime.title} — ${episodeDocs.length} episode(s) added`);
    } else {
      console.log(`  ⚠️  ${anime.title} — no episodes`);
    }
  }

  console.log('\n🎉 Seed complete! Database populated with famous anime.');
};

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
