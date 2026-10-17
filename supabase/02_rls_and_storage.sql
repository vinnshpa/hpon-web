-- ==========================================================
-- SKRIP 02: KEAMANAN ROW LEVEL SECURITY (RLS) & STORAGE BUCKET
-- ==========================================================

-- 1. FUNGSI PENGECEKAN STATUS ADMIN
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  )
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2. AKTIFKAN RLS PADA SEMUA TABEL
alter table public.site_settings enable row level security;
alter table public.org_units enable row level security;
alter table public.org_positions enable row level security;
alter table public.activities enable row level security;
alter table public.activity_photos enable row level security;
alter table public.announcements enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_users enable row level security;

-- 3. POLICIES: site_settings
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings_admin_all" on public.site_settings;
create policy "settings_admin_all" on public.site_settings
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 4. POLICIES: org_units
drop policy if exists "units_public_read" on public.org_units;
create policy "units_public_read" on public.org_units
  for select to anon, authenticated using (true);

drop policy if exists "units_admin_all" on public.org_units;
create policy "units_admin_all" on public.org_units
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 5. POLICIES: org_positions
drop policy if exists "positions_public_read" on public.org_positions;
create policy "positions_public_read" on public.org_positions
  for select to anon, authenticated using (true);

drop policy if exists "positions_admin_all" on public.org_positions;
create policy "positions_admin_all" on public.org_positions
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 6. POLICIES: activities
drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read" on public.activities
  for select to anon, authenticated using (is_published);

drop policy if exists "activities_admin_all" on public.activities;
create policy "activities_admin_all" on public.activities
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 7. POLICIES: activity_photos
drop policy if exists "activity_photos_public_read" on public.activity_photos;
create policy "activity_photos_public_read" on public.activity_photos
  for select to anon, authenticated
  using (exists (
    select 1 from public.activities a
    where a.id = activity_photos.activity_id and a.is_published
  ));

drop policy if exists "activity_photos_admin_all" on public.activity_photos;
create policy "activity_photos_admin_all" on public.activity_photos
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 8. POLICIES: announcements
drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read" on public.announcements
  for select to anon, authenticated using (is_published);

drop policy if exists "announcements_admin_all" on public.announcements;
create policy "announcements_admin_all" on public.announcements
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 9. POLICIES: contact_messages
drop policy if exists "contact_public_insert" on public.contact_messages;
create policy "contact_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "contact_admin_all" on public.contact_messages;
create policy "contact_admin_all" on public.contact_messages
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- 10. POLICIES: admin_users
drop policy if exists "admin_users_read_own" on public.admin_users;
create policy "admin_users_read_own" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

-- 11. STORAGE BUCKETS
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('org-assets', 'org-assets', true, 10485760, array['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf']),
  ('activity-photos', 'activity-photos', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage Read Policy: siapapun bisa membaca/melihat URL gambar dan file publik
drop policy if exists "storage_public_read" on storage.objects;
create policy "storage_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('org-assets', 'activity-photos'));

-- Storage Write Policy: hanya admin terdaftar yang bisa upload dan hapus
drop policy if exists "storage_admin_write" on storage.objects;
create policy "storage_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id in ('org-assets', 'activity-photos') and (select public.is_admin()))
  with check (bucket_id in ('org-assets', 'activity-photos') and (select public.is_admin()));
