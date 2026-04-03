'use client';

import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

interface ActionProps<T> {
    data: T;
    id: number;

    onEdit?: (data: T) => void;
    onDeleteSuccess?: (id: number) => void;

    deleteUrl: (id: number) => string;
    confirmDeleteMessage?: string;
}

export default function ActionButtons<T>({
    data,
    id,
    onEdit,
    onDeleteSuccess,
    deleteUrl,
    confirmDeleteMessage = "Are you sure to delete?"
}: ActionProps<T>) {

    const handleDelete = async () => {
        if (!confirm(confirmDeleteMessage)) return;

        const response = await fetch(deleteUrl(id), {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            toast.success("Deleted successfully");
            onDeleteSuccess?.(id);
        } else {
            const res = await response.json();
            toast.error(res.message || "Delete failed");
        }
    };

    return (
        <div className="flex h-full">
            {onEdit && (
                <button
                    className="p-2 text-blue-600 hover:text-blue-400"
                    onClick={() => onEdit(data)}
                >
                    <PencilIcon className="w-5 h-5" />
                </button>
            )}

            {onDeleteSuccess && (
                <button
                    className="p-2 text-red-600 hover:text-red-400"
                    onClick={handleDelete}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}