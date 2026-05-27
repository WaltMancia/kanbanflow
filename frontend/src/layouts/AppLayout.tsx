import {
    LayoutDashboard,
    FolderKanban,
    Users,
    LogOut,
    KanbanSquare,
} from "lucide-react";

import { NavLink }
    from "react-router-dom";

import { useAuthStore }
    from "../store/authStore";

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

    return (
        <div className="min-h-screen bg-background text-white flex">
            {/* SIDEBAR */ }

            <aside className="w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl flex flex-col">
                {/* LOGO */ }

                <div className="px-8 py-10 border-b border-white/10">
                    <h1 className="text-3xl font-black tracking-tight">
                        KanbanFlow
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Enterprise Workspace
                    </p>
                </div>

                {/* NAV */ }

                <nav className="flex-1 p-5 space-y-2">
                    <SidebarItem
                        to="/"
                        icon={ <LayoutDashboard size={ 20 } /> }
                        label="Dashboard"
                    />

                    <SidebarItem
                        to="/teams"
                        icon={ <Users size={ 20 } /> }
                        label="Teams"
                    />

                    <SidebarItem
                        to="/projects"
                        icon={ <FolderKanban size={ 20 } /> }
                        label="Projects"
                    />

                    <SidebarItem
                        to="/kanban"
                        icon={ <KanbanSquare size={ 20 } /> }
                        label="Kanban"
                    />
                </nav>

                {/* USER */ }

                <div className="p-5 border-t border-white/10">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
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
                        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 transition px-5 py-3 text-red-300"
                    >
                        <LogOut size={ 18 } />
                        Logout
                    </button>
                </div>
            </aside>

            {/* CONTENT */ }

            <main className="flex-1 overflow-auto p-8">
                { children }
            </main>
        </div>
    );
}

function SidebarItem ({
    to,
    icon,
    label,
}: {
    to: string;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <NavLink
            to={ to }
            className={ ({ isActive }) =>
                `
        group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300
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