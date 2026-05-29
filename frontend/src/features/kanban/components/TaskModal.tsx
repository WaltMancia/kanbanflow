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

import type { Attachment } from "../types/attachment";

import CommentInput
    from "./CommentInput";

import CommentList
    from "./CommentList";

import AttachmentUpload
    from "./AttachmentUpload";

import AttachmentList
    from "./AttachmentList";

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

    const [attachments, setAttachments]
        = useState<Attachment[]>(
            []
        );

    async function loadComments () {
        if (!task) return;

        try {
            const response =
                await api.get(
                    `/comments/${task.id}`
                );

            setComments(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function loadAttachments () {
        if (!task) return;

        try {
            const response =
                await api.get(
                    `/attachments/${task.id}`
                );

            setAttachments(
                response.data
            );
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!task) return;

        loadComments();

        loadAttachments();
    }, [task]);

    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
            <div className="w-full max-w-7xl h-[92vh] overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 shadow-2xl flex">
                {/* MAIN CONTENT */ }

                <div className="flex-1 overflow-y-auto p-10">
                    {/* HEADER */ }

                    <div className="flex items-start justify-between gap-8">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm text-blue-300 border border-blue-500/20">
                                Task #{ task.id }
                            </div>

                            <h1 className="mt-6 text-5xl font-bold tracking-tight leading-tight">
                                { task.title }
                            </h1>

                            <p className="mt-6 text-slate-400 text-lg leading-relaxed">
                                { task.description }
                            </p>
                        </div>

                        <button
                            onClick={ onClose }
                            className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 transition flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* META CARDS */ }

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <MetaCard
                            icon={
                                <Calendar className="w-6 h-6" />
                            }
                            title="Due Date"
                            value="Tomorrow"
                        />

                        <MetaCard
                            icon={
                                <MessageSquare className="w-6 h-6" />
                            }
                            title="Comments"
                            value={ String(
                                comments.length
                            ) }
                        />

                        <MetaCard
                            icon={
                                <Paperclip className="w-6 h-6" />
                            }
                            title="Attachments"
                            value={ String(
                                attachments.length
                            ) }
                        />
                    </div>

                    {/* ATTACHMENTS */ }

                    <div className="mt-14">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold">
                                    Attachments
                                </h2>

                                <p className="mt-2 text-slate-400">
                                    Upload documents,
                                    screenshots or files
                                    related to this task.
                                </p>
                            </div>
                        </div>

                        <AttachmentUpload
                            taskId={ task.id }
                            onUploaded={
                                loadAttachments
                            }
                        />

                        <div className="mt-8">
                            <AttachmentList
                                attachments={
                                    attachments
                                }
                            />
                        </div>
                    </div>

                    {/* COMMENTS */ }

                    <div className="mt-16">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold">
                                Discussion
                            </h2>

                            <p className="mt-2 text-slate-400">
                                Collaborate with your
                                team in real time.
                            </p>
                        </div>

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

                <div className="w-[360px] border-l border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 overflow-y-auto">
                    <h2 className="text-2xl font-bold">
                        Task Details
                    </h2>

                    {/* ASSIGNEE */ }

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Assignee
                        </p>

                        <div className="mt-4 flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                                A
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Admin User
                                </h3>

                                <p className="text-sm text-slate-500">
                                    Product Manager
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS */ }

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Status
                        </p>

                        <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 inline-flex">
                            <span className="text-emerald-400 font-medium">
                                { task.status }
                            </span>
                        </div>
                    </div>

                    {/* PRIORITY */ }

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Priority
                        </p>

                        <div className="mt-4">
                            <PriorityBadge
                                priority={
                                    task.priority
                                }
                            />
                        </div>
                    </div>

                    {/* CREATED */ }

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Created
                        </p>

                        <p className="mt-3 text-slate-300">
                            { new Date().toLocaleDateString() }
                        </p>
                    </div>

                    {/* ACTIVITY */ }

                    <div className="mt-12">
                        <h3 className="text-xl font-semibold">
                            Activity
                        </h3>

                        <div className="mt-6 space-y-5">
                            <ActivityItem
                                title="Task created"
                                subtitle="2 hours ago"
                            />

                            <ActivityItem
                                title="Status updated"
                                subtitle="1 hour ago"
                            />

                            <ActivityItem
                                title="Comment added"
                                subtitle="Just now"
                            />
                        </div>
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
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-400">
                { icon }
            </div>

            <p className="mt-5 text-slate-400">
                { title }
            </p>

            <h3 className="mt-2 text-3xl font-bold">
                { value }
            </h3>
        </div>
    );
}

function PriorityBadge ({
    priority,
}: {
    priority: string;
}) {
    const styles: Record<
        string,
        string
    > = {
        Low:
            "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",

        Medium:
            "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",

        High:
            "bg-orange-500/15 text-orange-400 border border-orange-500/20",

        Urgent:
            "bg-red-500/15 text-red-400 border border-red-500/20",
    };

    return (
        <div
            className={ `
        inline-flex px-4 py-3 rounded-2xl text-sm font-semibold
        ${styles[priority]}
      `}
        >
            { priority }
        </div>
    );
}

function ActivityItem ({
    title,
    subtitle,
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 w-3 h-3 rounded-full bg-blue-400" />

            <div>
                <p className="font-medium">
                    { title }
                </p>

                <p className="text-sm text-slate-500 mt-1">
                    { subtitle }
                </p>
            </div>
        </div>
    );
}