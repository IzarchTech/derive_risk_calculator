export function formatUSD(n: number): string {
  if (Math.abs(n) < 0.01 && n !== 0) return `$${n.toFixed(4)}`
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function fmtPrice(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Compact number for distances and lots: 3 decimals under 1, otherwise 2. */
export function fmtNum(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: Math.abs(n) < 1 ? 3 : 2 })
}
