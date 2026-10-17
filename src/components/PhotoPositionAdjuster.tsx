import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

interface PhotoPositionAdjusterProps {
  value?: string
  onChange: (value: string) => void
}

function parsePos(pos?: string): { x: number; y: number } {
  if (!pos) return { x: 50, y: 20 }
  if (pos === 'top') return { x: 50, y: 20 }
  if (pos === 'center') return { x: 50, y: 50 }
  if (pos === 'bottom') return { x: 50, y: 80 }
  const match = pos.match(/(\d+)%\s+(\d+)%/)
  if (match) {
    return {
      x: Math.min(100, Math.max(0, parseInt(match[1], 10))),
      y: Math.min(100, Math.max(0, parseInt(match[2], 10))),
    }
  }
  return { x: 50, y: 20 }
}

export default function PhotoPositionAdjuster({ value, onChange }: PhotoPositionAdjusterProps) {
  const { x, y } = parsePos(value)

  const update = (newX: number, newY: number) => {
    const clampedX = Math.min(100, Math.max(0, Math.round(newX)))
    const clampedY = Math.min(100, Math.max(0, Math.round(newY)))
    onChange(`${clampedX}% ${clampedY}%`)
  }

  const shift = (dx: number, dy: number) => {
    update(x + dx, y + dy)
  }

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/90 p-3 text-xs text-left shadow-xs">
      {/* Header & Nilai Koordinat */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-800">Geser Posisi Potongan</span>
        <span className="rounded-md bg-blue-950 px-2 py-0.5 font-mono text-[10px] font-bold text-yellow-400 shadow-xs">
          X: {x}% · Y: {y}%
        </span>
      </div>

      {/* Sliders: Horisontal & Vertikal */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
            <span>↔️ Kiri — Kanan</span>
            <span className="font-semibold text-slate-800">{x}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={x}
            onChange={(e) => update(parseInt(e.target.value, 10), y)}
            className="w-full accent-blue-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
            <span>↕️ Atas — Bawah</span>
            <span className="font-semibold text-slate-800">{y}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={y}
            onChange={(e) => update(x, parseInt(e.target.value, 10))}
            className="w-full accent-blue-950 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
        </div>
      </div>

      {/* D-Pad 4 Arah & Presets Cepat */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        {/* Tombol Panah 4 Arah */}
        <div>
          <span className="block text-[10px] font-semibold text-slate-500 mb-1">
            Tombol Presisi:
          </span>
          <div className="inline-grid grid-cols-3 gap-1">
            <span />
            <button
              type="button"
              title="Geser Naik (Atas)"
              onClick={() => shift(0, -4)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-950 hover:text-white transition shadow-xs active:scale-95"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <span />

            <button
              type="button"
              title="Geser ke Kiri"
              onClick={() => shift(-4, 0)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-950 hover:text-white transition shadow-xs active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Reset ke Default Wajah (50% 20%)"
              onClick={() => update(50, 20)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-yellow-400/20 border border-yellow-500/40 text-yellow-800 hover:bg-yellow-400 transition shadow-xs active:scale-95"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <button
              type="button"
              title="Geser ke Kanan"
              onClick={() => shift(4, 0)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-950 hover:text-white transition shadow-xs active:scale-95"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <span />
            <button
              type="button"
              title="Geser Turun (Bawah)"
              onClick={() => shift(0, 4)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-950 hover:text-white transition shadow-xs active:scale-95"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
            <span />
          </div>
        </div>

        {/* Pilihan Cepat (Presets) */}
        <div className="flex flex-col gap-1 text-[11px]">
          <span className="block text-[10px] font-semibold text-slate-500 mb-0.5">
            Pilihan Cepat:
          </span>
          <button
            type="button"
            onClick={() => update(50, 15)}
            className={`rounded-md px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 15
                ? 'bg-blue-950 text-yellow-400 border-blue-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Fokus Wajah
          </button>
          <button
            type="button"
            onClick={() => update(50, 25)}
            className={`rounded-md px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 25
                ? 'bg-blue-950 text-yellow-400 border-blue-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pasfoto
          </button>
          <button
            type="button"
            onClick={() => update(50, 50)}
            className={`rounded-md px-2.5 py-1 font-semibold border transition ${
              x === 50 && y === 50
                ? 'bg-blue-950 text-yellow-400 border-blue-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tengah
          </button>
        </div>
      </div>
    </div>
  )
}
