import { motion } from 'framer-motion'
import { AlertTriangle, Rocket, Shield } from 'lucide-react'
import { MODE_LIST } from '../data/modes'
import { labelCls } from '../lib/ui'
import type { Calculator } from '../hooks/useCalculator'

export default function ModeSelector({ c }: { c: Calculator }) {
  return (
    <section className="space-y-3">
      <label className={labelCls}>Trading mode</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MODE_LIST.map((m) => {
          const active = m.id === c.modeId
          const Icon = m.id === 'survival' ? Shield : Rocket
          const accent = m.id === 'survival'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
            : 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => c.selectMode(m.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                active ? accent : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${m.id === 'survival' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`} />
                <span className="font-semibold text-sm">{m.label}</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{m.tagline}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] tabular-nums">
                <div><p className="text-zinc-400">Risk / trade</p><p className="font-medium">{m.riskPct}% (max {m.maxRiskPct}%)</p></div>
                <div><p className="text-zinc-400">Min R:R</p><p className="font-medium">1:{m.minRR}</p></div>
                <div><p className="text-zinc-400">Daily stop</p><p className="font-medium">{m.dailyLossPct}% / {m.maxTradesPerDay} trades</p></div>
              </div>
            </motion.button>
          )
        })}
      </div>
      {c.modeId === 'grow' && (
        <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Higher risk per trade means faster growth and faster losses. A short losing streak can cut the account sharply.
        </p>
      )}
    </section>
  )
}
