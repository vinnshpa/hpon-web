-- ==========================================================
-- SKRIP 01: SKEMA DATABASE & DATA AWAL LENGKAP
-- Website Organisasi Resmi (Full CMS, BPH & Jajaran, Wilayah, Galeri)
-- ==========================================================

create extension if not exists pg_trgm with schema extensions;

-- 1. PENGATURAN UMUM SITUS & KONTEN CMS
create table if not exists public.site_settings (
  id text primary key default 'main',
  org_name text not null default 'Himpunan Pemuda & Pelajar',
  org_tagline text not null default 'Wadah Kolaborasi, Kepemimpinan, dan Pengabdian',
  cabinet_name text not null default 'Kabinet Sinergi Progresif 2024–2025',
  about_text text default 'Organisasi ini didirikan sebagai wadah persatuan, pengembangan potensi intelektual, kepemimpinan, dan pengabdian masyarakat bagi seluruh generasi muda.',
  vision text default 'Terwujudnya organisasi yang berintegritas, unggul dalam keilmuan, mandiri, dan berkontribusi nyata bagi bangsa.',
  missions jsonb default '["Mempererat tali persaudaraan dan solidaritas antar kader, pengurus, serta pembina.", "Menyelenggarakan kegiatan kaderisasi, pelatihan kepemimpinan, dan penguatan intelektual.", "Mendorong aksi sosial dan pengabdian nyata kepada masyarakat di berbagai wilayah.", "Membangun kemitraan strategis dengan institusi pendidikan, pemerintah, dan swasta."]'::jsonb,
  stats jsonb default '[{"value": "1.000+", "label": "Kader & Alumni"}, {"value": "25+", "label": "Program Kerja / Thn"}, {"value": "5", "label": "Wilayah Koordinasi"}, {"value": "2018", "label": "Tahun Berdiri"}]'::jsonb,
  pillars jsonb default '[{"title": "Pengembangan Karir & Akademik", "desc": "Membuka akses pelatihan, beasiswa, dan peningkatan kapabilitas intelektual kader.", "icon": "GraduationCap"}, {"title": "Pengabdian & Aksi Sosial", "desc": "Bakti nyata untuk masyarakat, lingkungan, dan aksi tanggap kemanusiaan.", "icon": "HeartHandshake"}, {"title": "Jaringan & Kemitraan", "desc": "Membangun relasi antarwilayah dan kolaborasi dengan berbagai pemangku kepentingan.", "icon": "Globe"}]'::jsonb,
  leader_welcome jsonb default '{"name": "Ahmad Fauzi Pratama", "title": "Ketua Umum BPH", "quote": "Organisasi ini bukan sekadar wadah berkumpul, melainkan kawah candradimuka tempat kita menempa gagasan, mengasah kepemimpinan, dan menebar manfaat nyata bagi masyarakat.", "photo_url": ""}'::jsonb,
  contact_info jsonb default '{"address": "Jl. Pelajar Nusantara No. 12, Medan, Sumatera Utara", "email": "sekretariat@organisasi.id", "whatsapp": "+6281234567890", "instagram": "@organisasi_official", "maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127418.59828859346!2d98.60341775!3d3.59519565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131cc1c3eb2fd%3A0x23d431b8a690e8a!2sMedan%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"}'::jsonb,
  documents jsonb default '[{"title": "Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)", "desc": "Pedoman pokok konstitusi dan tata kelola organisasi.", "file_url": ""}, {"title": "Buku Profil Organisasi (Company Profile)", "desc": "Ringkasan sejarah, visi misi, dan program kerja utama.", "file_url": ""}]'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. UNIT STRUKTUR ORGANISASI
create table if not exists public.org_units (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  category text not null check (category in ('advisor', 'core', 'division', 'region')),
  parent_id uuid references public.org_units(id) on delete cascade,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists org_units_parent_idx on public.org_units (parent_id);
create index if not exists org_units_category_idx on public.org_units (category);

-- 3. JABATAN & PEJABAT ORGANISASI
create table if not exists public.org_positions (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.org_units(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  person_name text,
  subtitle text, -- Asal kampus, stambuk, profesi, atau gelar
  photo_url text,
  social_link text, -- link LinkedIn / medsos
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists org_positions_unit_idx on public.org_positions (unit_id);

-- 4. KEGIATAN & AGENDA
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Program Kerja',
  description text,
  location text,
  event_date date not null,
  is_upcoming boolean not null default false,
  cover_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_date_idx on public.activities (event_date desc);

-- 5. FOTO DOKUMENTASI KEGIATAN (Galeri)
create table if not exists public.activity_photos (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  photo_url text not null,
  storage_path text not null,
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists activity_photos_activity_idx on public.activity_photos (activity_id);

-- 6. PENGUMUMAN RESMI
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text default 'Warta Resmi',
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  file_url text,
  created_at timestamptz not null default now()
);

-- 7. PESAN MASUK KONTAK
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 5 and 150),
  phone text,
  message text not null check (char_length(message) between 5 and 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. DAFTAR ADMIN
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 9. TRIGGER UPDATED_AT
create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

drop trigger if exists trg_activities_updated on public.activities;
create trigger trg_activities_updated before update on public.activities
  for each row execute function public.set_updated_at();

-- ==========================================================
-- DATA AWAL (SEEDING STRUKTUR SESUAI PERMINTAAN USER)
-- ==========================================================

-- Pastikan setting 'main' ada
insert into public.site_settings (id)
values ('main')
on conflict (id) do nothing;

do $$
declare
  u_advisor uuid;
  u_core uuid;
  u_divisions_root uuid;
  u_div uuid;
  u_regions_root uuid;
  u_reg uuid;
  div_names text[] := array[
    'Bidang Pendidikan',
    'Bidang Kaderisasi dan Keanggotaan',
    'Bidang Sosial dan Kerohanian',
    'Bidang Seni dan Budaya',
    'Bidang Olahraga',
    'Bidang Komunikasi dan Informasi',
    'Bidang Humas dan Kemitraan'
  ];
  div_name text;
  i int := 0;
  reg_names text[] := array[
    'Wilayah 1: Medan - Aceh',
    'Wilayah 2: Kepulauan Riau - Batam',
    'Wilayah 3: Sumatera Barat',
    'Wilayah 4: Jawa - Bali',
    'Wilayah 5: Manado dan Sekitarnya'
  ];
  reg_name text;
begin
  -- Hanya inisialisasi jika org_units masih kosong
  if not exists (select 1 from public.org_units limit 1) then

    -- 1. DEWAN PEMBINA & PENDIRI
    insert into public.org_units (name, category, sort_order)
    values ('Dewan Pembina & Pendiri', 'advisor', 1)
    returning id into u_advisor;

    insert into public.org_positions (unit_id, title, sort_order)
    values 
      (u_advisor, 'Founder & Dewan Pembina', 1),
      (u_advisor, 'Dewan Pembina', 2);

    -- 2. BPH INTI
    insert into public.org_units (name, category, sort_order)
    values ('BPH Inti', 'core', 2)
    returning id into u_core;

    insert into public.org_positions (unit_id, title, sort_order)
    values 
      (u_core, 'Ketua Umum', 1),
      (u_core, 'Wakil Ketua Umum', 2),
      (u_core, 'Sekretaris Umum', 3),
      (u_core, 'Wakil Sekretaris Umum', 4),
      (u_core, 'Bendahara Umum', 5),
      (u_core, 'Wakil Bendahara Umum', 6);

    -- 3. BPH BIDANG (7 BIDANG)
    insert into public.org_units (name, category, sort_order)
    values ('BPH Bidang', 'division', 3)
    returning id into u_divisions_root;

    foreach div_name in array div_names loop
      i := i + 1;
      insert into public.org_units (name, category, parent_id, sort_order)
      values (div_name, 'division', u_divisions_root, i)
      returning id into u_div;

      insert into public.org_positions (unit_id, title, sort_order)
      values 
        (u_div, 'Koordinator Bidang', 1),
        (u_div, 'Anggota Bidang', 2);
    end loop;

    -- 4. KOORDINATOR WILAYAH (5 WILAYAH - TERPISAH)
    insert into public.org_units (name, category, sort_order)
    values ('Koordinator Wilayah', 'region', 4)
    returning id into u_regions_root;

    i := 0;
    foreach reg_name in array reg_names loop
      i := i + 1;
      insert into public.org_units (name, category, parent_id, sort_order)
      values (reg_name, 'region', u_regions_root, i)
      returning id into u_reg;

      insert into public.org_positions (unit_id, title, sort_order)
      values 
        (u_reg, 'Koordinator Wilayah', 1),
        (u_reg, 'Sekretaris Wilayah', 2);
    end loop;

  end if;
end $$;

-- CONTOH KEGIATAN AWAL AGAR WEB TIDAK KOSONG
insert into public.activities (title, category, description, location, event_date, is_upcoming, is_published)
values 
  ('Rapat Kerja Nasional & Silaturahmi Akbar 2025', 'Rapat Kerja', 'Musyawarah tahunan penyusunan program kerja strategis seluruh bidang dan konsolidasi 5 wilayah se-Indonesia.', 'Gedung Pertemuan Graha Pemuda, Medan', current_date + interval '14 days', true, true),
  ('Seminar Kepemimpinan & Pelatihan Kader Pemuda', 'Kaderisasi', 'Pelatihan intensif manajemen organisasi, pemecahan masalah kepemimpinan, dan etika komunikasi publik.', 'Auditorium Kampus Utama & Daring (Zoom)', current_date - interval '10 days', false, true),
  ('Bakti Sosial & Pemeriksaan Kesehatan Masyarakat', 'Sosial', 'Aksi sosial peduli masyarakat mencakup pemeriksaan kesehatan gratis, santunan anak yatim, dan pembagian sembako.', 'Kelurahan Harapan Baru, Wilayah 1', current_date - interval '25 days', false, true)
on conflict do nothing;

-- CONTOH PENGUMUMAN AWAL
insert into public.announcements (title, content, category, is_pinned, is_published)
values 
  ('Maklumat Pelaksanaan Rapat Kerja Nasional 2025', 'Diberitahukan kepada seluruh jajaran BPH Inti, Koordinator Bidang, dan Koordinator Wilayah untuk hadir dalam Rakernas yang akan diselenggarakan bulan depan. Detail rundown dan akomodasi terlampir di sekretariat.', 'Penting', true, true),
  ('Pembaruan Struktur Kepengurusan & SK Periode 2024–2025', 'Surat Keputusan (SK) pengangkatan pengurus BPH dan jajaran wilayah telah disahkan bersama Dewan Pembina. Pengurus dapat mengunduh dokumen legalitas melalui website resmi.', 'Warta Resmi', false, true)
on conflict do nothing;
