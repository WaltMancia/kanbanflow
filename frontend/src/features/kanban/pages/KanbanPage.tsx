import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

import { useEffect, useState } from "react";

import AppLayout
    from "../../../layouts/AppLayout";

import { api }
    from "../../../api/client";

import type { Task } from "../types/task";

const columns = [
    "Todo",
    "InProgress",
    "Review",
    "Done",
];

export default function KanbanPage () {
    const [tasks, setTasks] =
        useState<Task[]>([]);

    async function loadTasks () {
        const response =
            await api.get("/tasks");

        setTasks(response.data);
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function onDragEnd (
        result: any
    ) {
        if (!result.destination)
            return;

        const taskId =
            Number(result.draggableId);

        const newStatus =
            result.destination.droppableId;

        await api.patch(
            `/tasks/${taskId}/status`,
            {
                status: newStatus,
            }
        );

        loadTasks();
    }

    return (
        <AppLayout>
            <div className="space-y-8">
                {/* HEADER */ }

                <div>
                    <h1 className="text-5xl font-bold">
                        Kanban Board
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Manage your workflow
                    </p>
                </div>

                {/* BOARD */ }

                <DragDropContext
                    onDragEnd={ onDragEnd }
                >
                    <div className="grid grid-cols-4 gap-6">
                        { columns.map((column) => {
                            const columnTasks =
                                tasks.filter(
                                    (x) =>
                                        x.status === column
                                );

                            return (
                                <Droppable
                                    droppableId={ column }
                                    key={ column }
                                >
                                    { (provided) => (
                                        <div
                                            ref={
                                                provided.innerRef
                                            }
                                            { ...provided.droppableProps }
                                            className="bg-surface border border-border rounded-3xl p-5 min-h-[700px]"
                                        >
                                            <div className="flex items-center justify-between mb-5">
                                                <h2 className="font-bold text-lg">
                                                    { column }
                                                </h2>

                                                <div className="bg-secondary text-sm px-3 py-1 rounded-full">
                                                    {
                                                        columnTasks.length
                                                    }
                                                </div>
                                            </div>

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
                                                            index={ index }
                                                        >
                                                            { (
                                                                provided
                                                            ) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    { ...provided.draggableProps }
                                                                    { ...provided.dragHandleProps }
                                                                    className="bg-secondary rounded-2xl p-5 border border-border hover:border-primary transition cursor-pointer"
                                                                >
                                                                    <div className="flex items-start justify-between gap-4">
                                                                        <div>
                                                                            <h3 className="font-semibold text-lg">
                                                                                {
                                                                                    task.title
                                                                                }
                                                                            </h3>

                                                                            <p className="text-slate-400 text-sm mt-2">
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
        </AppLayout>
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
            "bg-emerald-500/15 text-emerald-400",

        Medium:
            "bg-yellow-500/15 text-yellow-400",

        High:
            "bg-orange-500/15 text-orange-400",

        Urgent:
            "bg-red-500/15 text-red-400",
    };

    return (
        <div
            className={ `
        px-3 py-1 rounded-full text-xs font-semibold
        ${styles[priority]}
      `}
        >
            { priority }
        </div>
    );
}