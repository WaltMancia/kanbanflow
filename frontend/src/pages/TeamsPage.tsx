import { useEffect, useState } from "react";

import { Plus, Users, UserCircle2 } from "lucide-react";

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

interface ProjectItem {
    id: number;
    team?: {
        id: number;
        name: string;
    } | null;
}

export default function TeamsPage () {
    const [teams, setTeams] = useState<TeamItem[]>([]);
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [creating, setCreating] = useState(false);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadData () {
            try {
                const [teamsResponse, projectsResponse] =
                    await Promise.all([
                        api.get("/teams"),
                        api.get("/projects"),
                    ]);

                if (isMounted) {
                    setTeams(teamsResponse.data);
                    setProjects(projectsResponse.data);
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

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleCreateTeam (
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            setCreating(true);
            setError(null);

            await api.post(
                "/teams",
                {
                    name,
                    description,
                }
            );

            setName("");
            setDescription("");

            const [teamsResponse, projectsResponse] =
                await Promise.all([
                    api.get("/teams"),
                    api.get("/projects"),
                ]);

            setTeams(teamsResponse.data);
            setProjects(projectsResponse.data);
        } catch {
            setError("Unable to create team");
        } finally {
            setCreating(false);
        }
    }

    const projectCountByTeamId =
        projects.reduce<Record<number, number>>(
            (counts, project) => {
                if (project.team?.id) {
                    counts[project.team.id] =
                        (counts[project.team.id] ?? 0) + 1;
                }

                return counts;
            },
            {}
        );

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

                <section className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                            <Plus size={ 20 } />
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">Create team</h2>
                            <p className="text-slate-400 text-sm">Create a new team and assign yourself as owner.</p>
                        </div>
                    </div>

                    <form
                        onSubmit={ handleCreateTeam }
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                            placeholder="Team name"
                            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                        <input
                            value={ description }
                            onChange={ (e) => setDescription(e.target.value) }
                            placeholder="Description"
                            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-emerald-500"
                        />

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={ creating }
                                className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
                            >
                                { creating ? "Creating..." : "Create team" }
                            </button>
                        </div>
                    </form>
                </section>

                { loading && <div className="text-slate-400">Loading teams...</div> }

                { error && !loading && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        <p className="font-semibold">Unable to load teams</p>
                        <p className="mt-1 text-sm text-red-100/80">
                            { error }
                        </p>
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

                                <div className="mt-3 inline-flex rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-400">
                                    { projectCountByTeamId[team.id] ?? 0 } projects
                                </div>
                            </article>
                        )) }
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}