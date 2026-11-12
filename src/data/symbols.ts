import type { Family, Level, SpikeRisk, Style, SymbolInfo } from '../types'

export const FAMILIES: { id: Family | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'volatility', label: 'Volatility' },
  { id: 'boom', label: 'Boom' },
  { id: 'crash', label: 'Crash' },
  { id: 'jump', label: 'Jump' },
  { id: 'step', label: 'Step' },
  { id: 'multistep', label: 'Multi Step' },
  { id: 'range', label: 'Range Break' },
  { id: 'drift', label: 'Drift Switch' },
  { id: 'vob', label: 'Vol/Boom' },
  { id: 'voc', label: 'Vol/Crash' },
  { id: 'dex', label: 'DEX' },
]

// Contract size is 1 for every synthetic index, so $/point at 1 lot = 1.
// Min lots are from Deriv-related sources; `verified: false` means best guess.
// `typicalSL` values are rough starting points, not Deriv data. Edit to taste.
const mk = (
  id: string, name: string, category: Family,
  minLot: number, maxLot: number | undefined, typicalSL: number,
  volatility: Level, verified: boolean, style: Style, spike: SpikeRisk,
  description: string
): SymbolInfo => ({
  id, name, category, minLot, maxLot, dollarPerPointAt1Lot: 1, typicalSL,
  volatility, verified, style, spike, description,
})

