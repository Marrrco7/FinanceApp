import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type CategorySummary = {
    categoryId: string | null;
    categoryName: string;
    totalExpenses: number;
};

type CategoryDonutCardProps = {
    categories: CategorySummary[];
    monthLabel: string;
};

const COLORS = [
    "#22c55e", // emerald
    "#38bdf8", // sky
    "#f97316", // orange
    "#a855f7", // purple
    "#eab308", // amber
    "#ec4899", // pink
    "#0ea5e9", // light blue
    "#f97373", // soft red
];

export function CategoryDonutCard({ categories, monthLabel }: CategoryDonutCardProps) {
    const total = categories.reduce((sum, c) => sum + c.totalExpenses, 0);

    if (categories.length === 0 || total === 0) {
        return (
            <motion.section
                className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex items-center justify-center shadow-[0_0_40px_rgba(15,23,42,0.5)]"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
            >
                <p className="text-xs text-slate-500 text-center">
                    No categorized expenses for {monthLabel}. Add some expenses to see a breakdown.
                </p>
            </motion.section>
        );
    }

    // Take top 6, group rest into "Other"
    const sorted = [...categories].sort((a, b) => b.totalExpenses - a.totalExpenses);
    const top = sorted.slice(0, 6);
    const others = sorted.slice(6);
    const otherTotal = others.reduce((sum, c) => sum + c.totalExpenses, 0);

    const data = [
        ...top.map((c) => ({
            name: c.categoryName,
            value: c.totalExpenses,
        })),
        ...(otherTotal > 0
            ? [{
                name: "Other",
                value: otherTotal,
            }]
            : []),
    ];

    return (
        <motion.section
            className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center shadow-[0_0_40px_rgba(15,23,42,0.6)]"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
        >
            <div className="w-full md:w-1/2 h-56 md:h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="55%"
                            outerRadius="80%"
                            paddingAngle={2}
                            stroke="#020617"
                            strokeWidth={2}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#020617",
                                border: "1px solid #1e293b",
                                borderRadius: 12,
                                fontSize: 12,
                            }}
                            formatter={(value: number, name: string) => [
                                `${value.toFixed(2)} €`,
                                name,
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        Total spent
                    </p>
                    <p className="text-lg font-semibold text-slate-50 mt-1">
                        {total.toFixed(2)} €
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        {monthLabel}
                    </p>
                </div>
            </div>

            <div className="flex-1 space-y-3">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                        Category breakdown
                    </p>
                    <h3 className="text-base md:text-lg font-semibold text-slate-50">
                        Where your money goes
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                        The top categories show where most of your spending is concentrated this month.
                    </p>
                </div>

                <div className="space-y-2 text-xs max-h-40 overflow-y-auto pr-1">
                    {data.map((d, idx) => {
                        const percent = (d.value / total) * 100;
                        return (
                            <div key={d.name} className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                                    />
                                    <span className="text-slate-200 truncate max-w-[140px]">
                                        {d.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-slate-100">
                                        {d.value.toFixed(2)} €
                                    </span>
                                    <span className="text-[10px] text-slate-500 w-10 text-right">
                                        {percent.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.section>
    );
}
