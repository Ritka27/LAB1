import { createClient } from '@supabase/supabase-js'

// Значения берутся из .env.local. Здесь только publishable key:
// защиту данных дают права и RLS.
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !publishableKey) {
  throw new Error('Не настроены переменные Supabase в .env.local')
}

export const supabase = createClient(url, publishableKey)
