import type { Mode, ModeId } from '../types'

export const MODES: Record<ModeId, Mode> = {
  survival: {
    id: 'survival',
    label: 'Survival',
    tagline: 'Protect the account. Stay in the game long enough to learn.',
    riskPct: 1,
    maxRiskPct: 2,
    minRR: 2,
    dailyLossPct: 3,
    maxTradesPerDay: 3,
    rules: [
      'Risk about 1% per trade, never more than 2%.',
      'Only take setups paying at least 1:2.',
      'Stop for the day after a 3% loss or 3 trades.',
      'Prefer calm symbols with no spikes.',
    ],
  },
  grow: {
    id: 'grow',
    label: 'Grow fast',
    tagline: 'Aggressive compounding, with hard limits so one bad day is not the end.',
    riskPct: 3,
    maxRiskPct: 5,
    minRR: 3,
    dailyLossPct: 9,
    maxTradesPerDay: 5,
    rules: [
      'Risk about 3% per trade, never more than 5%.',
      'Only take setups paying at least 1:3.',
      'Stop for the day after a 9% loss or 5 trades.',
      'Move the stop to breakeven or trail it once in profit.',
    ],
  },
}

export const MODE_LIST: Mode[] = [MODES.survival, MODES.grow]
