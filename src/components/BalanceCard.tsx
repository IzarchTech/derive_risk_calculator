import { formatUSD } from '../lib/format'
import { inputCls, labelCls, linkBtnCls } from '../lib/ui'
import type { Calculator } from '../hooks/useCalculator'

const QUICK = [5, 10, 25, 50, 100, 250, 500]

/** Balance drives every recommendation, so it sits above the symbol picker. */
export default function BalanceCard({ c }: { c: Calculator }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={labelCls}>Your account balance ($)</label>
        <button onClick={() => c.setBalance(c.minBalance)} className={linkBtnCls}>
          Use min for this symbol ({formatUSD(c.minBalance)})
        </button>
      </div>
      <input
        type="number"
        min={1}
        step={1}
        value={c.balance}
        onChange={(e) => c.setBalance(Math.max(0, Number(e.target.value)))}
        className={inputCls}
      />
      <div className="flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            onClick={() => c.setBalance(q)}
            className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${
              c.balance === q
                ? 'bg-emerald-500 border-emerald-500 text-white'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500'
            }`}
          >
            ${q}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 cursor-pointer">
        <input
          type="checkbox"
          checked={c.autoBalance}
          onChange={(e) => c.setAutoBalance(e.target.checked)}
          className="accent-emerald-500"
        />
        When I pick a symbol, set balance to its minimum recommended
      </label>
    </section>
  )
}
