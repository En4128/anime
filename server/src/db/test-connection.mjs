import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

console.log('Testing connection to:', process.env.SUPABASE_URL);

const { data: users, error: userErr } = await sb.from('users').select('id,email,role').limit(3);
console.log('\n=== Users ===');
console.log(JSON.stringify(users, null, 2));
if (userErr) console.log('User Error:', JSON.stringify(userErr, null, 2));

const { data: anime, error: animeErr } = await sb.from('anime').select('id,title,status').limit(3);
console.log('\n=== Anime ===');
console.log(JSON.stringify(anime, null, 2));
if (animeErr) console.log('Anime Error:', JSON.stringify(animeErr, null, 2));
