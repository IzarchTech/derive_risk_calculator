import { useMemo, useState } from 'react'
import { MODES } from '../data/modes'
import { getSymbol } from '../data/symbols'
import { calcTrade, dirSign, fitFor, recommendedBalance, suggestedLot } from '../lib/calc'
import type { Direction, Mode, ModeId, SymbolInfo } from '../types'

const START_SYMBOL = 'Step100'
const START_ENTRY = 8000
const START_BALANCE = 10

export function useCalculator() {
  const [modeId, setModeId] = useState<ModeId>('survival')
  const mode = MODES[modeId]

  const start = getSymbol(START_SYMBOL)
  const [symbolId, setSymbolId] = useState(start.id)
  const [direction, setDirection] = useState<Direction>('buy')
  const [balance, setBalance] = useState(START_BALANCE)
  const [autoBalance, setAutoBalance] = useState(false)
  const [lot, setLot] = useState(start.minLot)

  const [entry, setEntry] = useState(START_ENTRY)
  const [sl, setSl] = useState(START_ENTRY - start.typicalSL)
  const [tp, setTp] = useState(START_ENTRY + start.typicalSL * mode.minRR)

  const [trailing, setTrailing] = useState(false)
  const [trailDistance, setTrailDistance] = useState(start.typicalSL)
  const [trailActivation, setTrailActivation] = useState(0)
  const [peak, setPeak] = useState(START_ENTRY + start.typicalSL * mode.minRR * 0.75)

  const symbol = useMemo(() => getSymbol(symbolId), [symbolId])

  /** Lay out SL, TP, trail and what-if peak from a symbol's typical stop and the mode's min R:R. */
  const layoutStops = (sym: SymbolInfo, d: Direction, m: Mode, e: number) => {
    const k = dirSign(d)
    setSl(e - k * sym.typicalSL)
    setTp(e + k * sym.typicalSL * m.minRR)
    setTrailDistance(sym.typicalSL)
    setPeak(e + k * sym.typicalSL * m.minRR * 0.75)
  }

  const selectSymbol = (id: string) => {
    const next = getSymbol(id)
    setSymbolId(id)
    setLot(next.minLot)
    if (autoBalance) setBalance(recommendedBalance(next, mode.riskPct))
    layoutStops(next, direction, mode, entry)
  }

  const selectMode = (id: ModeId) => {
    setModeId(id)
    layoutStops(symbol, direction, MODES[id], entry)
  }

  const changeDirection = (d: Direction) => {
    if (d === direction) return
    setDirection(d)
    setSl(2 * entry - sl)
    setTp(2 * entry - tp)
    setPeak(2 * entry - peak)
  }

  const applyTypical = () => layoutStops(symbol, direction, mode, entry)
  const setMinLot = () => setLot(symbol.minLot)
  const setSuggestedLot = () =>
    setLot(suggestedLot(symbol, balance, mode.riskPct, Math.abs(entry - sl)))

  const calc = useMemo(
    () => calcTrade({
      symbol, direction, lot, balance, entry, sl, tp,
      trailing, trailDistance, trailActivation, peak,
    }),
    [symbol, direction, lot, balance, entry, sl, tp, trailing, trailDistance, trailActivation, peak]
  )

  const fit = fitFor(symbol, balance, mode.riskPct)
  const minBalance = recommendedBalance(symbol, mode.riskPct)

  return {
    // state
    modeId, mode, symbol, direction, balance, autoBalance, lot,
    entry, sl, tp, trailing, trailDistance, trailActivation, peak,
    // setters
    setBalance, setAutoBalance, setLot, setEntry, setSl, setTp,
    setTrailing, setTrailDistance, setTrailActivation, setPeak,
    // actions
    selectSymbol, selectMode, changeDirection, applyTypical, setMinLot, setSuggestedLot,
    // derived
    calc, fit, minBalance,
  }
}

export type Calculator = ReturnType<typeof useCalculator>
