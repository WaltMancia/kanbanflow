import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    User,
    CheckSquare,
    Plus,
    Search,
    ArrowRight,
} from "lucide-react";
import { useGlobalSearch } from "../../search/hooks/useGlobalSearch";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CommandPalette ({
    open,
    onClose,
}: Props) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const { results, loading } = useGlobalSearch(query);

    // Reset query when command palette closes
    useEffect(() => {
        if (!open) {
            setQuery("");
        }
    }, [open]);

    // Handle escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-[680px] rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col z-[1000]"
                    >
                        <Command className="flex flex-col bg-transparent">
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                                <Command.Input
                                    value={query}
                                    onValueChange={setQuery}
                                    placeholder="Search projects, tasks, teams or navigation..."
                                    className="w-full bg-transparent outline-none text-white text-lg placeholder-slate-500 py-1"
                                />
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-white/5 text-[10px] text-slate-500 font-semibold select-none font-sans">
                                    <span>ESC</span>
                                </div>
                            </div>

                            <Command.List className="max-h-[450px] overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                <Command.Empty className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                                    <Search className="w-8 h-8 text-slate-600 animate-pulse" />
                                    <span>No results found for "{query}"</span>
                                </Command.Empty>

                                {loading && (
                                    <div className="flex items-center justify-center py-6 gap-2 text-slate-400 text-sm">
                                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                                        <span>Searching workspace...</span>
                                    </div>
                                )}

                                {/* Search Results Group */}
                                {query && results && (
                                    <div className="space-y-2">
                                        {results.projects.length > 0 && (
                                            <Command.Group heading="Projects" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                                {results.projects.map((project) => (
                                                    <CommandPaletteItem
                                                        key={`project-${project.id}`}
                                                        icon={<FolderKanban size={16} className="text-blue-400" />}
                                                        label={project.name}
                                                        description={`Project #${project.id}`}
                                                        onSelect={() => {
                                                            navigate("/projects");
                                                            onClose();
                                                        }}
                                                    />
                                                ))}
                                            </Command.Group>
                                        )}

                                        {results.tasks.length > 0 && (
                                            <Command.Group heading="Tasks" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                                {results.tasks.map((task) => (
                                                    <CommandPaletteItem
                                                        key={`task-${task.id}`}
                                                        icon={<CheckSquare size={16} className="text-amber-400" />}
                                                        label={task.title}
                                                        description={`Task #${task.id} · In Kanban Board`}
                                                        onSelect={() => {
                                                            navigate(`/kanban?task=${task.id}`);
                                                            onClose();
                                                        }}
                                                    />
                                                ))}
                                            </Command.Group>
                                        )}

                                        {results.teams.length > 0 && (
                                            <Command.Group heading="Teams" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                                {results.teams.map((team) => (
                                                    <CommandPaletteItem
                                                        key={`team-${team.id}`}
                                                        icon={<Users size={16} className="text-emerald-400" />}
                                                        label={team.name}
                                                        description={`Team #${team.id}`}
                                                        onSelect={() => {
                                                            navigate("/teams");
                                                            onClose();
                                                        }}
                                                    />
                                                ))}
                                            </Command.Group>
                                        )}

                                        {results.users.length > 0 && (
                                            <Command.Group heading="Users" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                                {results.users.map((user) => (
                                                    <CommandPaletteItem
                                                        key={`user-${user.id}`}
                                                        icon={<User size={16} className="text-purple-400" />}
                                                        label={user.name}
                                                        description={`User #${user.id}`}
                                                        onSelect={() => {
                                                            navigate("/teams");
                                                            onClose();
                                                        }}
                                                    />
                                                ))}
                                            </Command.Group>
                                        )}
                                    </div>
                                )}

                                {/* Navigation Group */}
                                <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                    <CommandPaletteItem
                                        icon={<LayoutDashboard size={16} />}
                                        label="Dashboard"
                                        description="Overview of your workspace metrics and progress"
                                        onSelect={() => {
                                            navigate("/");
                                            onClose();
                                        }}
                                    />
                                    <CommandPaletteItem
                                        icon={<FolderKanban size={16} />}
                                        label="Projects"
                                        description="View and manage all active workspace projects"
                                        onSelect={() => {
                                            navigate("/projects");
                                            onClose();
                                        }}
                                    />
                                    <CommandPaletteItem
                                        icon={<CheckSquare size={16} />}
                                        label="Kanban Board"
                                        description="Track tasks, drag-and-drop to update status"
                                        onSelect={() => {
                                            navigate("/kanban");
                                            onClose();
                                        }}
                                    />
                                    <CommandPaletteItem
                                        icon={<Users size={16} />}
                                        label="Teams"
                                        description="Collaborate with members in specialized groups"
                                        onSelect={() => {
                                            navigate("/teams");
                                            onClose();
                                        }}
                                    />
                                </Command.Group>

                                {/* Actions Group */}
                                <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-slate-500 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider">
                                    <CommandPaletteItem
                                        icon={<Plus size={16} className="text-blue-400" />}
                                        label="Create Project"
                                        description="Initialize a new project and assign a team"
                                        onSelect={() => {
                                            navigate("/projects");
                                            onClose();
                                        }}
                                    />
                                    <CommandPaletteItem
                                        icon={<Plus size={16} className="text-amber-400" />}
                                        label="Create Task"
                                        description="Add a new task card to the Kanban board"
                                        onSelect={() => {
                                            navigate("/kanban");
                                            onClose();
                                        }}
                                    />
                                    <CommandPaletteItem
                                        icon={<Plus size={16} className="text-emerald-400" />}
                                        label="Create Team"
                                        description="Form a new collaboration group"
                                        onSelect={() => {
                                            navigate("/teams");
                                            onClose();
                                        }}
                                    />
                                </Command.Group>
                            </Command.List>

                            {/* Footer Help */}
                            <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-t border-white/5 text-xs text-slate-500 select-none">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 font-sans font-semibold">↑↓</kbd>
                                        to navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-white/5 font-sans font-semibold">↵</kbd>
                                        to select
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-600 font-semibold tracking-wider uppercase font-sans">KanbanFlow Palette</span>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

interface CommandPaletteItemProps {
    icon: React.ReactNode;
    label: string;
    description?: string;
    onSelect: () => void;
}

function CommandPaletteItem ({
    icon,
    label,
    description,
    onSelect,
}: CommandPaletteItemProps) {
    return (
        <Command.Item
            onSelect={ onSelect }
            className="group flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer text-slate-300 transition-all select-none border border-transparent mx-1 my-0.5 outline-none"
        >
            <div className="flex items-center gap-3.5">
                <div className="text-slate-400 group-hover:text-blue-400 group-data-[selected=true]:text-blue-400 transition-colors shrink-0">
                    { icon }
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-white group-data-[selected=true]:text-blue-300 transition-colors">
                        { label }
                    </span>
                    { description && (
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 group-data-[selected=true]:text-blue-400/70 mt-0.5 transition-colors">
                            { description }
                        </span>
                    ) }
                </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-data-[selected=true]:opacity-100 transition-opacity">
                <span className="text-[10px] text-blue-400 uppercase font-semibold">Select</span>
                <ArrowRight size={14} className="text-blue-400" />
            </div>
        </Command.Item>
    );
}