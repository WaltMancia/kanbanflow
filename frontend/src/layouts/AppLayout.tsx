import {
    LayoutDashboard,
    FolderKanban,
    Users,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuthStore }
    from "../store/authStore";

import { KanbanSquare }
    from "lucide-react";

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

            <aside className="w-72 bg-surface border-r border-border flex flex-col">
                {/* LOGO */ }

                <div className="p-8 border-b border-border">
                    <h1 className="text-3xl font-bold">
                        KanbanFlow
                    </h1>

                    <p className="text-slate-400 text-sm mt-2">
                        Project Management
                    </p>
                </div>

                {/* NAV */ }

                <nav className="flex-1 p-4 space-y-2">
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

                {/* USER */ }

                <div className="p-4 border-t border-border">
                    <div className="mb-4">
                        <p className="font-semibold">
                            { user?.name }
                        </p>

                        <p className="text-sm text-slate-400">
                            { user?.email }
                        </p>
                    </div>

                    <button
                        onClick={ logout }
                        className="w-full flex items-center gap-2 bg-secondary hover:bg-primary transition rounded-xl px-4 py-3"
                    >
                        <LogOut size={ 18 } />
                        Logout
                    </button>
                </div>
            </aside>

            {/* CONTENT */ }

            <main className="flex-1 p-10 overflow-auto">
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
        flex items-center gap-3 px-4 py-3 rounded-2xl transition
        ${isActive
                    ? "bg-primary"
                    : "hover:bg-secondary"
                }
      `
            }
        >
            { icon }

            <span>{ label }</span>
        </NavLink>
    );
}