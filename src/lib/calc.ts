import type { Direction, Fit, Mode, SymbolInfo } from '../types'

export const dirSign = (d: Direction): 1 | -1 => (d === 'buy' ? 1 : -1)

/* -------------------------------------------------------------------------- */
/* Affordability: can this balance trade this symbol within the risk budget?  */
/* -------------------------------------------------------------------------- */

/** $ risked by a min-lot trade using the symbol's typical stop. */
export function minLotRiskUSD(sym: SymbolInfo): number {
  return sym.minLot * sym.dollarPerPointAt1Lot * sym.typicalSL
}

/** Widest stop (price units) a min-lot trade can use without breaching the risk budget. */
export function affordableSL(sym: SymbolInfo, balance: number, riskPct: number): number {
  const perUnit = sym.minLot * sym.dollarPerPointAt1Lot
  return perUnit > 0 ? (balance * (riskPct / 100)) / perUnit : 0
}

/**
 * fits      - a typical stop is affordable at min lot
 * stretch   - only with a tighter-than-typical stop (>= 40% of typical)
 * too-big   - min lot risks far more than the budget allows
 */
export function fitFor(sym: SymbolInfo, balance: number, riskPct: number) {
  const afford = affordableSL(sym, balance, riskPct)
  const ratio = sym.typicalSL > 0 ? afford / sym.typicalSL : 0
  const fit: Fit = ratio >= 1 ? 'fits' : ratio >= 0.4 ? 'stretch' : 'too-big'
  return { fit, ratio, affordableSL: afford }
}

/** Smallest balance (rounded up to $5) where min lot + typical stop stays within the risk %. */
export function recommendedBalance(sym: SymbolInfo, riskPct: number): number {
  return Math.max(5, Math.ceil(minLotRiskUSD(sym) / (riskPct / 100) / 5) * 5)
}

/** Largest lot that keeps risk within budget for a given stop distance, clamped to symbol limits. */
export function suggestedLot(
  sym: SymbolInfo, balance: number, riskPct: number, slDistance: number
): number {
  if (slDistance <= 0) return sym.minLot
  const raw = (balance * (riskPct / 100)) / (slDistance * sym.dollarPerPointAt1Lot)
  const decimals = sym.minLot < 0.1 ? 3 : 2
  const f = 10 ** decimals
  const lot = Math.floor(raw * f + 1e-9) / f
  const capped = sym.maxLot !== undefined ? Math.min(lot, sym.maxLot) : lot
  return Math.max(sym.minLot, capped)
}

/* -------------------------------------------------------------------------- */
/* Trade maths: risk, reward, trailing stop                                   */
/* -------------------------------------------------------------------------- */

export type TradeInputs = {
  symbol: SymbolInfo
  direction: Direction
  lot: number
  balance: number
  entry: number
  sl: number
  tp: number
  trailing: boolean
  trailDistance: number
  trailActivation: number
  peak: number
}

export function calcTrade(i: TradeInputs) {
  const s = dirSign(i.direction)
  const dollarPerPoint = i.symbol.dollarPerPointAt1Lot * i.lot

  const slDist = s * (i.entry - i.sl) // > 0 = stop on the losing side (valid)
  const tpDist = s * (i.tp - i.entry) // > 0 = target on the winning side (valid)
  const slValid = slDist > 0
  const tpValid = tpDist > 0

  const riskUSD = Math.max(0, slDist) * dollarPerPoint
  const profitUSD = Math.max(0, tpDist) * dollarPerPoint
  const rr = riskUSD > 0 ? profitUSD / riskUSD : 0
  const riskPct = i.balance > 0 ? (riskUSD / i.balance) * 100 : 0
  const marginEstimate = riskUSD * 2 // rough educational estimate only

  // Trailing: the stop only moves in your favour. It starts once price has moved
  // `trailActivation` your way, then sits `trailDistance` behind the best price.
  const trailActivationPrice = i.entry + s * i.trailActivation
  const simulate = (peak: number) => {
    const favourable = s * (peak - i.entry)
    const tpHit = tpValid && s * (peak - i.tp) >= 0
    const active = i.trailing && favourable > 0 && favourable >= i.trailActivation
    let stop = i.sl
    if (active) {
      const candidate = peak - s * i.trailDistance
      stop = s === 1 ? Math.max(i.sl, candidate) : Math.min(i.sl, candidate)
    }
    const exit = tpHit ? i.tp : stop
    const pnl = s * (exit - i.entry) * dollarPerPoint
    return { active, stop, exit, pnl, tpHit }
  }

  const breakevenPeak = i.entry + s * i.trailDistance
  const lockPeak = s === 1
    ? Math.max(breakevenPeak, trailActivationPrice)
    : Math.min(breakevenPeak, trailActivationPrice)

  return {
    s, dollarPerPoint, slDist, tpDist, slValid, tpValid,
    riskUSD, profitUSD, rr, riskPct, marginEstimate,
    trailActivationPrice, breakevenPeak, lockPeak,
    sim: simulate(i.peak),
    peakValid: s * (i.peak - i.entry) >= 0,
    scenarios: [0.25, 0.5, 0.75, 1].map((f) => {
      const price = i.entry + s * tpDist * f
      return { f, price, ...simulate(price) }
    }),
  }
}

