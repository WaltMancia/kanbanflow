import {
    X,
    Calendar,
    MessageSquare,
    Paperclip,
    Pencil,
    Trash2,
    Check,
    XCircle,
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

    onDeleted: () => void;
}

const PRIORITY_STYLES: Record<string, string> = {
    Low: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    Medium: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
    High: "bg-orange-500/15 text-orange-400 border border-orange-500/20",
    Urgent: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export default function TaskModal ({
    task,
    onClose,
    onDeleted,
}: Props) {
    const [comments, setComments]
        = useState<Comment[]>([]);

    const [attachments, setAttachments]
        = useState<Attachment[]>([]);

    // ── Edit state ───────────────────────────────────────────
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPriority, setEditPriority] = useState("Medium");
    const [isSaving, setIsSaving] = useState(false);

    // ── Delete state ─────────────────────────────────────────
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function loadComments () {
        if (!task) return;
        try {
            const response = await api.get(`/comments/${task.id}`);
            setComments(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadAttachments () {
        if (!task) return;
        try {
            const response = await api.get(`/attachments/${task.id}`);
            setAttachments(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!task) return;
        setIsEditing(false);
        setConfirmDelete(false);
        loadComments();
        loadAttachments();
    }, [task]);

    function startEditing () {
        if (!task) return;
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditPriority(task.priority);
        setIsEditing(true);
    }

    function cancelEditing () {
        setIsEditing(false);
    }

    async function handleSave () {
        if (!task) return;
        if (!editTitle.trim()) return;
        try {
            setIsSaving(true);
            await api.put(`/tasks/${task.id}`, {
                title: editTitle.trim(),
                description: editDescription.trim(),
                priority: editPriority,
            });

            // Optimistically update the local task display
            task.title = editTitle.trim();
            task.description = editDescription.trim();
            task.priority = editPriority;
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to save task", error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete () {
        if (!task) return;
        try {
            setIsDeleting(true);
            await api.delete(`/tasks/${task.id}`);
            onClose();
            onDeleted();
        } catch (error) {
            console.error("Failed to delete task", error);
            setIsDeleting(false);
        }
    }

    if (!task) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
            <div className="w-full max-w-7xl h-[92vh] overflow-hidden rounded-[36px] border border-white/10 bg-slate-950 shadow-2xl flex">

                {/* MAIN CONTENT */}

                <div className="flex-1 overflow-y-auto p-10">

                    {/* HEADER */}

                    <div className="flex items-start justify-between gap-8">
                        <div className="max-w-4xl flex-1">
                            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-500/15 px-4 py-2 text-sm text-blue-300 border border-blue-500/20">
                                Task #{ task.id }
                                { task.project && (
                                    <span className="text-blue-400/60">·</span>
                                ) }
                                { task.project && (
                                    <span className="text-blue-200/70">{ task.project.name }</span>
                                ) }
                            </div>

                            { isEditing ? (
                                <input
                                    autoFocus
                                    value={ editTitle }
                                    onChange={ (e) => setEditTitle(e.target.value) }
                                    className="mt-6 w-full text-5xl font-bold tracking-tight leading-tight bg-transparent border-b-2 border-blue-500/50 outline-none pb-2 text-white placeholder:text-slate-600"
                                    placeholder="Task title..."
                                />
                            ) : (
                                <h1 className="mt-6 text-5xl font-bold tracking-tight leading-tight">
                                    { task.title }
                                </h1>
                            ) }

                            { isEditing ? (
                                <textarea
                                    value={ editDescription }
                                    onChange={ (e) => setEditDescription(e.target.value) }
                                    rows={ 4 }
                                    className="mt-6 w-full text-lg text-slate-300 leading-relaxed bg-slate-900/60 border border-white/10 rounded-2xl p-4 outline-none focus:border-blue-500/40 resize-none"
                                    placeholder="Task description..."
                                />
                            ) : (
                                <p className="mt-6 text-slate-400 text-lg leading-relaxed min-h-[2rem]">
                                    { task.description || <span className="italic text-slate-600">No description provided.</span> }
                                </p>
                            ) }
                        </div>

                        {/* ACTION BUTTONS */}

                        <div className="flex items-center gap-3 shrink-0">
                            { isEditing ? (
                                <>
                                    <button
                                        onClick={ cancelEditing }
                                        className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 transition flex items-center justify-center text-slate-400 hover:text-white"
                                        title="Cancel editing"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={ handleSave }
                                        disabled={ isSaving || !editTitle.trim() }
                                        className="w-12 h-12 rounded-2xl bg-blue-500 hover:bg-blue-400 transition flex items-center justify-center text-white disabled:opacity-50"
                                        title="Save changes"
                                    >
                                        { isSaving
                                            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            : <Check className="w-5 h-5" />
                                        }
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={ startEditing }
                                    className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 hover:bg-blue-500/15 hover:border-blue-500/30 transition flex items-center justify-center text-slate-400 hover:text-blue-300"
                                    title="Edit task"
                                >
                                    <Pencil className="w-5 h-5" />
                                </button>
                            ) }

                            <button
                                onClick={ onClose }
                                className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 transition flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* META CARDS */}

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <MetaCard
                            icon={ <Calendar className="w-6 h-6" /> }
                            title="Due Date"
                            value={
                                task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString()
                                    : "Not set"
                            }
                        />

                        <MetaCard
                            icon={ <MessageSquare className="w-6 h-6" /> }
                            title="Comments"
                            value={ String(comments.length) }
                        />

                        <MetaCard
                            icon={ <Paperclip className="w-6 h-6" /> }
                            title="Attachments"
                            value={ String(attachments.length) }
                        />
                    </div>

                    {/* ATTACHMENTS */}

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
                            onUploaded={ loadAttachments }
                        />

                        <div className="mt-8">
                            <AttachmentList
                                attachments={ attachments }
                            />
                        </div>
                    </div>

                    {/* COMMENTS */}

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
                            onCommentCreated={ loadComments }
                        />

                        <div className="mt-8">
                            <CommentList
                                comments={ comments }
                            />
                        </div>
                    </div>
                </div>

                {/* SIDEBAR */}

                <div className="w-[360px] border-l border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 overflow-y-auto flex flex-col">
                    <h2 className="text-2xl font-bold">
                        Task Details
                    </h2>

                    {/* ASSIGNEE */}

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Assignee
                        </p>

                        <div className="mt-4 flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold text-lg">
                                { task.assignee
                                    ? task.assignee.name.charAt(0).toUpperCase()
                                    : "A"
                                }
                            </div>

                            <div>
                                <h3 className="font-semibold text-lg">
                                    { task.assignee?.name ?? "Admin User" }
                                </h3>

                                <p className="text-sm text-slate-500">
                                    { task.assignee?.email ?? "admin@kanbanflow.com" }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS */}

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

                    {/* PRIORITY */}

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Priority
                        </p>

                        <div className="mt-4">
                            { isEditing ? (
                                <select
                                    value={ editPriority }
                                    onChange={ (e) => setEditPriority(e.target.value) }
                                    className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-slate-900 outline-none text-sm text-slate-300 focus:border-blue-500/40"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            ) : (
                                <PriorityBadge priority={ isEditing ? editPriority : task.priority } />
                            ) }
                        </div>
                    </div>

                    {/* CREATED */}

                    <div className="mt-10">
                        <p className="text-sm uppercase tracking-wider text-slate-500">
                            Created
                        </p>

                        <p className="mt-3 text-slate-300">
                            { task.createdAt
                                ? new Date(task.createdAt).toLocaleDateString()
                                : new Date().toLocaleDateString()
                            }
                        </p>
                    </div>

                    {/* ACTIVITY */}

                    <div className="mt-12">
                        <h3 className="text-xl font-semibold">
                            Activity
                        </h3>

                        <div className="mt-6 space-y-5">
                            <ActivityItem
                                title="Task created"
                                subtitle={
                                    task.createdAt
                                        ? new Date(task.createdAt).toLocaleString()
                                        : "Recently"
                                }
                            />
                        </div>
                    </div>

                    {/* DELETE ZONE */}

                    <div className="mt-auto pt-10">
                        <div className="rounded-[24px] border border-red-500/20 bg-red-500/5 p-5">
                            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                                Danger Zone
                            </h3>

                            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                Permanently delete this task
                                and all its comments and
                                attachments. This action
                                cannot be undone.
                            </p>

                            { confirmDelete ? (
                                <div className="mt-4 space-y-2">
                                    <p className="text-xs text-red-300 font-medium">
                                        Are you sure? This cannot be undone.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={ () => setConfirmDelete(false) }
                                            className="flex-1 py-2 rounded-xl border border-white/10 bg-slate-900 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={ handleDelete }
                                            disabled={ isDeleting }
                                            className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition text-xs text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-1"
                                        >
                                            { isDeleting
                                                ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                : "Yes, Delete"
                                            }
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={ () => setConfirmDelete(true) }
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition text-sm text-red-400 font-semibold"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Task
                                </button>
                            ) }
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
    return (
        <div
            className={ `
        inline-flex px-4 py-3 rounded-2xl text-sm font-semibold
        ${PRIORITY_STYLES[priority] ?? PRIORITY_STYLES["Medium"]}
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
            <div className="mt-1 w-3 h-3 rounded-full bg-blue-400 shrink-0" />

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