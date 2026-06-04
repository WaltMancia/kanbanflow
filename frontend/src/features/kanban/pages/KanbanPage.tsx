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

import { Search, X } from "lucide-react";

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

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

    const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
    const [activeCreatorColumn, setActiveCreatorColumn] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [newPriority, setNewPriority] = useState("Medium");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
            !selectedPriority || task.priority === selectedPriority;
        return matchesSearch && matchesPriority;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((x) => x.status === "Done").length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

    async function loadProjects () {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
            if (response.data.length > 0) {
                setSelectedProjectId(String(response.data[0].id));
            }
        } catch (error) {
            console.error("Failed to load projects", error);
        }
    }

    async function handleCreateTask (column: string) {
        if (!newTitle.trim()) {
            toast.error("Please enter a task title");
            return;
        }
        if (!selectedProjectId) {
            toast.error("Please select a project");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await api.post("/tasks", {
                title: newTitle.trim(),
                description: "",
                projectId: Number(selectedProjectId),
                priority: newPriority,
            });

            const createdTask = response.data;

            if (column !== "Todo") {
                await api.patch(`/tasks/${createdTask.id}/status`, {
                    status: column,
                });
            }

            toast.success("Task created successfully");
            setNewTitle("");
            setNewPriority("Medium");
            setActiveCreatorColumn(null);
            loadTasks();
        } catch (error) {
            console.error("Failed to create task", error);
            toast.error("Failed to create task");
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        loadTasks();
        loadProjects();

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

                            {/* PROGRESS BAR */}
                            <div className="mt-6 max-w-sm">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Board Completion</span>
                                    <span className="text-xs font-bold text-blue-400">{ completionPercentage }%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-950/60 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 ease-out" 
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
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

                {/* FILTERS */}
                <div className="rounded-[28px] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks by title or description..."
                            value={ searchQuery }
                            onChange={ (e) => setSearchQuery(e.target.value) }
                            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-white/10 bg-slate-950/80 outline-none focus:border-blue-500/50 transition-all text-sm placeholder:text-slate-500"
                        />
                        { searchQuery && (
                            <button
                                onClick={ () => setSearchQuery("") }
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        ) }
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
                        <span className="text-sm font-medium text-slate-400 mr-2">Priority:</span>
                        
                        <button
                            onClick={ () => setSelectedPriority(null) }
                            className={ `px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                                !selectedPriority
                                    ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                                    : "bg-transparent text-slate-400 border-white/5 hover:border-white/10"
                            }` }
                        >
                            All
                        </button>

                        {(["Low", "Medium", "High", "Urgent"] as const).map((prio) => {
                            const isActive = selectedPriority === prio;
                            const colors: Record<string, string> = {
                                Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25",
                                Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/25",
                                High: "bg-orange-500/15 text-orange-400 border-orange-500/30 hover:bg-orange-500/25",
                                Urgent: "bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25",
                            };
                            return (
                                <button
                                    key={ prio }
                                    onClick={ () => setSelectedPriority(isActive ? null : prio) }
                                    className={ `px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 ${
                                        isActive
                                            ? colors[prio]
                                            : "bg-transparent text-slate-400 border-white/5 hover:border-white/10"
                                    }` }
                                >
                                    { prio }
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* BOARD */ }

                <DragDropContext
                    onDragEnd={ onDragEnd }
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                        { columns.map((column) => {
                            const columnTasks =
                                filteredTasks.filter(
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

                                                {/* QUICK CREATE TASK */}
                                                <div className="mt-4 pt-2 border-t border-white/5">
                                                    { activeCreatorColumn === column ? (
                                                        <div className="rounded-[20px] border border-white/10 bg-slate-950 p-4 space-y-3 shadow-inner">
                                                            <input
                                                                type="text"
                                                                placeholder="Task title..."
                                                                value={ newTitle }
                                                                onChange={ (e) => setNewTitle(e.target.value) }
                                                                className="w-full px-3 py-2 text-sm rounded-xl border border-white/10 bg-slate-900 outline-none focus:border-blue-500/50"
                                                                autoFocus
                                                            />

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div>
                                                                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">Project</label>
                                                                    { projects.length > 0 ? (
                                                                        <select
                                                                            value={ selectedProjectId }
                                                                            onChange={ (e) => setSelectedProjectId(e.target.value) }
                                                                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-white/10 bg-slate-900 outline-none text-slate-300"
                                                                        >
                                                                            { projects.map((p) => (
                                                                                <option key={ p.id } value={ p.id }>
                                                                                    { p.name }
                                                                                </option>
                                                                            )) }
                                                                        </select>
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-400">No projects found.</span>
                                                                    ) }
                                                                </div>

                                                                <div>
                                                                    <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-semibold">Priority</label>
                                                                    <select
                                                                        value={ newPriority }
                                                                        onChange={ (e) => setNewPriority(e.target.value) }
                                                                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-white/10 bg-slate-900 outline-none text-slate-300"
                                                                    >
                                                                        <option value="Low">Low</option>
                                                                        <option value="Medium">Medium</option>
                                                                        <option value="High">High</option>
                                                                        <option value="Urgent">Urgent</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-end gap-2 pt-1">
                                                                <button
                                                                    onClick={ () => setActiveCreatorColumn(null) }
                                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 transition text-slate-400 hover:text-white"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    disabled={ isSubmitting || projects.length === 0 }
                                                                    onClick={ () => handleCreateTask(column) }
                                                                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-500 hover:bg-blue-400 transition text-white disabled:opacity-50"
                                                                >
                                                                    { isSubmitting ? "Saving..." : "Add" }
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={ () => {
                                                                setActiveCreatorColumn(column);
                                                                setNewTitle("");
                                                                setNewPriority("Medium");
                                                                if (projects.length > 0 && !selectedProjectId) {
                                                                    setSelectedProjectId(String(projects[0].id));
                                                                }
                                                            } }
                                                            className="w-full py-3 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition duration-300 text-xs font-semibold text-slate-400 hover:text-blue-300 flex items-center justify-center gap-2"
                                                        >
                                                            + Add Task
                                                        </button>
                                                    ) }
                                                </div>
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