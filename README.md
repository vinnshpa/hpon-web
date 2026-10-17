# Website Resmi Organisasi & Kepengurusan BPH (Full CMS)

Website resmi organisasi berkinerja tinggi, elegan, responsif, dan aman berbasis **React 19 + TypeScript + Vite + Tailwind CSS v4 + Supabase**.

Dilengkapi sistem **Full CMS** di Dashboard Admin: pengurus dapat mengubah seluruh profil, nama kabinet, sambutan ketua umum, struktur organisasi (Dewan Pembina, Founder, BPH Inti, 7 BPH Bidang, 5 Wilayah), kegiatan, galeri foto dokumentasi, pengumuman, dan membaca pesan kontak tanpa menyentuh kode.

---

## 🚀 Fitur Utama

1. **Beranda Interaktif**:
   - Hero section dengan nama kabinet & tagline dinamis.
   - 4 Angka Capaian / Statistik Utama (*Key Impact Metrics*).
   - 3 Pilar Gerakan & Fokus Organisasi.
   - Sambutan Ketua Umum dengan foto formal dan kutipan.
   - Cuplikan kegiatan terbaru dan pengumuman resmi.

2. **Profil & Struktur Organisasi Lengkap (`/profil`)**:
   - Sejarah / Tentang Kami, Visi, dan butir-butir Misi strategis.
   - Pusat Unduhan Dokumen Resmi (AD/ART, Company Profile dsb).
   - **Bagan Struktur Organisasi 4 Tingkat**:
     - **Tingkat 1**: Dewan Pembina & Pendiri (*Founder & Dewan Pembina*, *Dewan Pembina*)
     - **Tingkat 2**: Badan Pengurus Harian (BPH) Inti (Ketum, Waketum, Sekum, Wasekum, Bendum, Wabendum)
     - **Tingkat 3**: BPH Bagian Bidang (7 Bidang kerja operasional)
     - **Tingkat 4**: Koordinator Wilayah (5 Wilayah daerah terpisah secara tegas)

3. **Kegiatan & Galeri Dokumentasi (`/kegiatan` & `/kegiatan/:id`)**:
   - Filter tab: Semua Kegiatan, Agenda Mendatang, Telah Terlaksana (Arsip).
   - Kategori & pencarian kegiatan.
   - Halaman detail agenda & album galeri dokumentasi foto dengan *lightbox popup*.

4. **Pengumuman & Warta Resmi (`/pengumuman`)**:
   - Pengumuman resmi dengan penanda *Disematkan (Pin)*.
   - Fitur unduh lampiran dokumen PDF.

5. **Kontak & Aspirasi (`/kontak`)**:
   - Alamat sekretariat, surel, nomor telepon, dan media sosial.
   - Tombol cepat *"Chat via WhatsApp"*.
   - Sematan peta lokasi kantor (Google Maps Embed).
   - Formulir pesan publik yang masuk langsung ke dashboard admin.

6. **Panel Administrator (`/admin/dashboard`)**:
   - **Tab 1: Pengaturan Web (CMS)**: Ganti nama organisasi, kabinet, visi-misi, sambutan ketum, angka statistik, kontak, medsos, dokumen AD/ART.
   - **Tab 2: Struktur Organisasi**: Visual tree editor untuk mengisi pejabat, nama, gelar/kampus, upload foto pengurus resmi, urutkan posisi naik/turun.
   - **Tab 3: Kegiatan & Galeri**: Tambah kegiatan, multi-upload foto dokumentasi ke Supabase Storage, atur cover.
   - **Tab 4: Pengumuman**: Buat pengumuman resmi, toggle pin, lampiran file.
   - **Tab 5: Kotak Masuk Pesan**: Baca pesan dari masyarakat, tandai sudah dibaca, balas via WhatsApp/Email.

---

## 🛠️ Langkah Menjalankan Project (Dari 0)

### 1. Database Supabase (Hanya Sekali)
1. Buka [supabase.com](https://supabase.com) dan buat project baru (Pilih region terdekat: Singapore).
2. Buka menu **SQL Editor** -> **New query**.
3. Jalankan isi file `supabase/01_schema_and_seed.sql`.
4. Jalankan isi file `supabase/02_rls_and_storage.sql`.
5. Buat akun pengurus pertama:
   - Buka menu **Authentication** -> **Users** -> **Add user** -> **Create new user**.
   - Masukkan email dan password Anda, centang *Auto Confirm User*.
   - Buka kembali **SQL Editor**, buka file `supabase/03_make_admin_user.sql`, ganti email dengan email Anda, lalu klik **Run**.
6. Ambil URL & Key:
   - Buka **Project Settings** -> **API**.
   - Catat `Project URL` dan `anon` / `publishable key`.

### 2. Konfigurasi Lingkungan Lokal
Buka file `.env.local` di folder project ini dan masukkan data Supabase:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...isi_anon_key_anda
```

### 3. Menjalankan Server Lokal
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### 4. Build & Deploy ke Vercel
1. Pastikan build lolos:
   ```bash
   npm run build
   ```
2. Hubungkan ke repositori GitHub dan import di [vercel.com](https://vercel.com).
3. Masukkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di pengaturan Vercel.
4. Klik **Deploy**!
