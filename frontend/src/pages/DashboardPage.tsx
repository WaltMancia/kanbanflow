import {
    Activity,
    FolderKanban,
    Users,
    CheckCircle2,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from "recharts";

import {
    useEffect,
    useState,
} from "react";

import AppLayout
    from "../layouts/AppLayout";

import { api }
    from "../api/client";

import type { DashboardStats } from "../features/dashboard/types/dashboard";

const COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
];

export default function DashboardPage () {
    const [stats, setStats] =
        useState<DashboardStats | null>(
            null
        );

    async function loadStats () {
        const response =
            await api.get(
                "/dashboard/stats"
            );

        setStats(response.data);
    }

    useEffect(() => {
        loadStats();
    }, []);

    if (!stats) {
        return (
            <AppLayout>
                <div className="text-white">
                    Loading dashboard...
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* HERO */ }

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.25),transparent_35%)]" />

                    <div className="relative z-10">
                        <p className="text-blue-400 font-medium">
                            Productivity Dashboard
                        </p>

                        <h1 className="mt-4 text-5xl font-bold tracking-tight">
                            Welcome back 👋
                        </h1>

                        <p className="mt-4 max-w-2xl text-slate-400 text-lg">
                            Monitor your projects,
                            teams and workflow
                            performance in real time.
                        </p>
                    </div>
                </div>

                {/* STATS */ }

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard
                        icon={ <FolderKanban /> }
                        title="Projects"
                        value={ stats.totalProjects }
                    />

                    <StatCard
                        icon={ <Users /> }
                        title="Teams"
                        value={ stats.totalTeams }
                    />

                    <StatCard
                        icon={ <Activity /> }
                        title="Tasks"
                        value={ stats.totalTasks }
                    />

                    <StatCard
                        icon={ <CheckCircle2 /> }
                        title="Productivity"
                        value={ `${stats.productivity}%` }
                    />
                </div>

                {/* CHARTS */ }

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* PIE */ }

                    <div className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold">
                                Tasks by Status
                            </h2>

                            <p className="text-slate-400 mt-2">
                                Current workflow
                                distribution
                            </p>
                        </div>

                        <div className="h-[350px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <PieChart>
                                    <Pie
                                        data={
                                            stats.tasksPerStatus
                                        }
                                        dataKey="count"
                                        nameKey="status"
                                        outerRadius={ 120 }
                                    >
                                        { stats.tasksPerStatus.map(
                                            (_, index) => (
                                                <Cell
                                                    key={ index }
                                                    fill={
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                    }
                                                />
                                            )
                                        ) }
                                    </Pie>

                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BAR */ }

                    <div className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold">
                                Task Priorities
                            </h2>

                            <p className="text-slate-400 mt-2">
                                Priority distribution
                            </p>
                        </div>

                        <div className="h-[350px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        stats.priorities
                                    }
                                >
                                    <XAxis dataKey="priority" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar dataKey="count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RECENT ACTIVITY */ }

                <div className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Recent Activity
                            </h2>

                            <p className="text-slate-400 mt-2">
                                Latest workspace updates
                            </p>
                        </div>

                        <button className="rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 transition px-5 py-3 text-blue-300">
                            View All
                        </button>
                    </div>

                    <div className="space-y-5">
                        <ActivityItem
                            title="Dashboard redesign completed"
                            time="2 hours ago"
                        />

                        <ActivityItem
                            title="New task created in Kanban"
                            time="5 hours ago"
                        />

                        <ActivityItem
                            title="Team sprint updated"
                            time="Yesterday"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard ({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
}) {
    return (
        <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                    { icon }
                </div>

                <p className="mt-6 text-slate-400">
                    { title }
                </p>

                <h2 className="mt-2 text-4xl font-bold tracking-tight">
                    { value }
                </h2>
            </div>
        </div>
    );
}

function ActivityItem ({
    title,
    time,
}: {
    title: string;
    time: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/50 px-5 py-4 hover:border-blue-500/30 transition">
            <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-400" />

                <div>
                    <h3 className="font-medium">
                        { title }
                    </h3>

                    <p className="text-sm text-slate-400 mt-1">
                        { time }
                    </p>
                </div>
            </div>

            <button className="text-sm text-blue-400 hover:text-blue-300">
                Open
            </button>
        </div>
    );
}