import {
    FolderKanban,
    CheckSquare,
    Users,
    User,
} from "lucide-react";

import type { SearchResponse } from "../types/search";

interface Props {
    results: SearchResponse;
}

export default function SearchResultList ({
    results,
}: Props) {
    const isEmpty =
        results.projects.length === 0 &&
        results.tasks.length === 0 &&
        results.users.length === 0 &&
        results.teams.length === 0;

    if (isEmpty) {
        return (
            <div className="p-4 text-sm text-slate-400">
                No results found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            { results.projects.length > 0 && (
                <Section
                    title="Projects"
                    icon={
                        <FolderKanban className="w-4 h-4" />
                    }
                    items={ results.projects.map(
                        (x) => ({
                            id: x.id,
                            label: x.name,
                        })
                    ) }
                />
            ) }

            { results.tasks.length > 0 && (
                <Section
                    title="Tasks"
                    icon={
                        <CheckSquare className="w-4 h-4" />
                    }
                    items={ results.tasks.map(
                        (x) => ({
                            id: x.id,
                            label: x.title,
                        })
                    ) }
                />
            ) }

            { results.users.length > 0 && (
                <Section
                    title="Users"
                    icon={
                        <User className="w-4 h-4" />
                    }
                    items={ results.users.map(
                        (x) => ({
                            id: x.id,
                            label: x.name,
                        })
                    ) }
                />
            ) }

            { results.teams.length > 0 && (
                <Section
                    title="Teams"
                    icon={
                        <Users className="w-4 h-4" />
                    }
                    items={ results.teams.map(
                        (x) => ({
                            id: x.id,
                            label: x.name,
                        })
                    ) }
                />
            ) }
        </div>
    );
}

function Section ({
    title,
    icon,
    items,
}: {
    title: string;
    icon: React.ReactNode;
    items: {
        id: number;
        label: string;
    }[];
}) {
    return (
        <div>
            <div className="flex items-center gap-2 px-2 mb-2 text-xs uppercase tracking-wider text-slate-500">
                { icon }
                { title }
            </div>

            { items.map((item) => (
                <div
                    key={ item.id }
                    className="
            px-3
            py-2
            rounded-xl
            cursor-pointer
            hover:bg-slate-800
            transition
          "
                >
                    { item.label }
                </div>
            )) }
        </div>
    );
}