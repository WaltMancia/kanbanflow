import {
    Search,
} from "lucide-react";

import {
    useState,
} from "react";

import {
    useGlobalSearch,
} from "../hooks/useGlobalSearch";

export default function GlobalSearch () {
    const [query, setQuery]
        = useState("");

    const {
        results,
    } =
        useGlobalSearch(
            query
        );

    return (
        <div className="relative w-[420px]">
            <Search
                className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          w-5
          h-5
          text-slate-400
        "
            />

            <input
                value={ query }
                onChange={ (e) =>
                    setQuery(
                        e.target.value
                    )
                }
                placeholder="Search projects, tasks, users..."
                className="
          w-full
          pl-12
          pr-4
          py-3
          rounded-2xl
          bg-slate-900
          border
          border-white/10
          outline-none
        "
            />

            { query &&
                results && (
                    <div
                        className="
            absolute
            mt-2
            w-full
            rounded-2xl
            border
            border-white/10
            bg-slate-950
            p-4
            shadow-2xl
            z-50
          "
                    >
                        <div>
                            <h4 className="text-xs uppercase text-slate-500 mb-2">
                                Projects
                            </h4>

                            { results.projects.map(
                                (p) => (
                                    <div
                                        key={ p.id }
                                        className="py-2"
                                    >
                                        { p.name }
                                    </div>
                                )
                            ) }
                        </div>
                    </div>
                ) }
        </div>
    );
}