-- Let Padel — schéma Supabase (projet harmonie-olivet, préfixe letpadel_)
create table public.letpadel_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.letpadel_admins enable row level security;

create or replace function public.letpadel_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.letpadel_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.letpadel_is_admin() from public;
grant execute on function public.letpadel_is_admin() to anon, authenticated;

create or replace function public.letpadel_touch()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create policy "letpadel_admins: lecture" on public.letpadel_admins
  for select to authenticated using (user_id = (select auth.uid()) or (select public.letpadel_is_admin()));

create table public.letpadel_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.letpadel_blocks (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  section text not null default 'main',
  kicker text, title text, body text,
  image text, cta_label text, cta_url text,
  data jsonb not null default '{}'::jsonb,
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);
create index letpadel_blocks_page_idx on public.letpadel_blocks (page, section, sort);

create table public.letpadel_centers (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, short_name text,
  address text, postcode text, city text, phone text, email text,
  hours jsonb not null default '[]'::jsonb,
  transport text, description text,
  features jsonb not null default '[]'::jsonb,
  image text, gallery jsonb not null default '[]'::jsonb,
  map_url text, lat double precision, lng double precision, booking_url text,
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.letpadel_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  kind text not null default 'actu' check (kind in ('actu','event','blog')),
  title text not null, excerpt text, body text, image text,
  event_date date, location text, link_url text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.letpadel_coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null, role text, highlight text, bio text, photo text,
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.letpadel_offers (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null, subtitle text, body text, price text, badge text, image text,
  cta_label text, cta_url text,
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);
create index letpadel_offers_cat_idx on public.letpadel_offers (category, sort);

create table public.letpadel_faq (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null, category text not null default 'general',
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.letpadel_gallery (
  id uuid primary key default gen_random_uuid(),
  image text not null, caption text, album text not null default 'general',
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.letpadel_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null, logo text, url text,
  sort int not null default 0, visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.letpadel_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  phone text check (phone is null or char_length(phone) <= 40),
  center text check (center is null or char_length(center) <= 80),
  subject text check (subject is null or char_length(subject) <= 120),
  message text not null check (char_length(message) between 1 and 5000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['letpadel_settings','letpadel_blocks','letpadel_centers','letpadel_posts','letpadel_coaches','letpadel_offers','letpadel_faq','letpadel_gallery','letpadel_partners']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.letpadel_touch()', t||'_touch', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select public.letpadel_is_admin()))', t||': ajout admin', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select public.letpadel_is_admin())) with check ((select public.letpadel_is_admin()))', t||': modif admin', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select public.letpadel_is_admin()))', t||': suppression admin', t);
  end loop;
end $$;

create policy "letpadel_settings: lecture" on public.letpadel_settings for select using (true);
create policy "letpadel_blocks: lecture" on public.letpadel_blocks for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_centers: lecture" on public.letpadel_centers for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_posts: lecture" on public.letpadel_posts for select using (published or (select public.letpadel_is_admin()));
create policy "letpadel_coaches: lecture" on public.letpadel_coaches for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_offers: lecture" on public.letpadel_offers for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_faq: lecture" on public.letpadel_faq for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_gallery: lecture" on public.letpadel_gallery for select using (visible or (select public.letpadel_is_admin()));
create policy "letpadel_partners: lecture" on public.letpadel_partners for select using (visible or (select public.letpadel_is_admin()));

alter table public.letpadel_messages enable row level security;
create policy "letpadel_messages: envoi public" on public.letpadel_messages for insert to anon, authenticated with check (handled = false);
create policy "letpadel_messages: lecture admin" on public.letpadel_messages for select to authenticated using ((select public.letpadel_is_admin()));
create policy "letpadel_messages: modif admin" on public.letpadel_messages for update to authenticated using ((select public.letpadel_is_admin())) with check ((select public.letpadel_is_admin()));
create policy "letpadel_messages: suppression admin" on public.letpadel_messages for delete to authenticated using ((select public.letpadel_is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('letpadel-media','letpadel-media', true, 15728640, array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','image/avif','video/mp4','application/pdf'])
on conflict (id) do nothing;

create policy "letpadel-media: ajout admin" on storage.objects for insert to authenticated with check (bucket_id = 'letpadel-media' and (select public.letpadel_is_admin()));
create policy "letpadel-media: liste admin" on storage.objects for select to authenticated using (bucket_id = 'letpadel-media' and (select public.letpadel_is_admin()));
create policy "letpadel-media: modif admin" on storage.objects for update to authenticated using (bucket_id = 'letpadel-media' and (select public.letpadel_is_admin()));
create policy "letpadel-media: suppression admin" on storage.objects for delete to authenticated using (bucket_id = 'letpadel-media' and (select public.letpadel_is_admin()));

insert into public.letpadel_admins (user_id)
select id from auth.users where lower(email) = 'jerome.millier@yahoo.fr'
on conflict do nothing;
