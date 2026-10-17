import { supabase } from '../../lib/supabase'
import { fetchContactMessages } from '../../lib/api'
import { errMsg, useFetch } from '../../hooks/useFetch'
import { formatDate } from '../../lib/constants'
import { card } from '../../lib/ui'
import type { ContactMessage } from '../../types'
import Spinner from '../../components/Spinner'
import ErrorBox from '../../components/ErrorBox'
import {
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  Calendar,
  CheckCircle,
  Inbox,
  ExternalLink,
} from 'lucide-react'

export default function AdminMessages() {
  const { data: messages, loading, error, reload } = useFetch(fetchContactMessages, [])

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const { error: err } = await supabase
        .from('contact_messages')
        .update({ is_read: !msg.is_read })
        .eq('id', msg.id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesan kontak ini?')) return
    try {
      const { error: err } = await supabase.from('contact_messages').delete().eq('id', id)
      if (err) throw err
      reload()
    } catch (e: unknown) {
      alert(errMsg(e))
    }
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold text-blue-950">
          Kotak Masuk Pesan Kontak ({messages?.length ?? 0})
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Aspirasi, pertanyaan, dan permohonan kemitraan yang dikirim oleh publik melalui form kontak.
        </p>
      </div>

      {loading && <Spinner />}
      {error && <ErrorBox message={error} />}

      <div className="space-y-4">
        {messages?.map((msg) => {
          const rawPhone = msg.phone?.replace(/\D/g, '')

          return (
            <div
              key={msg.id}
              className={`${card} p-6 space-y-4 ${
                !msg.is_read ? 'border-l-4 border-yellow-500 bg-yellow-50/10' : 'bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 font-bold text-yellow-400 text-sm">
                    {msg.name[0]?.toUpperCase() || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{msg.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {msg.email}
                      </span>
                      {msg.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {msg.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(msg.created_at)}
                  </span>
                  {!msg.is_read ? (
                    <span className="rounded-full bg-yellow-500 px-2.5 py-0.5 font-bold text-blue-950">
                      Baru
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                      Dibaca
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {msg.message}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Tanggapan%20Pesan%20dari%20Pengurus&body=Halo%20${encodeURIComponent(
                      msg.name
                    )},%0A%0A`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950 px-3 py-1.5 text-xs font-semibold text-yellow-400 hover:bg-blue-900 transition"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Balas via Email
                  </a>

                  {rawPhone && (
                    <a
                      href={`https://wa.me/${rawPhone}?text=Halo%20${encodeURIComponent(
                        msg.name
                      )},%20kami%20dari%20pengurus%20organisasi...`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Balas via WhatsApp
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-950 transition"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    {msg.is_read ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}
                  </button>

                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition"
                    title="Hapus pesan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}

        {!loading && messages?.length === 0 && (
          <div className={`${card} p-12 text-center text-slate-500`}>
            <Inbox className="mx-auto h-10 w-10 text-slate-400 mb-2" />
            <h3 className="text-lg font-bold text-slate-700">Kotak Masuk Kosong</h3>
            <p className="text-sm mt-1">Belum ada pesan yang dikirim oleh pengunjung.</p>
          </div>
        )}
      </div>
    </div>
  )
}
