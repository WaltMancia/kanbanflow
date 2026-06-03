import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

import { useSearchParams } from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import toast
    from "react-hot-toast";

import AppLayout
    from "../../../layouts/AppLayout";

import { api }
    from "../../../api/client";

import type { Task } from "../types/task";

import { connection }
    from "../../../realtime/signalr";

import TaskModal
    from "../components/TaskModal";

const columns = [
    "Todo",
    "InProgress",
    "Review",
    "Done",
];

const columnLabels: Record<
    string,
    string
> = {
    Todo: "To Do",

    InProgress:
        "In Progress",

    Review: "Review",

    Done: "Done",
};

const COLORS: Record<
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

const COLUMN_DRAG_STYLES: Record<string, string> = {
    Todo: "border-blue-500/30 bg-slate-900/90 shadow-lg shadow-blue-500/5",
    InProgress: "border-yellow-500/30 bg-slate-900/90 shadow-lg shadow-yellow-500/5",
    Review: "border-purple-500/30 bg-slate-900/90 shadow-lg shadow-purple-500/5",
    Done: "border-emerald-500/30 bg-slate-900/90 shadow-lg shadow-emerald-500/5",
};

const COLUMN_HEADER_BADGE: Record<string, string> = {
    Todo: "bg-blue-500/15 text-blue-300 border-blue-500/20",
    InProgress: "bg-yellow-500/15 text-yellow-300 border-yellow-500/20",
    Review: "bg-purple-500/15 text-purple-300 border-purple-500/20",
    Done: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

const CARD_PRIORITY_BORDER: Record<string, string> = {
    Low: "border-l-4 border-l-emerald-500/75 hover:shadow-emerald-500/5",
    Medium: "border-l-4 border-l-yellow-500/75 hover:shadow-yellow-500/5",
    High: "border-l-4 border-l-orange-500/75 hover:shadow-orange-500/5",
    Urgent: "border-l-4 border-l-red-500/75 hover:shadow-red-500/5",
};

export default function KanbanPage () {
    const [tasks, setTasks]
        = useState<Task[]>([]);

    const [onlineUsers, setOnlineUsers]
        = useState(1);

    const [selectedTask, setSelectedTask]
        = useState<Task | null>(
            null
        );

    const [searchParams, setSearchParams] = useSearchParams();
    const taskIdParam = searchParams.get("task");

    useEffect(() => {
        if (taskIdParam && tasks.length > 0) {
            const task = tasks.find(t => String(t.id) === taskIdParam);
            if (task) {
                setSelectedTask(task);
            }
        }
    }, [taskIdParam, tasks]);

    async function loadTasks () {
        try {
            const response =
                await api.get("/tasks");

            setTasks(response.data);
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to load tasks"
            );
        }
    }

    useEffect(() => {
        loadTasks();

        async function connectRealtime () {
            try {
                if (
                    connection.state ===
                    "Disconnected"
                ) {
                    await connection.start();

                    console.log(
                        "Realtime connected"
                    );
                }

                connection.on(
                    "TaskCreated",
                    () => {
                        toast.success(
                            "New task created"
                        );

                        loadTasks();
                    }
                );

                connection.on(
                    "TaskUpdated",
                    () => {
                        toast(
                            "Task updated"
                        );

                        loadTasks();
                    }
                );

                connection.on(
                    "CommentCreated",
                    () => {
                        toast.success(
                            "New comment added"
                        );
                    }
                );

                connection.on(
                    "UserConnected",
                    () => {
                        setOnlineUsers(
                            (prev) => prev + 1
                        );
                    }
                );

                connection.on(
                    "UserDisconnected",
                    () => {
                        setOnlineUsers(
                            (prev) =>
                                prev > 1
                                    ? prev - 1
                                    : 1
                        );
                    }
                );
            } catch (error) {
                console.error(error);

                toast.error(
                    "Realtime connection failed"
                );
            }
        }

        connectRealtime();

        return () => {
            connection.off(
                "TaskCreated"
            );

            connection.off(
                "TaskUpdated"
            );

            connection.off(
                "CommentCreated"
            );

            connection.off(
                "UserConnected"
            );

            connection.off(
                "UserDisconnected"
            );
        };
    }, []);

    async function onDragEnd (
        result: any
    ) {
        if (!result.destination)
            return;

        const taskId =
            Number(result.draggableId);

        const newStatus =
            result.destination
                .droppableId;

        try {
            await api.patch(
                `/tasks/${taskId}/status`,
                {
                    status: newStatus,
                }
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Failed to update task"
            );
        }
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* HERO */ }

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),transparent_35%)]" />

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 font-medium">
                                Team Collaboration
                            </p>

                            <h1 className="mt-4 text-5xl font-bold tracking-tight">
                                Kanban Board
                            </h1>

                            <p className="mt-4 text-slate-400 text-lg max-w-2xl">
                                Organize your workflow
                                visually and collaborate
                                with your team in real
                                time.
                            </p>

                            {/* ONLINE USERS */ }

                            <div className="mt-5 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />

                                <span className="text-sm text-slate-400">
                                    { onlineUsers } users
                                    online
                                </span>
                            </div>
                        </div>

                        {/* STATS */ }

                        <div className="hidden xl:flex items-center gap-5">
                            <MiniStat
                                label="Tasks"
                                value={ tasks.length }
                            />

                            <MiniStat
                                label="Completed"
                                value={
                                    tasks.filter(
                                        (x) =>
                                            x.status ===
                                            "Done"
                                    ).length
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* BOARD */ }

                <DragDropContext
                    onDragEnd={ onDragEnd }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                        { columns.map((column) => {
                            const columnTasks =
                                tasks.filter(
                                    (x) =>
                                        x.status ===
                                        column
                                );

                            return (
                                <Droppable
                                    droppableId={
                                        column
                                    }
                                    key={ column }
                                >
                                    { (provided, snapshot) => (
                                        <div
                                            ref={
                                                provided.innerRef
                                            }
                                            { ...provided.droppableProps }
                                            className={ `
                                                rounded-[28px] border p-5 transition-all duration-300 min-h-[700px] backdrop-blur-xl
                                                ${snapshot.isDraggingOver
                                                    ? COLUMN_DRAG_STYLES[column]
                                                    : "border-white/10 bg-slate-900/70"
                                                }
                                            ` }
                                        >
                                            {/* COLUMN HEADER */ }

                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h2 className="text-xl font-bold">
                                                        {
                                                            columnLabels[
                                                            column
                                                            ]
                                                        }
                                                    </h2>

                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {
                                                            columnTasks.length
                                                        }{ " " }
                                                        tasks
                                                    </p>
                                                </div>

                                                <div className={ `rounded-2xl px-4 py-2 text-sm border font-medium transition-all duration-300 ${COLUMN_HEADER_BADGE[column]}` }>
                                                    {
                                                        columnTasks.length
                                                    }
                                                </div>
                                            </div>

                                            {/* TASKS */ }

                                            <div className="space-y-4">
                                                { columnTasks.map(
                                                    (
                                                        task,
                                                        index
                                                    ) => (
                                                        <Draggable
                                                            key={
                                                                task.id
                                                            }
                                                            draggableId={ String(
                                                                task.id
                                                            ) }
                                                            index={
                                                                index
                                                            }
                                                        >
                                                            { (
                                                                provided,
                                                                snapshot
                                                            ) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    { ...provided.draggableProps }
                                                                    { ...provided.dragHandleProps }
                                                                    onClick={ () => {
                                                                        setSelectedTask(task);
                                                                        setSearchParams((prev) => {
                                                                            const next = new URLSearchParams(prev);
                                                                            next.set("task", String(task.id));
                                                                            return next;
                                                                        });
                                                                    } }
                                                                    className={ `
                                    group rounded-[24px] border p-5 transition-all duration-300 cursor-pointer
                                    ${snapshot.isDragging
                                                                            ? "border-blue-500 bg-slate-900 shadow-2xl scale-[1.02]"
                                                                            : `border-white/10 bg-slate-950/60 hover:border-blue-500/40 hover:-translate-y-1 hover:shadow-xl ${CARD_PRIORITY_BORDER[task.priority]}`
                                                                        }
                                  `}
                                                                >
                                                                    {/* TOP */ }

                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div>
                                                                            <h3 className="text-lg font-semibold leading-tight">
                                                                                {
                                                                                    task.title
                                                                                }
                                                                            </h3>

                                                                            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                                                                                {
                                                                                    task.description
                                                                                }
                                                                            </p>
                                                                        </div>

                                                                        <PriorityBadge
                                                                            priority={
                                                                                task.priority
                                                                            }
                                                                        />
                                                                    </div>

                                                                    {/* FOOTER */ }

                                                                    <div className="mt-6 flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-300">
                                                                                A
                                                                            </div>

                                                                            <div>
                                                                                <p className="text-sm font-medium">
                                                                                    Admin
                                                                                </p>

                                                                                <p className="text-xs text-slate-500">
                                                                                    Assigned
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="rounded-xl bg-slate-800 px-3 py-2 text-xs text-slate-300 border border-white/5">
                                                                            #{ task.id }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) }
                                                        </Draggable>
                                                    )
                                                ) }

                                                {
                                                    provided.placeholder
                                                }
                                            </div>
                                        </div>
                                    ) }
                                </Droppable>
                            );
                        }) }
                    </div>
                </DragDropContext>
            </div>

            {/* TASK MODAL */ }

            <TaskModal
                task={ selectedTask }
                onClose={ () => {
                    setSelectedTask(null);
                    setSearchParams((prev) => {
                        const next = new URLSearchParams(prev);
                        next.delete("task");
                        return next;
                    });
                } }
            />
        </AppLayout>
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
        px-3 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap
        ${COLORS[priority]}
      `}
        >
            { priority }
        </div>
    );
}

function MiniStat ({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl px-6 py-5 min-w-[130px]">
            <p className="text-sm text-slate-400">
                { label }
            </p>

            <h2 className="mt-2 text-3xl font-bold">
                { value }
            </h2>
        </div>
    );
}