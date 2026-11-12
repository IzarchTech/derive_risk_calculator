# Deriv Risk Calculator

An app that calculates **risk** and **profit** for Deriv synthetic indices (Volatility, Boom & Crash) based on lot size, stop-loss points, and take-profit points.

## Features

- Select from popular Volatility, Boom and Crash symbols
- Adjustable lot size (respects min lot per symbol)
- SL / TP in points → instant $ risk & $ profit
- Account balance % risk with visual warnings (High / DANGER)
- Risk : Reward ratio
- Dark / Light theme toggle with smooth transitions
- Fully mobile responsive
- Subtle animations (Framer Motion)
- Educational only – always verify live specs on Deriv

## Quick start

```bash
cd deriv-risk-calculator
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

## Stack

- Vite 6
- React 19 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion (subtle animations)
- Lucide React (icons)

## Notes

- Dollar-per-point values are approximate educational estimates (contract size ≈ 1).
- Real margin, spreads and min volumes can differ by platform, account and region.
- Never risk more than 1–2 % of your balance on a single trade.
