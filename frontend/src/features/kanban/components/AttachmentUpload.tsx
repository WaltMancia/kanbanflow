import {
    UploadCloud,
} from "lucide-react";

import toast
    from "react-hot-toast";

import { api }
    from "../../../api/client";

interface Props {
    taskId: number;

    onUploaded:
    () => void;
}

export default function AttachmentUpload ({
    taskId,
    onUploaded,
}: Props) {
    async function uploadFile (
        file: File
    ) {
        try {
            const formData =
                new FormData();

            formData.append(
                "file",
                file
            );

            formData.append(
                "taskItemId",
                String(taskId)
            );

            await api.post(
                "/attachments",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            toast.success(
                "File uploaded"
            );

            onUploaded();
        } catch {
            toast.error(
                "Upload failed"
            );
        }
    }

    function handleChange (
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file =
            e.target.files?.[0];

        if (!file) return;

        uploadFile(file);
    }

    return (
        <label className="group flex flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/10 bg-slate-900/60 p-10 transition hover:border-blue-500/40 hover:bg-slate-900 cursor-pointer">
            <UploadCloud className="w-14 h-14 text-blue-400" />

            <h3 className="mt-5 text-xl font-semibold">
                Upload attachment
            </h3>

            <p className="mt-2 text-sm text-slate-400 text-center">
                Drag files here or click
                to upload
            </p>

            <input
                type="file"
                className="hidden"
                onChange={ handleChange }
            />
        </label>
    );
}