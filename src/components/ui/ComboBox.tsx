import { useEffect, useRef, useState } from 'react'

type ComboBoxProps = {
  options: string[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  label?: string
  multi?: boolean
}

const ComboBox = ({ options, selected, onChange, placeholder = 'Seleccionar', label, multi = true }: ComboBoxProps) => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const toggleOption = (opt: string) => {
    if (multi) {
      if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt))
      else onChange([...selected, opt])
    } else {
      onChange(selected.includes(opt) ? [] : [opt])
      setOpen(false)
    }
  }

  const visible = options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div className="relative inline-block" ref={ref}>
      {label && <div className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</div>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-40 w-full items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-left text-sm shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        <div className="flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selected.map((s) => (
                <span key={s} className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <svg className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 w-full max-w-xl rounded-xl border bg-white p-3 shadow-lg">
          <div className="mb-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar..."
              className="w-full rounded-md border px-3 py-2 text-sm placeholder:text-slate-400"
            />
          </div>

          <ul className="max-h-56 overflow-auto">
            {visible.length === 0 ? (
              <li className="py-2 text-center text-sm text-slate-500">No hay resultados</li>
            ) : (
              visible.map((opt) => {
                const active = selected.includes(opt)
                return (
                  <li key={opt} className="py-1">
                    <button
                      type="button"
                      onClick={() => toggleOption(opt)}
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-slate-50 ${active ? 'bg-emerald-50' : ''}`}
                    >
                      <span className="truncate text-emerald-600">{opt}</span>
                      <input readOnly type="checkbox" checked={active} className="h-4 w-4 text-emerald-600" />
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ComboBox
