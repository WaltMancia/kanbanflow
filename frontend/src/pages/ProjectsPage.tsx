import { useEffect, useState } from "react";

import { FolderKanban, Users } from "lucide-react";

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

export default function ProjectsPage () {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProjects () {
            try {
                const response = await api.get("/projects");

                if (isMounted) {
                    setProjects(response.data);
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

        loadProjects();

        return () => {
            isMounted = false;
        };
    }, []);

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

                { loading && <div className="text-slate-400">Loading projects...</div> }

                { error && !loading && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
                        { error }
                    </div>
                ) }

                { !loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        { projects.map((project) => (
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
                ) }
            </div>
        </AppLayout>
    );
}