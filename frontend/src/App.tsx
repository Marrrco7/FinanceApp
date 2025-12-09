import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionPage";
import AccountsPage from "./pages/AccountPage";
import CategoriesPage from "./pages/CategoriesPage";

function App() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                <div className="px-6 py-4 border-b border-slate-800">
                    <h1 className="text-xl font-semibold tracking-tight">FinanceApp</h1>
                    <p className="text-xs text-slate-400">Personal finance dashboard</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 text-sm">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg transition-all ${
                                isActive
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/transactions"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg transition-all ${
                                isActive
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        Transactions
                    </NavLink>

                    <NavLink
                        to="/accounts"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg transition-all ${
                                isActive
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        Accounts
                    </NavLink>

                    <NavLink
                        to="/categories"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg transition-all ${
                                isActive
                                    ? "bg-slate-800 text-slate-100"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                            }`
                        }
                    >
                        Categories
                    </NavLink>

                    <button
                        className="block px-3 py-2 rounded-lg text-slate-500 cursor-not-allowed"
                        disabled
                    >
                        Budgets (soon)
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
                    Logged in as <span className="text-slate-300">demo@user</span>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-4 md:p-6">
                    <AnimatePresence mode="wait" initial={false}>
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/transactions" element={<TransactionsPage />} />
                            <Route path="/accounts" element={<AccountsPage />} />
                            <Route path="/categories" element={<CategoriesPage />} />
                        </Routes>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default App;
