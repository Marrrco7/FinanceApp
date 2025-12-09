import { motion } from "framer-motion";

type SpendingGaugeProps = {
    income: number;
    expenses: number;
    monthLabel: string;
};

export function SpendingGauge({ income, expenses, monthLabel }: SpendingGaugeProps) {
    const size = 220;
    const strokeWidth = 18;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const hasIncome = income > 0;
    const ratio = hasIncome ? expenses / income : 0;
    const clampedRatio = Math.min(Math.max(ratio, 0), 2); // allow up to 200% for display

    let label = "No income data";
    let color = "#38bdf8"; // sky
    if (hasIncome) {
        if (ratio < 0.7) {
            label = "You’re in a healthy range";
            color = "#22c55e"; // emerald
        } else if (ratio <= 1) {
            label = "Getting close to your income";
            color = "#eab308"; // amber
        } else {
            label = "You spent more than you earned";
            color = "#f97373"; // red-ish
        }
    }

    const progressLength = Math.min(clampedRatio, 1) * circumference;
    const dashOffset = circumference - progressLength;

    const net = income - expenses;

    return (
        <motion.section
            className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center shadow-[0_0_40px_rgba(15,23,42,0.6)]"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* Gauge */}
            <div className="relative">
                <svg width={size} height={size} className="rotate-[-90deg]">
                    {/* Background track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                    {/* Progress arc */}
                    {hasIncome && (
                        <motion.circle
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={color}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    )}
                </svg>

                {/* Center labels (not rotated) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        {monthLabel}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Spent</p>
                    <p className="text-2xl font-semibold text-slate-50">
                        {expenses.toFixed(2)} €
                    </p>
                    {hasIncome && (
                        <>
                            <p className="mt-1 text-[10px] text-slate-500">
                                of {income.toFixed(2)} €
                            </p>
                            <p className="mt-2 text-xs text-slate-400">
                                {Math.round(ratio * 100)}% of income
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Side text / details */}
            <div className="flex-1 space-y-3">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                        Monthly overview
                    </p>
                    <h3 className="text-base md:text-lg font-semibold text-slate-50">
                        How this month is going
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        {label}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Income
                        </p>
                        <p className="mt-1 font-mono text-emerald-400 text-sm">
                            {income.toFixed(2)} €
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Expenses
                        </p>
                        <p className="mt-1 font-mono text-rose-400 text-sm">
                            {expenses.toFixed(2)} €
                        </p>
                    </div>
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Net
                        </p>
                        <p
                            className={`mt-1 font-mono text-sm ${
                                net >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                        >
                            {net.toFixed(2)} €
                        </p>
                    </div>
                </div>

                {hasIncome && (
                    <div className="text-[11px] text-slate-500 leading-snug">
                        <span className="inline-block h-2 w-2 rounded-full mr-1 align-middle"
                              style={{ backgroundColor: color }} />
                        <span>
                            {ratio < 0.7 && "You’re comfortably below your income for this month."}
                            {ratio >= 0.7 && ratio <= 1 && "You’re approaching your total income. Keep an eye on big expenses."}
                            {ratio > 1 && "You spent more than you earned. Consider slowing down or increasing income."}
                        </span>
                    </div>
                )}

                {!hasIncome && (
                    <p className="text-[11px] text-slate-500">
                        Add some income transactions to see how your spending compares.
                    </p>
                )}
            </div>
        </motion.section>
    );
}
