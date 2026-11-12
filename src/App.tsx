import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useCalculator } from "./hooks/useCalculator";
import Header from "./components/Header";
import ModeSelector from "./components/ModeSelector";
import BalanceCard from "./components/BalanceCard";
import SymbolPicker from "./components/SymbolPicker";
import TradeForm from "./components/TradeForm";
import TrailingPanel from "./components/TrailingPanel";
import ResultsPanel from "./components/ResultsPanel";
import PlanPanel from "./components/PlanPanel";

function App() {
  const [dark, setDark] = useState(true);
  const c = useCalculator();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <Header dark={dark} onToggle={() => setDark((d) => !d)} />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-200"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            Educational tool only. Point values, min lots and margins are
            approximate, and typical stop distances are rough starting points.
            Verify live contract specs on Deriv. Trading synthetic indices
            carries a high risk of losing your whole balance.
          </p>
        </motion.div>

        <ModeSelector c={c} />
        <BalanceCard c={c} />
        <SymbolPicker c={c} />
        <TradeForm c={c} />
        <TrailingPanel c={c} />
        <ResultsPanel c={c} />
        <PlanPanel c={c} />
      </main>

      <footer className="fixed bottom-0 inset-x-0 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md py-2.5">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between text-[11px] text-zinc-400">
          <span>Deriv Risk Calculator · Educational use</span>
          <span className="hidden sm:inline">Not financial advice</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
