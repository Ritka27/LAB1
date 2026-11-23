-- Стартовые курсы. Выполнять после миграции; повторный запуск безопасен.
insert into public.courses (id, name)
values
  ('algorithms', 'Алгоритмы и структуры данных'),
  ('web', 'Веб-разработка'),
  ('data-analysis', 'Анализ данных'),
  ('databases', 'Базы данных'),
  ('os', 'Операционные системы')
on conflict (id) do update
set name = excluded.name;
