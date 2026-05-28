import type { Comment } from "../types/comment";

interface Props {
    comments: Comment[];
}

export default function CommentList ({
    comments,
}: Props) {
    return (
        <div className="space-y-5">
            { comments.map(
                (comment) => (
                    <div
                        key={ comment.id }
                        className="rounded-3xl border border-white/10 bg-slate-900/70 p-5"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold">
                                { comment.user.name.charAt(
                                    0
                                ) }
                            </div>

                            <div>
                                <h3 className="font-semibold">
                                    {
                                        comment.user
                                            .name
                                    }
                                </h3>

                                <p className="text-sm text-slate-500">
                                    { new Date(
                                        comment.createdAt
                                    ).toLocaleString() }
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 text-slate-300 leading-relaxed">
                            { comment.content }
                        </p>
                    </div>
                )
            ) }
        </div>
    );
}