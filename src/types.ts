export type Family =
  | "volatility"
  | "boom"
  | "crash"
  | "jump"
  | "step"
  | "range"
  | "drift"
  | "vob"
  | "voc"
  | "dex"
  | "multistep";

/** Which trading mode a symbol is best suited to on a small account. */
export type Style = "survival" | "growth" | "both";

/** How exposed a symbol is to sudden spikes / gaps that can jump past a stop. */
export type SpikeRisk = "none" | "rare" | "frequent";

export type Direction = "buy" | "sell";
export type ModeId = "survival" | "grow";
export type Fit = "fits" | "stretch" | "too-big";
export type Level = "low" | "medium" | "high";

export type SymbolInfo = {
  id: string;
  name: string;
  category: Family;
  minLot: number;
  maxLot?: number; // omitted when not known
  dollarPerPointAt1Lot: number; // $ per 1.00 price move at 1.00 lot (contract size 1)
  typicalSL: number; // rough reference stop distance in price units (editable)
  volatility: Level;
  verified: boolean; // false = min lot is a best guess; confirm on Deriv
  style: Style;
  spike: SpikeRisk;
  description: string;
};

export type Mode = {
  id: ModeId;
  label: string;
  tagline: string;
  riskPct: number; // target risk per trade (% of balance)
  maxRiskPct: number; // hard ceiling per trade
  minRR: number; // minimum reward:risk worth taking
  dailyLossPct: number; // stop trading for the day after losing this much
  maxTradesPerDay: number;
  rules: string[];
};
