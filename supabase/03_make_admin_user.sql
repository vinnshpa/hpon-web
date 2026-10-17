-- ==========================================================
-- SKRIP 03: MENDAFTARKAN AKUN ADMIN PERTAMA
-- ==========================================================
-- Langkah:
-- 1. Buat user baru di dashboard Supabase:
--    Menu "Authentication" -> "Users" -> "Add user" -> "Create new user".
-- 2. Ganti 'admin@organisasi.id' di bawah dengan email yang Anda daftarkan tadi.
-- 3. Jalankan skrip ini di SQL Editor.

insert into public.admin_users (user_id)
select id from auth.users where email = 'admin@organisasi.id'
on conflict do nothing;

-- Verifikasi:
select u.email, a.created_at as admin_since
from public.admin_users a
join auth.users u on u.id = a.user_id;
