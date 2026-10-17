import type { SiteSettings } from '../types'

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 'main',
  org_name: 'Haga Pendidikan Ono Niha',
  org_tagline: 'Lembaga & Gerakan Sosial Perjuangan Pendidikan Generasi Muda Kepulauan Nias',
  cabinet_name: 'Kabinet Sinergi Progresif 2024–2025',
  about_text:
    'Haga Pendidikan Ono Niha (HPON) adalah sebuah lembaga dan gerakan sosial perjuangan pendidikan yang didirikan pada tahun 2021 oleh aktivis pendidikan Joniwarsito Waruwu. Lembaga ini hadir untuk membantu serta mengawal generasi muda asal Kepulauan Nias (Ono Niha) agar memiliki akses, pendampingan, dan kesempatan yang setara untuk menempuh pendidikan tinggi di berbagai perguruan tinggi terbaik di Indonesia.',
  vision:
    'Terwujudnya generasi muda Ono Niha yang berpendidikan tinggi, cerdas, berintegritas, dan siap menjadi penggerak kemajuan Kepulauan Nias serta bangsa Indonesia.',
  missions: [
    'Sosialisasi Pendidikan: Aktif mendatangi sekolah-sekolah di wilayah Kepulauan Nias untuk memberikan edukasi mengenai jalur masuk PTN, UTBK-SNBT, hingga sekolah kedinasan.',
    'Fasilitator & Pendampingan: Memfasilitasi pelajar Nias melalui program tryout berkala, serta membantu biaya akomodasi dan transportasi bagi pelajar terpilih yang mengikuti ujian masuk PTN di luar pulau.',
    'Pengawalan di Tanah Rantau: Mengantar dan mendampingi mahasiswa baru asal Nias saat mulai menempuh perkuliahan di berbagai kota perantauan guna membantu masa transisi adaptasi mereka.',
    'Membangun jejaring kolaborasi antardaerah (Medan-Aceh, Kepri-Batam, Sumbar, Jawa-Bali, dan Manado) untuk memperkokoh solidaritas sesama Ono Niha.',
  ],
  stats: [
    { value: '2021', label: 'Tahun Didirikan' },
    { value: '1.000+', label: 'Pelajar Terbina' },
    { value: '5', label: 'Wilayah Pengawalan' },
    { value: '100%', label: 'Gerakan Sosial' },
  ],
  pillars: [
    {
      title: 'Sosialisasi Pendidikan',
      desc: 'Edukasi komprehensif ke sekolah-sekolah se-Nias mengenai jalur PTN, UTBK-SNBT, dan sekolah kedinasan.',
      icon: 'GraduationCap',
    },
    {
      title: 'Fasilitator & Pendampingan',
      desc: 'Penyelenggaraan tryout serta dukungan akomodasi dan transportasi seleksi masuk PTN di luar pulau.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Pengawalan Tanah Rantau',
      desc: 'Pendampingan langsung bagi mahasiswa baru asal Nias saat pertama kali tiba dan beradaptasi di kota kuliah.',
      icon: 'Globe',
    },
  ],
  leader_welcome: {
    card_title: 'Sambutan Ketua Umum',
    name: 'Ketua Umum BPH',
    title: 'Ketua Umum BPH',
    quote:
      'Haga Pendidikan Ono Niha lahir dari komitmen suci bahwa tidak boleh ada putra-putri Nias yang terhenti cita-citanya meraih perguruan tinggi hanya karena keterbatasan informasi dan akses. Bersama kita kawal generasi Ono Niha menuju masa depan gilang-gemilang.',
    photo_url: '',
    photo_position: 'top',
  },
  contact_info: {
    address: 'Kepulauan Nias & Sekretariat Penghubung Medan, Sumatera Utara',
    email: 'sekretariat@hpon.org',
    whatsapp: '+6281234567890',
    instagram: '@hpon_official',
    maps_embed_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1020478.4357731773!2d97.02102860431873!3d1.082728271101912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30282490b791fc51%3A0xe541c9693cfa3aa8!2sPulau%20Nias!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  documents: [
    {
      title: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART)',
      desc: 'Pedoman pokok konstitusi dan tata kelola organisasi HPON.',
      file_url: '',
    },
    {
      title: 'Profil Gerakan & Panduan Beasiswa HPON',
      desc: 'Buku panduan sosialisasi PTN, beasiswa, dan pendampingan rantau.',
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

export const formatInstagramUrl = (handleOrUrl?: string): string => {
  if (!handleOrUrl) return '#'
  const trimmed = handleOrUrl.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  const clean = trimmed.replace(/^@/, '')
  return `https://instagram.com/${clean}`
}

export interface ParsedSocialLink {
  label: string
  url: string
}

export const parseSocialLink = (raw?: string | null): ParsedSocialLink | null => {
  if (!raw || !raw.trim()) return null
  const trimmed = raw.trim()
  if (trimmed.includes('|')) {
    const [labelPart, ...urlParts] = trimmed.split('|')
    const url = urlParts.join('|').trim()
    if (url) {
      return {
        label: labelPart.trim() || 'Tautan Profil',
        url: url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`,
      }
    }
  }

  // Deteksi cerdas label jika hanya URL yang dimasukkan
  let label = 'Tautan Profil'
  if (trimmed.includes('instagram.com')) label = 'Instagram'
  else if (trimmed.includes('linkedin.com')) label = 'LinkedIn'
  else if (trimmed.includes('facebook.com')) label = 'Facebook'
  else if (trimmed.includes('twitter.com') || trimmed.includes('x.com')) label = 'X / Twitter'
  else if (trimmed.includes('wa.me')) label = 'WhatsApp'

  return {
    label,
    url: trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`,
  }
}

export const formatSocialLinkPayload = (label?: string, url?: string): string | null => {
  if (!url || !url.trim()) return null
  const cleanUrl = url.trim()
  const cleanLabel = label?.trim()
  if (!cleanLabel) return cleanUrl
  return `${cleanLabel} | ${cleanUrl}`
}
