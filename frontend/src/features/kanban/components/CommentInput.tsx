import {
    useState,
} from "react";

import toast
    from "react-hot-toast";

import { api }
    from "../../../api/client";

interface Props {
    taskId: number;

    onCommentCreated:
    () => void;
}

export default function CommentInput ({
    taskId,
    onCommentCreated,
}: Props) {
    const [content, setContent]
        = useState("");

    async function submit () {
        if (!content.trim())
            return;

        try {
            await api.post(
                "/comments",
                {
                    content,
                    taskItemId: taskId,
                }
            );

            setContent("");

            toast.success(
                "Comment added"
            );

            onCommentCreated();
        } catch {
            toast.error(
                "Failed to add comment"
            );
        }
    }

    return (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
            <textarea
                value={ content }
                onChange={ (e) =>
                    setContent(
                        e.target.value
                    )
                }
                rows={ 4 }
                placeholder="Write a comment..."
                className="w-full resize-none rounded-2xl bg-slate-950 border border-white/10 px-5 py-4 outline-none focus:border-blue-500"
            />

            <div className="mt-5 flex justify-end">
                <button
                    onClick={ submit }
                    className="rounded-2xl bg-blue-500 hover:bg-blue-400 transition px-6 py-3 font-medium"
                >
                    Comment
                </button>
            </div>
        </div>
    );
}