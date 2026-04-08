import MaterialSymbol from '../components/ui/MaterialSymbol'
import { buildKpiCards } from '../lib/kpiMapper'
import { useDashboardStore } from '../store/dashboardStore'

const toneStyles = {
  green: {
    iconWrapper: 'bg-emerald-100 text-emerald-700',
    icon: 'trending_down',
    subtitle: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    tag: 'bg-slate-200 text-slate-600',
    tagAccent: 'bg-emerald-500 text-white',
  },
  indigo: {
    iconWrapper: 'bg-indigo-100 text-indigo-700',
    icon: 'inventory_2',
    subtitle: 'text-emerald-700',
    badge: 'bg-indigo-100 text-indigo-700',
    tag: 'bg-slate-200 text-slate-600',
    tagAccent: 'bg-indigo-500 text-white',
  },
  rose: {
    iconWrapper: 'bg-rose-100 text-rose-700',
    icon: 'groups',
    subtitle: 'text-slate-500',
    badge: 'bg-rose-100 text-rose-700',
    tag: 'bg-slate-200 text-slate-600',
    tagAccent: 'bg-emerald-500 text-white',
  },
} as const

const KpiCards = () => {
  const kpis = useDashboardStore((state) => state.kpis)
  const cards = buildKpiCards(kpis)

  // Ajusta tamaño/recorte del valor principal segun tipo de tarjeta para evitar bloques sobredimensionados.
  const getMainValueClassName = (cardId: string) => {
    if (cardId === 'cheapest-product') {
      return "font-['Manrope'] text-[clamp(1.05rem,2.1vw,1.9rem)] font-bold leading-tight text-slate-900 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]"
    }

    return "font-['Manrope'] text-[clamp(1.15rem,2.4vw,2rem)] font-extrabold leading-tight text-slate-900"
  }

  return (
    <>
      {/* Grilla progresiva: 1 columna mobile, 2 en tablet y 3 en desktop. */}
      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const styles = toneStyles[card.tone]

          return (
            <article
              key={card.id}
              className="rounded-3xl border border-slate-200/80 bg-white/75 p-4 shadow-[0_16px_48px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconWrapper}`}>
                  <MaterialSymbol name={styles.icon} className="text-[22px]" />
                </div>
                {card.badge ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-[0.16em] ${styles.badge}`}>
                    {card.badge}
                  </span>
                ) : null}
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-sm font-bold tracking-[0.18em] text-slate-500">{card.title}</p>
                <h3 className={getMainValueClassName(card.id)}>
                  {card.mainValue}
                </h3>
                {/* Subtitulo levemente mas contenido para equilibrar la jerarquia visual al 100%. */}
                <p className={`text-sm font-semibold sm:text-base ${styles.subtitle}`}>{card.subtitle}</p>
              </div>

              {card.tags ? (
                <div className="mt-5 flex items-center gap-2">
                  {card.tags.map((tag, index) => {
                    const totalTags = card.tags?.length ?? 0
                    const isAccent = tag.startsWith('+') || index === totalTags - 1

                    return (
                      <span
                        key={`${card.id}-${tag}`}
                        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
                          isAccent ? styles.tagAccent : styles.tag
                        }`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </article>
          )
        })}
      </section>
    </>
  )
}

export default KpiCards