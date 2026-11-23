-- Начальная схема «Учебного менеджера». Выполнить один раз, до seed.sql.

-- Справочник курсов: id стабильный, name показывается пользователю.
create table public.courses (
  id text primary key,
  name text not null unique,
  constraint courses_id_not_blank
    check (id = btrim(id) and id <> ''),
  constraint courses_name_not_blank
    check (name = btrim(name) and name <> '')
);

-- Личные задания. course_id не даёт сохранить несуществующий курс.
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null references public.courses(id)
    on update cascade on delete restrict,
  title text not null,
  description text not null default '',
  deadline date not null,
  status text not null,
  difficulty text not null,
  created_at timestamptz not null default now(),
  constraint assignments_title_length
    check (char_length(btrim(title)) between 3 and 100),
  constraint assignments_description_length
    check (char_length(btrim(description)) >= 10),
  constraint assignments_status_allowed
    check (status in ('todo', 'in_progress', 'done')),
  constraint assignments_difficulty_allowed
    check (difficulty in ('easy', 'medium', 'hard'))
);

-- RLS и права: сначала всё закрываем, потом открываем только чтение справочника.
alter table public.courses enable row level security;
alter table public.assignments enable row level security;

revoke all on table public.courses from anon, authenticated;
revoke all on table public.assignments from anon, authenticated;

grant select on table public.courses to anon, authenticated;

create policy "courses are publicly readable"
on public.courses
for select
to anon, authenticated
using (true);

-- Для assignments нет ни grant, ни политик: таблица закрыта до ЛР 6.
