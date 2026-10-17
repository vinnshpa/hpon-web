import type { SiteSettings } from '../types'

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'main',
  org_name: 'Himpunan Pemuda & Pelajar',
  org_tagline: 'Wadah Kolaborasi, Kepemimpinan, dan Pengabdian',
  cabinet_name: 'Kabinet Sinergi Progresif 2024–2025',
  about_text:
    'Organisasi ini didirikan sebagai wadah persatuan, pengembangan potensi intelektual, kepemimpinan, dan pengabdian masyarakat bagi seluruh generasi muda.',
  vision:
    'Terwujudnya organisasi yang berintegritas, unggul dalam keilmuan, mandiri, dan berkontribusi nyata bagi bangsa.',
  missions: [
    'Mempererat tali persaudaraan dan solidaritas antar kader, pengurus, serta pembina.',
    'Menyelenggarakan kegiatan kaderisasi, pelatihan kepemimpinan, dan penguatan intelektual.',
    'Mendorong aksi sosial dan pengabdian nyata kepada masyarakat di berbagai wilayah.',
    'Membangun kemitraan strategis dengan institusi pendidikan, pemerintah, dan swasta.',
  ],
  stats: [
    { value: '1.000+', label: 'Kader & Alumni' },
    { value: '25+', label: 'Program Kerja / Thn' },
    { value: '5', label: 'Wilayah Koordinasi' },
    { value: '2018', label: 'Tahun Berdiri' },
  ],
  pillars: [
    {
      title: 'Pengembangan Karir & Akademik',
      desc: 'Membuka akses pelatihan, beasiswa, dan peningkatan kapabilitas intelektual kader.',
      icon: 'GraduationCap',
    },
    {
      title: 'Pengabdian & Aksi Sosial',
      desc: 'Bakti nyata untuk masyarakat, lingkungan, dan aksi tanggap kemanusiaan.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Jaringan & Kemitraan',
      desc: 'Membangun relasi antarwilayah dan kolaborasi dengan berbagai pemangku kepentingan.',
      icon: 'Globe',
    },
  ],
  leader_welcome: {
    name: 'Ahmad Fauzi Pratama',
    title: 'Ketua Umum BPH',
    quote:
      'Organisasi ini bukan sekadar wadah berkumpul, melainkan kawah candradimuka tempat kita menempa gagasan, mengasah kepemimpinan, dan menebar manfaat nyata bagi masyarakat.',
    photo_url: '',
  },
  contact_info: {
    address: 'Jl. Pelajar Nusantara No. 12, Medan, Sumatera Utara',
    email: 'sekretariat@organisasi.id',
    whatsapp: '+6281234567890',
    instagram: '@organisasi_official',
    maps_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127418.59828859346!2d98.60341775!3d3.59519565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131cc1c3eb2fd%3A0x23d431b8a690e8a!2sMedan%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  documents: [
    {
      title: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)',
      desc: 'Pedoman pokok konstitusi dan tata kelola organisasi.',
      file_url: '',
    },
    {
      title: 'Buku Profil Organisasi (Company Profile)',
      desc: 'Ringkasan sejarah, visi misi, dan program kerja utama.',
      file_url: '',
    },
  ],
}

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    })
  } catch {
    return dateStr
  }
}
