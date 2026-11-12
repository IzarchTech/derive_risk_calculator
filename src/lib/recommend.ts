import type { Fit, Mode, SymbolInfo } from '../types'
import { fitFor, minLotRiskUSD, recommendedBalance } from './calc'
import { formatUSD } from './format'

export type Rec = {
  sym: SymbolInfo
  fit: Fit
  ratio: number
  affordableSL: number
  styleMatch: boolean
  minBalance: number
  reasons: string[]
}

const fitRank: Record<Fit, number> = { fits: 0, stretch: 1, 'too-big': 2 }
const spikeRank = { none: 0, rare: 1, frequent: 2 } as const
const volRank = { low: 0, medium: 1, high: 2 } as const

const matchesMode = (sym: SymbolInfo, mode: Mode) =>
  sym.style === 'both' || sym.style === (mode.id === 'survival' ? 'survival' : 'growth')

/**
 * Rank every symbol for this balance and mode.
 * Order: affordability first, then style match, then:
 *  - Survival: fewer spikes, then calmer volatility
 *  - Grow fast: higher volatility (bigger moves per trade)
 * Ties break on how much headroom the balance leaves (ratio).
 */
export function rankSymbols(symbols: SymbolInfo[], balance: number, mode: Mode): Rec[] {
  const recs: Rec[] = symbols.map((sym) => {
    const f = fitFor(sym, balance, mode.riskPct)
    const styleMatch = matchesMode(sym, mode)
    const minRisk = minLotRiskUSD(sym)
    const reasons: string[] = []

    if (f.fit === 'fits') {
      reasons.push(`Min lot risks about ${formatUSD(minRisk)} at a typical stop, within your ${mode.riskPct}% budget.`)
    } else if (f.fit === 'stretch') {
      reasons.push(`Works only with a tighter stop than usual (max ${f.affordableSL.toFixed(f.affordableSL < 1 ? 3 : 1)} points).`)
    } else {
      reasons.push(`Min lot is too large for ${formatUSD(balance)}. Needs about ${formatUSD(recommendedBalance(sym, mode.riskPct))}.`)
    }
    if (sym.spike === 'none') reasons.push('No spikes or gaps against your stop.')
    if (sym.spike === 'frequent') reasons.push('Frequent spikes can jump past a stop.')
    if (!sym.verified) reasons.push('Min lot unconfirmed. Check on Deriv.')

    return {
      sym, fit: f.fit, ratio: f.ratio, affordableSL: f.affordableSL, styleMatch,
      minBalance: recommendedBalance(sym, mode.riskPct), reasons,
    }
  })

  return recs.sort((a, b) => {
    if (fitRank[a.fit] !== fitRank[b.fit]) return fitRank[a.fit] - fitRank[b.fit]
    if (a.styleMatch !== b.styleMatch) return a.styleMatch ? -1 : 1
    // Spikes can jump past a stop, so fewer spikes ranks higher in BOTH modes.
    const sp = spikeRank[a.sym.spike] - spikeRank[b.sym.spike]
    if (sp) return sp
    const v = mode.id === 'survival'
      ? volRank[a.sym.volatility] - volRank[b.sym.volatility]
      : volRank[b.sym.volatility] - volRank[a.sym.volatility]
    if (v) return v
    return b.ratio - a.ratio
  })
}

/** Top picks for the balance. If nothing is affordable, returns the closest options instead. */
export function topPicks(ranked: Rec[], n = 3) {
  // One pick per family so the top picks give real choice, not three near-identical indices.
  const onePerFamily = (list: Rec[]) => {
    const seen = new Set<string>()
    return list.filter((r) => (seen.has(r.sym.category) ? false : (seen.add(r.sym.category), true))).slice(0, n)
  }
  const usable = ranked.filter((r) => r.fit !== 'too-big' && r.styleMatch)
  if (usable.length > 0) return { picks: onePerFamily(usable), anyFit: true as const }
  const closest = [...ranked].filter((r) => r.styleMatch).sort((a, b) => a.minBalance - b.minBalance)
  return { picks: onePerFamily(closest), anyFit: false as const }
}
