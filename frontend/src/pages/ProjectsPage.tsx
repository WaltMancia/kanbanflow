import { useEffect, useState } from "react";

import { FolderKanban, Plus, Users } from "lucide-react";

import AppLayout from "../layouts/AppLayout";

import { api } from "../api/client";

interface ProjectItem {
    id: number;
    name: string;
    description?: string | null;
    team?: {
        id: number;
        name: string;
    } | null;
}

interface TeamOption {
    id: number;
    name: string;
}

export default function ProjectsPage () {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [teams, setTeams] = useState<TeamOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTeamId, setSelectedTeamId] = useState("all");

    const [creating, setCreating] = useState(false);

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [teamId, setTeamId] = useState("");

    const filteredProjects =
        selectedTeamId === "all"
            ? projects
            : projects.filter(
                (project) =>
                    String(project.team?.id) === selectedTeamId
            );

    useEffect(() => {
        let isMounted = true;

        async function loadData () {
            try {
                const [projectsResponse, teamsResponse] =
                    await Promise.all([
                        api.get("/projects"),
                        api.get("/teams"),
                    ]);

                if (isMounted) {
                    setProjects(projectsResponse.data);
                    setTeams(teamsResponse.data);
                }
            } catch {
                if (isMounted) {
                    setError("Unable to load projects");
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

    async function handleCreateProject (
        e: React.FormEvent
    ) {
        e.preventDefault();

        if (!teamId) {
            setError("Select a team for the project");
            return;
        }

        try {
            setCreating(true);
            setError(null);

            await api.post(
                "/projects",
                {
                    name,
                    description,
                    teamId: Number(teamId),
                }
            );

            setName("");
            setDescription("");
            setTeamId(teams[0]?.id ? String(teams[0].id) : "");

            const response = await api.get("/projects");
            setProjects(response.data);
        } catch {
            setError("Unable to create project");
        } finally {
            setCreating(false);
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                <div>
                    <p className="text-blue-400 font-medium">Workspace</p>
                    <h1 className="mt-3 text-4xl font-bold tracking-tight">Projects</h1>
                    <p className="mt-3 text-slate-400 max-w-2xl">
                        Browse the current projects and their assigned teams.
                    </p>
                </div>

                <section className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Filter</p>
                            <h2 className="mt-2 text-2xl font-semibold">Projects by team</h2>
                            <p className="mt-2 text-slate-400 text-sm">
                                { projects.length } total projects
                                { selectedTeamId === "all"
                                    ? ""
                                    : ` · ${filteredProjects.length} shown`
                                }
                            </p>
                        </div>

                        <select
                            value={ selectedTeamId }
                            onChange={ (e) => setSelectedTeamId(e.target.value) }
                            className="w-full md:w-72 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500 text-slate-200"
                        >
                            <option value="all">All teams</option>
                            { teams.map((team) => (
                                <option key={ team.id } value={ team.id }>
                                    { team.name }
                                </option>
                            )) }
                        </select>
                    </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                            <Plus size={ 20 } />
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">Create project</h2>
                            <p className="text-slate-400 text-sm">Add a new project and assign it to a team.</p>
                        </div>
                    </div>

                    <form
                        onSubmit={ handleCreateProject }
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                    >
                        <input
                            value={ name }
                            onChange={ (e) => setName(e.target.value) }
                            placeholder="Project name"
                            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <input
                            value={ description }
                            onChange={ (e) => setDescription(e.target.value) }
                            placeholder="Description"
                            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                        />

                        <select
                            value={ teamId }
                            onChange={ (e) => setTeamId(e.target.value) }
                            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500 text-slate-200"
                        >
                            <option value="">Select team</option>
                            { teams.map((team) => (
                                <option key={ team.id } value={ team.id }>
                                    { team.name }
                                </option>
                            )) }
                        </select>

                        <button
                            type="submit"
                            disabled={ creating }
                            className="rounded-2xl bg-blue-500 px-4 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-60"
                        >
                            { creating ? "Creating..." : "Create project" }
                        </button>
                    </form>
                </section>

                { loading && <div className="text-slate-400">Loading projects...</div> }

                { error && !loading && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        <p className="font-semibold">Unable to load projects</p>
                        <p className="mt-1 text-sm text-red-100/80">
                            { error }
                        </p>
                    </div>
                ) }

                { !loading && !error && (
                    filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            { filteredProjects.map((project) => (
                                <article
                                    key={ project.id }
                                    className="rounded-[28px] border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                                            <FolderKanban size={ 20 } />
                                        </div>

                                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
                                            Project #{ project.id }
                                        </span>
                                    </div>

                                    <h2 className="mt-5 text-2xl font-semibold">{ project.name }</h2>

                                    <p className="mt-3 text-slate-400 min-h-12">
                                        { project.description || "No description provided." }
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                                        <Users size={ 16 } className="text-blue-400" />
                                        { project.team?.name ?? "No team assigned" }
                                    </div>
                                </article>
                            )) }
                        </div>
                    ) : (
                        <div className="rounded-[28px] border border-dashed border-white/15 bg-slate-900/40 p-10 text-center">
                            <h2 className="text-2xl font-semibold">
                                { projects.length === 0
                                    ? "No projects yet"
                                    : "No projects match this team"
                                }
                            </h2>

                            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
                                { projects.length === 0
                                    ? "Create your first project using the form above."
                                    : "Try changing the team filter or create a new project in the selected team."
                                }
                            </p>
                        </div>
                    )
                ) }
            </div>
        </AppLayout>
    );
}