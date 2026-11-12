import { AnimatePresence, motion } from 'framer-motion'
import { Footprints } from 'lucide-react'
import { fmtPrice } from '../lib/format'
import { cardCls, inputCls, labelCls } from '../lib/ui'
import type { Calculator } from '../hooks/useCalculator'

export default function TrailingPanel({ c }: { c: Calculator }) {
  return (
    <section className={`${cardCls} space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium">Trailing stop</span>
        </div>
        <button
          onClick={() => c.setTrailing(!c.trailing)}
          role="switch"
          aria-checked={c.trailing}
          className={`relative w-11 h-6 rounded-full transition-colors ${c.trailing ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${c.trailing ? 'translate-x-5' : ''}`} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {c.trailing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-2">
                <label className={labelCls}>Trail distance</label>
                <input type="number" min={0} step={0.01} value={c.trailDistance} onChange={(e) => c.setTrailDistance(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="text-[11px] text-zinc-400">Price gap kept behind best price.</p>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Activate after</label>
                <input type="number" min={0} step={0.01} value={c.trailActivation} onChange={(e) => c.setTrailActivation(Math.max(0, Number(e.target.value)))} className={inputCls} />
                <p className="text-[11px] text-zinc-400 tabular-nums">Starts at {fmtPrice(c.calc.trailActivationPrice)} (0 = once in profit).</p>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Best price reached</label>
                <input type="number" step={0.01} value={c.peak} onChange={(e) => c.setPeak(Number(e.target.value))} className={inputCls} />
                <p className={`text-[11px] ${c.calc.peakValid ? 'text-zinc-400' : 'text-rose-500'}`}>
                  {c.calc.peakValid ? 'What-if: furthest price in your favour.' : 'Must be in profit direction from entry.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-[11px] text-zinc-400 leading-relaxed">
        The stop only moves in your favour and never moves back. Take profit still closes the trade if reached.
      </p>
    </section>
  )
}
