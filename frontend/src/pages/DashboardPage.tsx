import {
    useEffect,
    useState,
} from "react";

import {
    Activity,
    FolderKanban,
    CheckCircle2,
    Users,
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
} from "recharts";

import AppLayout
    from "../layouts/AppLayout";

import { api }
    from "../api/client";

import type { DashboardData } from "../features/dashboard/types/dashboard";

const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
];

export default function DashboardPage () {
    const [data, setData]
        = useState<DashboardData | null>(
            null
        );

    async function loadDashboard () {
        try {
            const response =
                await api.get(
                    "/analytics/dashboard"
                );

            setData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadDashboard();
    }, []);

    if (!data) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-[70vh]">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* HERO */ }

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),transparent_35%)]" />

                    <div className="relative z-10">
                        <p className="text-blue-400 font-medium">
                            Analytics Overview
                        </p>

                        <h1 className="mt-4 text-5xl font-bold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="mt-4 max-w-2xl text-lg text-slate-400">
                            Monitor projects,
                            productivity and team
                            performance in real
                            time.
                        </p>
                    </div>
                </div>

                {/* KPI */ }

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Tasks"
                        value={ data.totalTasks }
                        icon={
                            <Activity className="w-6 h-6" />
                        }
                    />

                    <StatCard
                        title="Completed"
                        value={
                            data.completedTasks
                        }
                        icon={
                            <CheckCircle2 className="w-6 h-6" />
                        }
                    />

                    <StatCard
                        title="Projects"
                        value={
                            data.totalProjects
                        }
                        icon={
                            <FolderKanban className="w-6 h-6" />
                        }
                    />

                    <StatCard
                        title="Team Members"
                        value={
                            data.totalUsers
                        }
                        icon={
                            <Users className="w-6 h-6" />
                        }
                    />
                </div>

                {/* CHARTS */ }

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* PRIORITIES */ }

                    <div className="rounded-[32px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Tasks by Priority
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Distribution of task
                                priorities across all
                                projects.
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
                                            data.tasksByPriority
                                        }
                                        dataKey="count"
                                        nameKey="priority"
                                        outerRadius={ 120 }
                                    >
                                        { data.tasksByPriority.map(
                                            (
                                                _,
                                                index
                                            ) => (
                                                <Cell
                                                    key={
                                                        index
                                                    }
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

                    {/* STATUS */ }

                    <div className="rounded-[32px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">
                                Tasks by Status
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Current workflow
                                distribution.
                            </p>
                        </div>

                        <div className="h-[350px]">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                <BarChart
                                    data={
                                        data.tasksByStatus
                                    }
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis dataKey="status" />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="count"
                                        radius={ [
                                            8,
                                            8,
                                            0,
                                            0,
                                        ] }
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* PRODUCTIVITY */ }

                <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 font-medium">
                                Productivity
                            </p>

                            <h2 className="mt-3 text-5xl font-bold">
                                { Math.round(
                                    data.productivity
                                ) }
                                %
                            </h2>

                            <p className="mt-4 text-slate-400">
                                Team completion rate
                                based on finished
                                tasks.
                            </p>
                        </div>

                        <div className="hidden lg:flex w-40 h-40 rounded-full border-[14px] border-blue-500 items-center justify-center text-4xl font-bold">
                            { Math.round(
                                data.productivity
                            ) }
                            %
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard ({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                { icon }
            </div>

            <p className="mt-5 text-slate-400">
                { title }
            </p>

            <h2 className="mt-2 text-4xl font-bold">
                { value }
            </h2>
        </div>
    );
}