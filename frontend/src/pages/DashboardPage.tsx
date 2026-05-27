import AppLayout
    from "../layouts/AppLayout";

export default function DashboardPage () {
    return (
        <AppLayout>
            <div className="space-y-10">
                {/* HEADER */ }

                <div>
                    <h1 className="text-5xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Welcome back to KanbanFlow
                    </p>
                </div>

                {/* STATS */ }

                <div className="grid grid-cols-4 gap-6">
                    <StatCard
                        title="Projects"
                        value="12"
                    />

                    <StatCard
                        title="Teams"
                        value="5"
                    />

                    <StatCard
                        title="Tasks"
                        value="128"
                    />

                    <StatCard
                        title="Completed"
                        value="87%"
                    />
                </div>

                {/* RECENT */ }

                <div className="bg-surface border border-border rounded-3xl p-8">
                    <h2 className="text-2xl font-semibold mb-6">
                        Recent Projects
                    </h2>

                    <div className="space-y-4">
                        <RecentProject
                            name="ERP System"
                            status="In Progress"
                        />

                        <RecentProject
                            name="Mobile App"
                            status="Completed"
                        />

                        <RecentProject
                            name="Marketing Website"
                            status="Planning"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard ({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="bg-surface border border-border rounded-3xl p-6">
            <p className="text-slate-400">
                { title }
            </p>

            <h2 className="text-4xl font-bold mt-3">
                { value }
            </h2>
        </div>
    );
}

function RecentProject ({
    name,
    status,
}: {
    name: string;
    status: string;
}) {
    return (
        <div className="flex items-center justify-between bg-secondary rounded-2xl p-5">
            <div>
                <h3 className="font-semibold text-lg">
                    { name }
                </h3>

                <p className="text-slate-400">
                    { status }
                </p>
            </div>

            <button className="bg-primary px-5 py-2 rounded-xl">
                Open
            </button>
        </div>
    );
}