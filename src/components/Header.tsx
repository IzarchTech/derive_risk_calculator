import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Moon, Sun } from "lucide-react";

type Props = { dark: boolean; onToggle: () => void };

export default function Header({ dark, onToggle }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-semibold text-sm sm:text-base leading-tight">
              Deriv Risk Calculator
            </h1>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Survive first. Grow second.
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4 text-amber-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4 text-zinc-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
