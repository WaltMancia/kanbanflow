import {
    Command,
} from "cmdk";

import {
    useNavigate,
} from "react-router-dom";

interface Props {
    open: boolean;

    onClose: () => void;
}

export default function CommandPalette ({
    open,
    onClose,
}: Props) {
    const navigate =
        useNavigate();

    if (!open)
        return null;

    return (
        <div
            className="
      fixed
      inset-0
      bg-black/60
      backdrop-blur-md
      z-[999]
      flex
      items-start
      justify-center
      pt-32
    "
            onClick={ onClose }
        >
            <Command
                onClick={ (e) =>
                    e.stopPropagation()
                }
                className="
          w-[700px]
          rounded-3xl
          border
          border-white/10
          bg-slate-950
          overflow-hidden
          shadow-2xl
        "
            >
                <Command.Input
                    placeholder="Search commands..."
                    className="
            w-full
            px-6
            py-5
            bg-transparent
            outline-none
            border-b
            border-white/10
            text-lg
          "
                />

                <Command.List
                    className="
            max-h-[500px]
            overflow-auto
            p-3
          "
                >
                    <Command.Group
                        heading="Navigation"
                    >
                        <Command.Item
                            onSelect={ () =>
                                navigate("/")
                            }
                        >
                            Dashboard
                        </Command.Item>

                        <Command.Item
                            onSelect={ () =>
                                navigate(
                                    "/projects"
                                )
                            }
                        >
                            Projects
                        </Command.Item>

                        <Command.Item
                            onSelect={ () =>
                                navigate(
                                    "/kanban"
                                )
                            }
                        >
                            Kanban
                        </Command.Item>

                        <Command.Item
                            onSelect={ () =>
                                navigate(
                                    "/teams"
                                )
                            }
                        >
                            Teams
                        </Command.Item>
                    </Command.Group>

                    <Command.Separator />

                    <Command.Group
                        heading="Actions"
                    >
                        <Command.Item>
                            Create Project
                        </Command.Item>

                        <Command.Item>
                            Create Task
                        </Command.Item>

                        <Command.Item>
                            Create Team
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}