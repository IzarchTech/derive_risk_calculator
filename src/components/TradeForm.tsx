import { RefreshCw, TrendingDown, TrendingUp, Wand2 } from 'lucide-react'
import { fmtPrice, formatUSD } from '../lib/format'
import { inputCls, labelCls, linkBtnCls } from '../lib/ui'
import type { Calculator } from '../hooks/useCalculator'

export default function TradeForm({ c }: { c: Calculator }) {
  const { symbol, direction, calc } = c
  const buy = direction === 'buy'

  return (
    <section className="space-y-4">
      <div className="flex rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => c.changeDirection('buy')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            buy ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Buy / Long
        </button>
        <button
          onClick={() => c.changeDirection('sell')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            !buy ? 'bg-rose-500 text-white' : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
          }`}
        >
          <TrendingDown className="w-4 h-4" /> Sell / Short
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between">
            <label className={labelCls}>Lot size</label>
            <div className="flex gap-3">
              <button onClick={c.setMinLot} className={linkBtnCls}><RefreshCw className="w-3 h-3" /> Min lot</button>
              <button onClick={c.setSuggestedLot} className={linkBtnCls}><Wand2 className="w-3 h-3" /> Suggest for my risk</button>
            </div>
          </div>
          <input
            type="number"
            min={symbol.minLot}
            step={symbol.minLot < 0.1 ? 0.001 : 0.01}
            value={c.lot}
            onChange={(e) => c.setLot(Math.max(0, Number(e.target.value)))}
            className={inputCls}
          />
          <p className="text-[11px] text-zinc-400">
            Min {symbol.minLot}{symbol.maxLot !== undefined ? ` · Max ${symbol.maxLot}` : ''} · $ / 1.00 move ≈ {formatUSD(calc.dollarPerPoint)}
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className={labelCls}>Entry price</label>
          <input type="number" step={0.01} value={c.entry} onChange={(e) => c.setEntry(Number(e.target.value))} className={inputCls} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelCls}>Stop Loss (price)</label>
            <button onClick={c.applyTypical} className={linkBtnCls}>Use typical</button>
          </div>
          <input
            type="number"
            step={0.01}
            value={c.sl}
            onChange={(e) => c.setSl(Number(e.target.value))}
            className={`${inputCls} focus:ring-rose-500/40 focus:border-rose-500`}
          />
          <p className={`text-[11px] tabular-nums ${calc.slValid ? 'text-zinc-400' : 'text-rose-500'}`}>
            {calc.slValid ? `${fmtPrice(calc.slDist)} from entry` : `SL must be ${buy ? 'below' : 'above'} entry for a ${direction}`}
          </p>
        </div>

        <div className="space-y-2">
          <label className={labelCls}>Take Profit (price)</label>
          <input type="number" step={0.01} value={c.tp} onChange={(e) => c.setTp(Number(e.target.value))} className={inputCls} />
          <p className={`text-[11px] tabular-nums ${calc.tpValid ? 'text-zinc-400' : 'text-rose-500'}`}>
            {calc.tpValid ? `${fmtPrice(calc.tpDist)} from entry` : `TP must be ${buy ? 'above' : 'below'} entry for a ${direction}`}
          </p>
        </div>
      </div>
    </section>
  )
}