export type TradeCalc = ReturnType<typeof calcTrade>

/* -------------------------------------------------------------------------- */
/* Plan statistics: expectancy, drawdown, daily limits                        */
/* -------------------------------------------------------------------------- */

export function planStats(
  balance: number, riskUSD: number, rr: number, winRatePct: number, mode: Mode
) {
  const w = winRatePct / 100
  const r = balance > 0 ? Math.min(1, riskUSD / balance) : 0
  const breakevenWinRate = rr > 0 ? 100 / (1 + rr) : 100
  const expectancyR = w * rr - (1 - w) // average result per trade, in units of risk
  const growthPerTrade = r * expectancyR // fraction of balance per trade
  const tradesToDouble = growthPerTrade > 0 ? Math.ceil(Math.LN2 / Math.log(1 + growthPerTrade)) : null
  const dailyLossLimitUSD = (balance * mode.dailyLossPct) / 100
  const lossesToLimit = riskUSD > 0 ? Math.floor(dailyLossLimitUSD / riskUSD) : 0
  const drawdownAfter = (n: number) => (1 - (1 - r) ** n) * 100
  return {
    breakevenWinRate, expectancyR, growthPerTrade, tradesToDouble,
    dailyLossLimitUSD, lossesToLimit, drawdownAfter,
  }
}

/* -------------------------------------------------------------------------- */
/* Pre-trade checklist                                                        */
/* -------------------------------------------------------------------------- */

export type Check = { ok: boolean; label: string; detail: string }

export function tradeChecks(
  sym: SymbolInfo, lot: number, calc: TradeCalc, balance: number, mode: Mode
): Check[] {
  const minLotRisk = sym.minLot * sym.dollarPerPointAt1Lot * Math.max(0, calc.slDist)
  const budget = (balance * mode.riskPct) / 100
  return [
    {
      ok: calc.slValid && calc.tpValid,
      label: 'Stop and target on the right sides',
      detail: calc.slValid && calc.tpValid ? 'Looks consistent.' : 'Fix SL / TP relative to entry.',
    },
    {
      ok: calc.riskPct <= mode.maxRiskPct,
      label: `Risk within ${mode.maxRiskPct}% ceiling`,
      detail: `This trade risks ${calc.riskPct.toFixed(1)}% (target ${mode.riskPct}%).`,
    },
    {
      ok: calc.rr >= mode.minRR,
      label: `Reward at least 1:${mode.minRR}`,
      detail: `Current R:R is 1:${calc.rr.toFixed(2)}.`,
    },
    {
      ok: minLotRisk <= (balance * mode.maxRiskPct) / 100,
      label: 'Min lot is affordable at this stop',
      detail: minLotRisk <= budget
        ? 'Min lot fits the target budget.'
        : `Even at min lot this stop risks ${((minLotRisk / Math.max(balance, 0.01)) * 100).toFixed(1)}%. Tighten the stop or add funds.`,
    },
    {
      ok: lot >= sym.minLot && (sym.maxLot === undefined || lot <= sym.maxLot),
      label: 'Lot within symbol limits',
      detail: `Min ${sym.minLot}${sym.maxLot !== undefined ? `, max ${sym.maxLot}` : ''}.`,
    },
  ]
}
