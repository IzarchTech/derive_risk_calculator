import { motion } from 'framer-motion'
import { BarChart3, Lock, Shield, Target } from 'lucide-react'
import { fmtPrice, formatUSD } from '../lib/format'
import type { Calculator } from '../hooks/useCalculator'

const pnlCls = (n: number) =>
  n >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'

export default function ResultsPanel({ c }: { c: Calculator }) {
  const { calc, mode, symbol } = c
  const critical = calc.riskPct > mode.maxRiskPct
  const high = calc.riskPct > mode.riskPct
  const { sim } = calc

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <motion.div
          layout
          className={`p-5 rounded-2xl border ${
            critical
              ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-700'
              : high
                ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
          }`}
        >
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-3">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Risk (initial SL hit)</span>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-rose-600 dark:text-rose-400">{formatUSD(calc.riskUSD)}</p>
          <p className={`mt-1 text-sm font-medium tabular-nums ${critical ? 'text-rose-600 dark:text-rose-400' : high ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500'}`}>
            {calc.riskPct.toFixed(1)}% of balance
            {critical && ' · Over your limit'}
            {high && !critical && ' · Above target'}
          </p>
        </motion.div>

        <motion.div layout className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-3">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Profit (TP hit)</span>
          </div>
          <p className="text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">{formatUSD(calc.profitUSD)}</p>
          <p className="mt-1 text-sm text-zinc-500 tabular-nums">R:R = 1 : {calc.rr.toFixed(2)}</p>
        </motion.div>

        {c.trailing && (
          <motion.div layout className="sm:col-span-2 p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mb-3">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Trailing result at best price {fmtPrice(c.peak)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div><p className="text-[11px] text-zinc-400">Trailing active?</p><p className="font-medium">{sim.active ? 'Yes' : 'Not yet'}</p></div>
              <div><p className="text-[11px] text-zinc-400">{sim.tpHit ? 'Exit (TP)' : 'Current stop'}</p><p className="font-medium tabular-nums">{fmtPrice(sim.exit)}</p></div>
              <div>
                <p className="text-[11px] text-zinc-400">{sim.tpHit ? 'Profit' : 'P/L if stopped out'}</p>
                <p className={`font-semibold tabular-nums ${pnlCls(sim.pnl)}`}>{sim.pnl >= 0 ? '+' : ''}{formatUSD(sim.pnl)}</p>
              </div>
              <div><p className="text-[11px] text-zinc-400">Worst case (never activates)</p><p className="font-semibold tabular-nums text-rose-600 dark:text-rose-400">{formatUSD(-calc.riskUSD)}</p></div>
            </div>
            <div className="mt-4 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-0.5 tabular-nums">
              <p>Stop reaches breakeven when price hits {fmtPrice(calc.breakevenPeak)}.</p>
              <p>Profit starts locking beyond {fmtPrice(calc.lockPeak)}.</p>
            </div>
            {calc.tpValid && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs tabular-nums">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="py-1 pr-3 font-medium">Price travels</th>
                      <th className="py-1 pr-3 font-medium">Best price</th>
                      <th className="py-1 pr-3 font-medium">Stop at</th>
                      <th className="py-1 font-medium text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.scenarios.map((sc) => (
                      <tr key={sc.f} className="border-t border-emerald-200/70 dark:border-emerald-900/60">
                        <td className="py-1.5 pr-3">{Math.round(sc.f * 100)}% to TP</td>
                        <td className="py-1.5 pr-3">{fmtPrice(sc.price)}</td>
                        <td className="py-1.5 pr-3">{fmtPrice(sc.exit)}{sc.tpHit ? ' (TP)' : ''}</td>
                        <td className={`py-1.5 text-right font-medium ${pnlCls(sc.pnl)}`}>{sc.pnl >= 0 ? '+' : ''}{formatUSD(sc.pnl)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-[10px] text-zinc-400">Results assume price reaches that best price, then reverses into the trailing stop.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Quick summary</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><p className="text-[11px] text-zinc-400">$ / 1.00 move</p><p className="font-medium tabular-nums">{formatUSD(calc.dollarPerPoint)}</p></div>
          <div><p className="text-[11px] text-zinc-400">Direction</p><p className="font-medium capitalize">{c.direction}</p></div>
          <div><p className="text-[11px] text-zinc-400">Min / Max lot</p><p className="font-medium tabular-nums">{symbol.minLot} / {symbol.maxLot ?? 'n/a'}</p></div>
          <div><p className="text-[11px] text-zinc-400">Est. margin*</p><p className="font-medium tabular-nums">{formatUSD(calc.marginEstimate)}</p></div>
        </div>
        <p className="text-[10px] text-zinc-400">*Rough educational estimate. Real margin depends on leverage and platform.</p>
      </div>
    </section>
  )
}
