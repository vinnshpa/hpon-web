import type { SiteSettings } from '../types'

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'main',
  org_name: 'Haga Pendidikan Ono Niha',
  org_tagline: 'Wadah Kolaborasi, Pendidikan, dan Pengabdian Generasi Muda Ono Niha (Ya’ahowu)',
  cabinet_name: 'Kabinet Sinergi Progresif 2024–2025',
  about_text:
    'Haga Pendidikan Ono Niha (HPON) didirikan sebagai wadah persatuan, pencerahan intelektual, dan pengabdian bagi generasi muda Ono Niha di berbagai wilayah Nusantara. Berpijak pada nilai luhur persaudaraan dan semangat Ya’ahowu, HPON berkomitmen memperjuangkan kemajuan pendidikan, kepemimpinan, dan kesejahteraan masyarakat.',
  vision:
    'Terwujudnya generasi muda Ono Niha yang unggul dalam pendidikan, berkarakter luhur, berdaya saing global, dan berakar kuat pada nilai-nilai persaudaraan.',
  missions: [
    'Memajukan akses dan kualitas pendidikan bagi pemuda dan pelajar Ono Niha di seluruh wilayah.',
    'Menumbuhkembangkan jiwa kepemimpinan, integritas, dan solidaritas persaudaraan lintas generasi.',
    'Menyelenggarakan program pengabdian masyarakat, aksi sosial, dan pelestarian nilai budaya luhur Nias.',
    'Membangun sinergi dan jejaring kemitraan strategis dengan berbagai pemangku kepentingan di tingkat regional maupun nasional.',
  ],
  stats: [
    { value: '1.000+', label: 'Kader & Pelajar' },
    { value: '25+', label: 'Program Kerja / Thn' },
    { value: '5', label: 'Wilayah Koordinasi' },
    { value: '2018', label: 'Tahun Berdiri' },
  ],
  pillars: [
    {
      title: 'Pendidikan & Beasiswa',
      desc: 'Mendorong akses pendidikan tinggi, bimbingan belajar, dan beasiswa bagi putra-putri Nias.',
      icon: 'GraduationCap',
    },
    {
      title: 'Aksi Sosial & Budaya',
      desc: 'Pengabdian nyata kepada masyarakat, aksi tanggap kemanusiaan, dan pelestarian budaya.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Jejaring Nusantara',
      desc: 'Menghubungkan kader dan mahasiswa di Medan-Aceh, Kepri-Batam, Sumbar, Jawa-Bali, hingga Manado.',
      icon: 'Globe',
    },
  ],
  leader_welcome: {
    name: 'Ketua Umum BPH',
    title: 'Ketua Umum BPH',
    quote:
      'Ya’ahowu! Haga Pendidikan Ono Niha hadir sebagai obor penerang dan rumah kebersamaan untuk menempa generasi penerus yang cerdas, berkarakter, dan berdaya guna bagi tanah kelahiran dan bangsa.',
    photo_url: '',
  },
  contact_info: {
    address: 'Jl. Pelajar Nusantara No. 12, Medan, Sumatera Utara',
    email: 'sekretariat@hpon.org',
    whatsapp: '+6281234567890',
    instagram: '@hpon_official',
    maps_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127418.59828859346!2d98.60341775!3d3.59519565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131cc1c3eb2fd%3A0x23d431b8a690e8a!2sMedan%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  documents: [
    {
      title: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)',
      desc: 'Pedoman pokok konstitusi dan tata kelola organisasi HPON.',
      file_url: '',
    },
    {
      title: 'Buku Profil Organisasi (Company Profile HPON)',
      desc: 'Ringkasan sejarah, visi misi, dan program kerja unggulan.',
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