export const SYMBOLS: SymbolInfo[] = [
  // ---- Volatility ----
  mk('V10', 'Volatility 10 Index', 'volatility', 0.5, 1280, 30, 'low', true, 'survival', 'none', 'Calmest constant volatility. No spikes.'),
  mk('V10_1s', 'Volatility 10 (1s)', 'volatility', 0.5, 810, 30, 'low', true, 'survival', 'none', '1-second tick version of V10.'),
  mk('V25', 'Volatility 25 Index', 'volatility', 0.5, 1000, 60, 'medium', true, 'survival', 'none', 'Moderate volatility. Balanced risk/reward.'),
  mk('V25_1s', 'Volatility 25 (1s)', 'volatility', 0.005, 4, 3000, 'medium', true, 'both', 'none', 'Very small min lot (0.005) lets tiny accounts size down.'),
  mk('V30_1s', 'Volatility 30 (1s)', 'volatility', 1, undefined, 60, 'medium', false, 'both', 'none', '1s tick, 30% volatility.'),
  mk('V50', 'Volatility 50 Index', 'volatility', 4, 12000, 5, 'high', true, 'growth', 'none', 'Min lot 4.00 makes it expensive for small accounts.'),
  mk('V50_1s', 'Volatility 50 (1s)', 'volatility', 1, undefined, 60, 'high', false, 'growth', 'none', '1s tick, 50% volatility.'),
  mk('V75', 'Volatility 75 Index', 'volatility', 0.01, 50, 1500, 'high', true, 'growth', 'none', 'Most popular. Fast moves, min lot 0.01.'),
  mk('V75_1s', 'Volatility 75 (1s)', 'volatility', 0.05, 240, 300, 'high', true, 'growth', 'none', '1s version of V75. Popular with scalpers.'),
  mk('V90_1s', 'Volatility 90 (1s)', 'volatility', 1, undefined, 60, 'high', false, 'growth', 'none', '1s tick, 90% volatility.'),
  mk('V100', 'Volatility 100 Index', 'volatility', 1, 1000, 20, 'high', true, 'growth', 'none', 'Extreme volatility. Experienced traders only.'),
  mk('V100_1s', 'Volatility 100 (1s)', 'volatility', 1, undefined, 60, 'high', false, 'growth', 'none', '1s tick, 100% volatility.'),
  mk('V150_1s', 'Volatility 150 (1s)', 'volatility', 1, undefined, 60, 'high', false, 'growth', 'none', '1s tick, 150% volatility.'),
  mk('V250_1s', 'Volatility 250 (1s)', 'volatility', 10, undefined, 3, 'high', true, 'growth', 'none', 'Highest volatility. Min lot 10 but price is low.'),

  // ---- Boom ----
  mk('Boom50', 'Boom 50 Index', 'boom', 0.1, 200, 20, 'high', true, 'growth', 'frequent', 'Very frequent upward spikes (~1/50 ticks).'),
  mk('Boom150', 'Boom 150 Index', 'boom', 0.2, undefined, 40, 'high', false, 'growth', 'frequent', 'Frequent upward spikes (~1/150 ticks).'),
  mk('Boom300', 'Boom 300 Index', 'boom', 0.5, 1000, 50, 'medium', true, 'growth', 'frequent', 'Upward spike ~1/300 ticks. Min lot varies by source.'),
  mk('Boom500', 'Boom 500 Index', 'boom', 0.2, 500, 80, 'medium', true, 'growth', 'rare', 'Drifts down, upward spike ~1/500 ticks.'),
  mk('Boom600', 'Boom 600 Index', 'boom', 0.2, 470, 100, 'medium', true, 'growth', 'rare', 'Drifts down, upward spike ~1/600 ticks.'),
  mk('Boom900', 'Boom 900 Index', 'boom', 0.2, 340, 120, 'low', true, 'growth', 'rare', 'Drifts down, upward spike ~1/900 ticks.'),
  mk('Boom1000', 'Boom 1000 Index', 'boom', 0.2, 250, 150, 'low', true, 'growth', 'rare', 'Drifts down, strong upward spikes ~1/1000 ticks.'),

  // ---- Crash ----
  mk('Crash50', 'Crash 50 Index', 'crash', 0.1, undefined, 20, 'high', false, 'growth', 'frequent', 'Very frequent downward spikes (~1/50 ticks).'),
  mk('Crash150', 'Crash 150 Index', 'crash', 0.2, undefined, 40, 'high', false, 'growth', 'frequent', 'Frequent downward spikes (~1/150 ticks).'),
  mk('Crash300', 'Crash 300 Index', 'crash', 0.5, undefined, 50, 'medium', true, 'growth', 'frequent', 'Downward spike ~1/300 ticks. Min lot varies by source.'),
  mk('Crash500', 'Crash 500 Index', 'crash', 0.2, 730, 80, 'medium', true, 'growth', 'rare', 'Drifts up, downward spike ~1/500 ticks.'),
  mk('Crash600', 'Crash 600 Index', 'crash', 0.2, undefined, 100, 'medium', true, 'growth', 'rare', 'Drifts up, downward spike ~1/600 ticks.'),
  mk('Crash900', 'Crash 900 Index', 'crash', 0.2, undefined, 120, 'low', true, 'growth', 'rare', 'Drifts up, downward spike ~1/900 ticks.'),
  mk('Crash1000', 'Crash 1000 Index', 'crash', 0.2, 720, 150, 'low', true, 'growth', 'rare', 'Drifts up, sharp downward crashes ~1/1000 ticks.'),

  // ---- Jump ----
  mk('Jump10', 'Jump 10 Index', 'jump', 0.01, 50, 2000, 'low', true, 'both', 'rare', 'Low volatility with random jumps.'),
  mk('Jump25', 'Jump 25 Index', 'jump', 0.01, 50, 2000, 'medium', true, 'both', 'rare', 'Moderate volatility with random jumps.'),
  mk('Jump50', 'Jump 50 Index', 'jump', 0.01, 50, 2000, 'medium', true, 'growth', 'rare', 'Higher volatility with random jumps.'),
  mk('Jump75', 'Jump 75 Index', 'jump', 0.01, 50, 2000, 'high', true, 'growth', 'rare', 'High volatility with random jumps.'),
  mk('Jump100', 'Jump 100 Index', 'jump', 0.01, 50, 2000, 'high', true, 'growth', 'rare', 'Highest volatility jump index.'),

  // ---- Step ----
  mk('Step100', 'Step Index', 'step', 0.1, 200, 10, 'low', true, 'survival', 'none', 'Moves in fixed 0.1 steps. Smooth, no spikes.'),
  mk('Step200', 'Step 200 Index', 'step', 0.1, undefined, 20, 'low', true, 'survival', 'none', 'Fixed 0.2 steps.'),
  mk('Step300', 'Step 300 Index', 'step', 0.1, undefined, 30, 'low', true, 'survival', 'none', 'Fixed 0.3 steps.'),
  mk('Step400', 'Step 400 Index', 'step', 0.1, undefined, 40, 'low', true, 'survival', 'none', 'Fixed 0.4 steps.'),
  mk('Step500', 'Step 500 Index', 'step', 0.1, undefined, 50, 'low', true, 'survival', 'none', 'Fixed 0.5 steps.'),

  // ---- Multi Step ----
  mk('MultiStep2', 'Multi Step 2 Index', 'multistep', 0.1, undefined, 10, 'low', false, 'survival', 'none', 'Steps of 0.1 and 0.2 combined.'),
  mk('MultiStep3', 'Multi Step 3 Index', 'multistep', 0.1, undefined, 10, 'low', false, 'survival', 'none', 'Steps of 0.1 to 0.3 combined.'),
  mk('MultiStep4', 'Multi Step 4 Index', 'multistep', 0.1, undefined, 10, 'low', false, 'survival', 'none', 'Steps of 0.1 to 0.4 combined.'),

  // ---- Range Break ----
  mk('RB100', 'Range Break 100', 'range', 0.01, 50, 2000, 'medium', true, 'growth', 'rare', 'Ranges that periodically break out.'),
  mk('RB200', 'Range Break 200', 'range', 0.01, 50, 2000, 'low', true, 'both', 'rare', 'Longer ranges, rarer breakouts.'),

  // ---- Drift Switch ----
  mk('DS10', 'Drift Switch 10', 'drift', 0.01, undefined, 1000, 'low', true, 'survival', 'none', 'Switches between up, down and sideways drift.'),
  mk('DS20', 'Drift Switch 20', 'drift', 0.01, undefined, 1000, 'medium', true, 'both', 'none', 'Switches drift regimes, medium volatility.'),
  mk('DS30', 'Drift Switch 30', 'drift', 0.01, undefined, 1000, 'medium', true, 'growth', 'none', 'Switches drift regimes, higher volatility.'),

  // ---- Volatility over Boom / Crash ----
  mk('VoB400', 'Vol over Boom 400', 'vob', 0.1, 60, 300, 'medium', true, 'growth', 'rare', 'Volatility index with boom spikes ~1/400.'),
  mk('VoB550', 'Vol over Boom 550', 'vob', 0.1, 75, 300, 'medium', true, 'growth', 'rare', 'Volatility index with boom spikes ~1/550.'),
  mk('VoB750', 'Vol over Boom 750', 'vob', 0.1, 35, 300, 'medium', true, 'growth', 'rare', 'Volatility index with boom spikes ~1/750.'),
  mk('VoC400', 'Vol over Crash 400', 'voc', 0.1, 70, 300, 'medium', true, 'growth', 'rare', 'Volatility index with crash spikes ~1/400.'),
  mk('VoC550', 'Vol over Crash 550', 'voc', 0.1, 150, 300, 'medium', true, 'growth', 'rare', 'Volatility index with crash spikes ~1/550.'),
  mk('VoC750', 'Vol over Crash 750', 'voc', 0.1, 40, 300, 'medium', true, 'growth', 'rare', 'Volatility index with crash spikes ~1/750.'),

  // ---- DEX ----
  mk('DEX600UP', 'DEX 600 UP', 'dex', 0.15, undefined, 300, 'medium', false, 'growth', 'rare', 'Upward drift with sharp downward spikes.'),
  mk('DEX600DN', 'DEX 600 DOWN', 'dex', 0.15, undefined, 300, 'medium', false, 'growth', 'rare', 'Downward drift with sharp upward spikes.'),
  mk('DEX900UP', 'DEX 900 UP', 'dex', 0.15, undefined, 300, 'medium', false, 'growth', 'rare', 'Upward drift with sharp downward spikes.'),
  mk('DEX900DN', 'DEX 900 DOWN', 'dex', 0.15, undefined, 300, 'medium', false, 'growth', 'rare', 'Downward drift with sharp upward spikes.'),
  mk('DEX1500UP', 'DEX 1500 UP', 'dex', 0.15, undefined, 300, 'low', false, 'growth', 'rare', 'Upward drift with sharp downward spikes.'),
  mk('DEX1500DN', 'DEX 1500 DOWN', 'dex', 0.15, undefined, 300, 'low', false, 'growth', 'rare', 'Downward drift with sharp upward spikes.'),
]

export const getSymbol = (id: string): SymbolInfo =>
  SYMBOLS.find((s) => s.id === id) ?? SYMBOLS[0]
