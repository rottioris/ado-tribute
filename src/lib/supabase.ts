import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey  = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Tipos derivados del esquema ──
export type { Fanart }  from '../types/fanart';
export type { Message } from '../types/message';
export type { Profile } from '../types/user';
