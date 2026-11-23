/// <reference types="vite/client" />

// Типы переменных окружения Supabase. Без этого описания Vite отдаёт
// import.meta.env.* как any. Значение может отсутствовать (нет .env.local),
// поэтому тип string | undefined, а проверка — в lib/supabase.ts.
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
