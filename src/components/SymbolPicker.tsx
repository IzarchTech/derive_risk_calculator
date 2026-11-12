import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info, Sparkles, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { FAMILIES, SYMBOLS } from '../data/symbols'
import { MODES } from '../data/modes'
import { rankSymbols, topPicks, type Rec } from '../lib/recommend'
import { formatUSD, fmtNum } from '../lib/format'
import { labelCls } from '../lib/ui'
import type { Calculator } from '../hooks/useCalculator'
import type { Family, Fit, ModeId } from '../types'

type Tab = ModeId | 'all'

const FIT_BADGE: Record<Fit, { label: string; cls: string }> = {
  fits: { label: 'Fits', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  stretch: { label: 'Tight stop', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  'too-big': { label: 'Too big', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
}

const VOL_PILL = {
  low: 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
}

function Direction({ cat }: { cat: Family }) {
  if (cat === 'boom' || cat === 'vob') return <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
  if (cat === 'crash' || cat === 'voc') return <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
  return null
}

export default function SymbolPicker({ c }: { c: Calculator }) {
  const [tab, setTab] = useState<Tab>(c.modeId)
  const [family, setFamily] = useState<Family | 'all'>('all')
  useEffect(() => setTab(c.modeId), [c.modeId])

  // Ranking always uses the ACTIVE mode's risk budget and the user's balance.
  const ranked = useMemo(() => rankSymbols(SYMBOLS, c.balance, c.mode), [c.balance, c.mode])
  const { picks, anyFit } = useMemo(() => topPicks(ranked, 3), [ranked])

  const rows = useMemo(() => {
    if (tab === 'all') return ranked.filter((r) => family === 'all' || r.sym.category === family)
    const want = tab === 'survival' ? 'survival' : 'growth'
    return ranked.filter((r) => r.sym.style === 'both' || r.sym.style === want)
  }, [ranked, tab, family])

  const fitCount = rows.filter((r) => r.fit === 'fits').length
  const budget = (c.balance * c.mode.riskPct) / 100

  const tabs: { id: Tab; label: string }[] = [
    { id: 'survival', label: 'Survival picks' },
    { id: 'grow', label: 'Grow-fast picks' },
    { id: 'all', label: 'All' },
  ]

  return (
    <section className="space-y-4">
      {/* Recommendations for this balance */}
      <div className="p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">
            Recommended for {formatUSD(c.balance)} in {c.mode.label} mode
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Risk budget per trade: {formatUSD(budget)} ({c.mode.riskPct}% of balance).
        </p>

        {!anyFit && (
          <div className="flex gap-2 p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              No index fits {formatUSD(c.balance)} at {c.mode.riskPct}% risk with a typical stop. These are the closest.
              To trade one properly you can add funds, use a much tighter stop, or accept higher risk per trade.
              Higher risk is more likely to wipe a small account.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {picks.map((r, idx) => (
            <PickCard key={r.sym.id} rec={r} rank={idx + 1} active={r.sym.id === c.symbol.id} onUse={() => c.selectSymbol(r.sym.id)} />
          ))}
        </div>
      </div>

      {/* Browse */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className={labelCls}>Browse symbols</label>
          <span className="text-[11px] text-zinc-400">{fitCount} fit · {rows.length} shown</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                tab === t.id
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'all' && (
          <div className="flex flex-wrap gap-1.5">
            {FAMILIES.map((f) => (
              <button
                key={f.id}
                onClick={() => setFamily(f.id)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
                  family === f.id
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {tab !== 'all' && (
          <p className="text-[11px] text-zinc-400">
            {tab === 'survival'
              ? `Calm, low-spike symbols. Best-fitting for ${formatUSD(c.balance)} first.`
              : `Faster, bigger-move symbols. Best-fitting for ${formatUSD(c.balance)} first. Spike symbols can jump past a stop.`}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[28rem] overflow-y-auto pr-1">
          {rows.map((r) => {
            const active = r.sym.id === c.symbol.id
            return (
              <motion.button
                key={r.sym.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => c.selectSymbol(r.sym.id)}
                className={`text-left p-3 rounded-2xl border transition-all ${
                  active
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium text-sm truncate">{r.sym.name}</span>
                  <Direction cat={r.sym.category} />
                  {r.sym.spike === 'frequent' && <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-label="Frequent spikes" />}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${FIT_BADGE[r.fit].cls}`}>{FIT_BADGE[r.fit].label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${VOL_PILL[r.sym.volatility]}`}>{r.sym.volatility}</span>
                </div>
                <p className="mt-1.5 text-[10px] text-zinc-400 tabular-nums">
                  min {r.sym.minLot}{r.sym.verified ? '' : '*'} · SL ≤ {fmtNum(r.affordableSL)}
                </p>
              </motion.button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={c.symbol.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1"
          >
            <p className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong className="text-zinc-700 dark:text-zinc-300">{c.symbol.name}:</strong> {c.symbol.description}
                {!c.symbol.verified && ' * Min lot is a best guess. Confirm on Deriv.'}
              </span>
            </p>
            <p className="pl-5 tabular-nums">
              Min balance for {c.mode.label} mode ≈ {formatUSD(c.minBalance)} ·{' '}
              {MODES[c.modeId].riskPct}% of your balance buys a stop of up to {fmtNum(c.fit.affordableSL)} points at min lot.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function PickCard({ rec, rank, active, onUse }: { rec: Rec; rank: number; active: boolean; onUse: () => void }) {
  return (
    <div className={`p-3 rounded-xl border bg-white dark:bg-zinc-900 flex flex-col gap-2 ${active ? 'border-emerald-500' : 'border-zinc-200 dark:border-zinc-800'}`}>
      <div className="flex items-center justify-between gap-1">
        <span className="font-medium text-sm truncate">
          <span className="text-zinc-400 mr-1">#{rank}</span>{rec.sym.name}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${FIT_BADGE[rec.fit].cls}`}>{FIT_BADGE[rec.fit].label}</span>
      </div>
      <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 leading-snug">
        {rec.reasons.map((t) => <li key={t}>· {t}</li>)}
      </ul>
      <button
        onClick={onUse}
        className="mt-auto text-xs font-medium py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
      >
        {active ? 'Selected' : 'Use this'}
      </button>
    </div>
  )
}
