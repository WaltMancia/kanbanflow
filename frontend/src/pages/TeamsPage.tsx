import { useEffect, useState } from "react";

import { Users, UserCircle2 } from "lucide-react";

import AppLayout from "../layouts/AppLayout";

import { api } from "../api/client";

interface TeamItem {
    id: number;
    name: string;
    description?: string | null;
    owner?: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export default function TeamsPage () {
    const [teams, setTeams] = useState<TeamItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadTeams () {
            try {
                const response = await api.get("/teams");

                if (isMounted) {
                    setTeams(response.data);
                }
            } catch {
                if (isMounted) {
                    setError("Unable to load teams");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadTeams();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <p className="text-blue-400 font-medium">Workspace</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight">Teams</h1>
                    <p className="mt-3 text-slate-400 max-w-2xl">
                        Review the groups that own projects and collaborate on tasks.
                    </p>
                </div>

                { loading && <div className="text-slate-400">Loading teams...</div> }

                { error && !loading && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        { error }
                    </div>
                ) }

                { !loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        { teams.map((team) => (
                            <article
                                key={ team.id }
                                className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                                        <Users size={ 20 } />
                                    </div>

                                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                                        Team #{ team.id }
                                    </span>
                                </div>

                                <h2 className="mt-5 text-2xl font-semibold">{ team.name }</h2>

                                <p className="mt-3 text-slate-400 min-h-12">
                                    { team.description || "No description provided." }
                                </p>

                                <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                                    <UserCircle2 size={ 16 } className="text-emerald-400" />
                                    { team.owner?.name ?? "No owner assigned" }
                                    { team.owner?.email ? ` • ${team.owner.email}` : "" }
                                </div>
                            </article>
                        )) }
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}