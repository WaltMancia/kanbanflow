import {
    LayoutDashboard,
    FolderKanban,
    Users,
    LogOut,
    KanbanSquare,
    Bell,
    Menu,
    X,
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuthStore }
    from "../store/authStore";

import GlobalSearch
    from "../features/search/components/GlobalSearch";

import CommandPalette
    from "../features/command-palette/components/CommandPalette";

import {
    useCommandPalette,
} from "../features/command-palette/hooks/useCommandPalette";

export default function AppLayout ({
    children,
}: {
    children: React.ReactNode;
}) {

    const logout =
        useAuthStore(
            (state) => state.logout
        );

    const user =
        useAuthStore(
            (state) => state.user
        );

    const {
        open,
        setOpen,
    } = useCommandPalette();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen bg-background text-white flex">

                {/* SIDEBAR */}

                <aside className="w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl hidden lg:flex flex-col shrink-0">

                    <div className="px-8 py-10 border-b border-white/10">
                        <h1 className="text-3xl font-black tracking-tight">
                            KanbanFlow
                        </h1>

                        <p className="mt-2 text-slate-400">
                            Enterprise Workspace
                        </p>
                    </div>

                    <nav className="flex-1 p-5 space-y-2">

                        <SidebarItem
                            to="/"
                            icon={
                                <LayoutDashboard size={ 20 } />
                            }
                            label="Dashboard"
                        />

                        <SidebarItem
                            to="/teams"
                            icon={
                                <Users size={ 20 } />
                            }
                            label="Teams"
                        />

                        <SidebarItem
                            to="/projects"
                            icon={
                                <FolderKanban size={ 20 } />
                            }
                            label="Projects"
                        />

                        <SidebarItem
                            to="/kanban"
                            icon={
                                <KanbanSquare size={ 20 } />
                            }
                            label="Kanban"
                        />
                    </nav>

                    <div className="p-5 border-t border-white/10">

                        <div className="flex items-center gap-4 mb-5">

                            <div
                                className="
                                    w-12
                                    h-12
                                    rounded-2xl
                                    bg-blue-500/20
                                    flex
                                    items-center
                                    justify-center
                                    text-blue-400
                                    font-bold
                                "
                            >
                                { user?.name?.charAt(0) }
                            </div>

                            <div>
                                <p className="font-semibold">
                                    { user?.name }
                                </p>

                                <p className="text-sm text-slate-400">
                                    { user?.email }
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={ logout }
                            className="
                                w-full
                                flex
                                items-center
                                justify-center
                                gap-3
                                rounded-2xl
                                bg-red-500/15
                                hover:bg-red-500/25
                                transition
                                px-5
                                py-3
                                text-red-300
                            "
                        >
                            <LogOut size={ 18 } />
                            Logout
                        </button>

                    </div>
                </aside>

                {/* MAIN */ }

                <div className="flex-1 flex flex-col">

                    {/* HEADER */ }

                    <header
                        className="
                            h-20
                            border-b
                            border-white/10
                            bg-slate-950/80
                            backdrop-blur-xl
                            sticky
                            top-0
                            z-30
                        "
                    >
                        <div className="h-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">

                                <button
                                    onClick={ () =>
                                        setMobileMenuOpen(true)
                                    }
                                    className="
                                        p-2.5
                                        rounded-xl
                                        border
                                        border-white/10
                                        text-slate-400
                                        hover:text-white
                                        lg:hidden
                                        shrink-0
                                    "
                                >
                                    <Menu size={ 18 } />
                                </button>

                                <GlobalSearch />

                                <button
                                    onClick={ () =>
                                        setOpen(true)
                                    }
                                    className="
                                        px-3
                                        py-2
                                        rounded-xl
                                        border
                                        border-white/10
                                        text-sm
                                        text-slate-400
                                        hidden
                                        md:block
                                        shrink-0
                                    "
                                >
                                    Ctrl + K
                                </button>

                            </div>

                            <button
                                className="
                                    relative
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-slate-900
                                    border
                                    border-white/10
                                    flex
                                    items-center
                                    justify-center
                                    shrink-0
                                "
                            >
                                <Bell size={ 18 } />

                                <span
                                    className="
                                        absolute
                                        top-2
                                        right-2
                                        w-2
                                        h-2
                                        bg-red-500
                                        rounded-full
                                    "
                                />
                            </button>

                        </div>
                    </header>

                    {/* CONTENT */ }

                    <main
                        className="
                            flex-1
                            overflow-auto
                            p-4
                            sm:p-6
                            md:p-8
                        "
                    >
                        { children }
                    </main>

                </div>

            </div>

            {/* MOBILE SIDEBAR DRAWER */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Sidebar Drawer */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-white/10 flex flex-col z-50"
                        >
                            <div className="px-8 py-10 border-b border-white/10 flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">
                                        KanbanFlow
                                    </h1>
                                    <p className="mt-2 text-slate-400 text-sm">
                                        Enterprise Workspace
                                    </p>
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <nav className="flex-1 p-5 space-y-2">
                                <SidebarItem
                                    to="/"
                                    icon={<LayoutDashboard size={20} />}
                                    label="Dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                                <SidebarItem
                                    to="/teams"
                                    icon={<Users size={20} />}
                                    label="Teams"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                                <SidebarItem
                                    to="/projects"
                                    icon={<FolderKanban size={20} />}
                                    label="Projects"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                                <SidebarItem
                                    to="/kanban"
                                    icon={<KanbanSquare size={20} />}
                                    label="Kanban"
                                    onClick={() => setMobileMenuOpen(false)}
                                />
                            </nav>

                            <div className="p-5 border-t border-white/10 bg-slate-950/40">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user?.name}</p>
                                        <p className="text-sm text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 transition px-5 py-3 text-red-300"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            <CommandPalette
                open={ open }
                onClose={ () =>
                    setOpen(false)
                }
            />
        </>
    );
}

function SidebarItem ({
    to,
    icon,
    label,
    onClick,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
}) {
    return (
        <NavLink
            to={ to }
            onClick={ onClick }
            className={ ({ isActive }) =>
                `
                group
                flex
                items-center
                gap-4
                rounded-2xl
                px-5
                py-4
                transition-all
                duration-300
                ${isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }
            `
            }
        >
            { icon }

            <span className="font-medium">
                { label }
            </span>
        </NavLink>
    );
}