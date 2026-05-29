import {
    FileText,
    Image,
    File,
} from "lucide-react";

import { type Attachment }
    from "../types/attachment";

interface Props {
    attachments:
    Attachment[];
}

export default function AttachmentList ({
    attachments,
}: Props) {
    function getIcon (
        type: string
    ) {
        if (
            type.includes("image")
        ) {
            return (
                <Image className="text-pink-400" />
            );
        }

        if (
            type.includes("pdf")
        ) {
            return (
                <FileText className="text-red-400" />
            );
        }

        return (
            <File className="text-blue-400" />
        );
    }

    return (
        <div className="space-y-4">
            { attachments.map(
                (file) => (
                    <a
                        key={ file.id }
                        href={ `${import.meta.env.VITE_API_ORIGIN ?? "http://localhost:5298"}${file.filePath}` }
                        target="_blank"
                        className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:border-blue-500/30"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                            { getIcon(
                                file.fileType
                            ) }
                        </div>

                        <div className="flex-1">
                            <h3 className="font-medium">
                                {
                                    file.fileName
                                }
                            </h3>

                            <p className="text-sm text-slate-500">
                                { (
                                    file.fileSize /
                                    1024
                                ).toFixed(1) }{ " " }
                                KB
                            </p>
                        </div>
                    </a>
                )
            ) }
        </div>
    );
}