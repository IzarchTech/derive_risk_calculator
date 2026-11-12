import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import { planStats, tradeChecks } from "../lib/calc";
import { formatUSD } from "../lib/format";
import { cardCls, labelCls } from "../lib/ui";
import type { Calculator } from "../hooks/useCalculator";

export default function PlanPanel({ c }: Readonly<{ c: Calculator }>) {
  const { mode, calc, symbol, balance } = c;
  const [winRate, setWinRate] = useState(45);

  const checks = useMemo(
    () => tradeChecks(symbol, c.lot, calc, balance, mode),
    [symbol, c.lot, calc, balance, mode],
  );
  const stats = useMemo(
    () => planStats(balance, calc.riskUSD, calc.rr, winRate, mode),
    [balance, calc.riskUSD, calc.rr, winRate, mode],
  );
  const passed = checks.every((x) => x.ok);

  return (
    <section className="space-y-3">
      {/* Pre-trade checklist */}
      <div className={`${cardCls} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">{mode.label} checklist</span>
          </div>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${passed ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"}`}
          >
            {passed ? "All clear" : "Needs attention"}
          </span>
        </div>
        <ul className="space-y-2">
          {checks.map((k) => (
            <li key={k.label} className="flex items-start gap-2 text-xs">
              {k.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span>
                <span className="font-medium">{k.label}</span>
                <span className="block text-zinc-500 dark:text-zinc-400">
                  {k.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Daily limits + expectancy */}
      <div className={`${cardCls} space-y-4`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">
            Daily limits and expectations
          </span>
          <div className="flex items-center gap-2">
            <label className={labelCls}>Win rate</label>
            <input
              type="number"
              min={1}
              max={99}
              value={winRate}
              onChange={(e) =>
                setWinRate(Math.min(99, Math.max(1, Number(e.target.value))))
              }
              className="w-16 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm tabular-nums"
            />
            <span className="text-xs text-zinc-400">%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-[11px] text-zinc-400">Daily loss limit</p>
            <p className="font-medium tabular-nums">
              {formatUSD(stats.dailyLossLimitUSD)}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Losses before you stop</p>
            <p className="font-medium tabular-nums">
              {stats.lossesToLimit} of max {mode.maxTradesPerDay} trades
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Break-even win rate</p>
            <p className="font-medium tabular-nums">
              {stats.breakevenWinRate.toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Expectancy / trade</p>
            <p
              className={`font-medium tabular-nums ${stats.expectancyR >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
            >
              {stats.expectancyR >= 0 ? "+" : ""}
              {stats.expectancyR.toFixed(2)}R
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-[11px] text-zinc-400">After 3 losses in a row</p>
            <p className="font-medium tabular-nums text-rose-600 dark:text-rose-400">
              -{stats.drawdownAfter(3).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">After 5 losses in a row</p>
            <p className="font-medium tabular-nums text-rose-600 dark:text-rose-400">
              -{stats.drawdownAfter(5).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">After 8 losses in a row</p>
            <p className="font-medium tabular-nums text-rose-600 dark:text-rose-400">
              -{stats.drawdownAfter(8).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400">Trades to double</p>
            <p className="font-medium tabular-nums">
              {stats.tradesToDouble ?? "Not at this win rate"}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          These are averages from the numbers you entered, not predictions. Real
          results swing widely, spikes can jump past stops, and fast growth
          carries the same speed of loss. The win rate here is your own
          estimate. Use your actual journal results once you have them.
        </p>
      </div>

      {/* Mode rules */}
      <div className={`${cardCls} space-y-2`}>
        <span className="text-sm font-medium">{mode.label} rules</span>
        <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
          {mode.rules.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
