import {
    X,
    Calendar,
    MessageSquare,
    Paperclip,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { api }
    from "../../../api/client";

import type { Task } from "../types/task";

import type { Comment } from "../types/comment";

import CommentInput
    from "./CommentInput";

import CommentList
    from "./CommentList";

interface Props {
    task: Task | null;

    onClose: () => void;
}

export default function TaskModal ({
    task,
    onClose,
}: Props) {
    const [comments, setComments]
        = useState<Comment[]>([]);

    async function loadComments () {
        if (!task) return;

        const response =
            await api.get(
                `/comments/${task.id}`
            );

        setComments(response.data);
    }

    useEffect(() => {
        loadComments();
    }, [task]);

    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8">
            <div className="w-full max-w-5xl h-[90vh] overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 flex">
                {/* CONTENT */ }

                <div className="flex-1 overflow-auto p-8">
                    {/* HEADER */ }

                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm text-blue-300 border border-blue-500/20">
                                #{ task.id }
                            </div>

                            <h1 className="mt-5 text-4xl font-bold">
                                { task.title }
                            </h1>

                            <p className="mt-5 text-slate-400 text-lg leading-relaxed max-w-3xl">
                                { task.description }
                            </p>
                        </div>

                        <button
                            onClick={ onClose }
                            className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 transition flex items-center justify-center"
                        >
                            <X />
                        </button>
                    </div>

                    {/* META */ }

                    <div className="mt-10 grid grid-cols-3 gap-5">
                        <MetaCard
                            icon={ <Calendar /> }
                            title="Due Date"
                            value="Tomorrow"
                        />

                        <MetaCard
                            icon={ <MessageSquare /> }
                            title="Comments"
                            value={ String(
                                comments.length
                            ) }
                        />

                        <MetaCard
                            icon={ <Paperclip /> }
                            title="Attachments"
                            value="0"
                        />
                    </div>

                    {/* COMMENTS */ }

                    <div className="mt-10">
                        <h2 className="text-2xl font-semibold mb-6">
                            Discussion
                        </h2>

                        <CommentInput
                            taskId={ task.id }
                            onCommentCreated={
                                loadComments
                            }
                        />

                        <div className="mt-8">
                            <CommentList
                                comments={
                                    comments
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */ }

                <div className="w-[340px] border-l border-white/10 bg-slate-900/50 p-6">
                    <h2 className="text-xl font-semibold">
                        Details
                    </h2>

                    <div className="mt-8 space-y-6">
                        <DetailItem
                            label="Status"
                            value={ task.status }
                        />

                        <DetailItem
                            label="Priority"
                            value={ task.priority }
                        />

                        <DetailItem
                            label="Assignee"
                            value="Admin User"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetaCard ({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <div className="text-blue-400">
                { icon }
            </div>

            <p className="mt-5 text-slate-400">
                { title }
            </p>

            <h3 className="mt-2 text-2xl font-bold">
                { value }
            </h3>
        </div>
    );
}

function DetailItem ({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-sm text-slate-500">
                { label }
            </p>

            <p className="mt-2 font-medium">
                { value }
            </p>
        </div>
    );
}