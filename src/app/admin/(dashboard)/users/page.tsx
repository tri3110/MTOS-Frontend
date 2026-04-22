"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
import { TrashIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";
import { API_BASE_URLS } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function UserTable() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [search, setSearch] = useState("");
    const [dataUpdate, setDataUpdate] = useState<Record<number, string>>({});

    const { data, isLoading } = useUsers({page, 'page_size': pageSize, search});

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: "id",
            header: "ID",
            meta: {
                cellAlign: "center",
            },
        },
        {
            accessorKey: "username",
            header: "Username",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone",
            meta: {
                cellAlign: "center",
            },
        },
        {
            accessorKey: "role",
            header: "Role",
            meta: {
                cellAlign: "center",
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center justify-center gap-2">
                        <select
                            value={dataUpdate[user.id] ?? user.role}
                            onChange={(e) => {
                                const newRole = e.target.value;

                                setDataUpdate((prev) => {
                                    const updated = { ...prev };

                                    if (newRole === user.role) {
                                        delete updated[user.id];
                                    } else {
                                        updated[user.id] = newRole;
                                    }

                                    return updated;
                                });
                            }}
                            className="border px-2 py-1"
                        >
                            <option value="customer">Customer</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2 items-center justify-center">
                    <button className="text-red-600 hover:text-red-400" onClick={() => handleDelete(row.original.id)}>
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: data?.results || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    async function handleSaveAll() {
        const payload = Object.entries(dataUpdate).map(([id, role]) => ({
            id: Number(id),
            role,
        }));

        if (payload.length === 0) return;

        await fetch(API_BASE_URLS.AUTH + "users/update/", {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        setDataUpdate({});
        queryClient.invalidateQueries({
            queryKey: ["users"],
            exact: false,
        });
    }

    function handleDelete(id: number) {
        console.log("delete", id);
    }

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            {/* Search */}
            <input
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 mb-2"
            />

            {/* Table */}
            <table className="w-full border">
                <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="border p-2">
                            {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                            )}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className={`p-2 border ${cell.column.columnDef.meta?.cellAlign === "center" ? "text-center" : ""}`}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </td>
                        ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex gap-2 mt-2 justify-between">
                <div className="flex items-center gap-2">
                    <select className="w-10 h-8 border border-gray-200" 
                    value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        {[1, 2, 3, 4].map((size) => (
                            <option className="text-center" key={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => setPage((p) => p - 1)}><ChevronDoubleLeftIcon className="w-5 h-5" /></button>
                    <input
                        type="text"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        className="border p-1 text-center w-12 h-8"
                    />
                    <button onClick={() => setPage((p) => p + 1)}><ChevronDoubleRightIcon className="w-5 h-5" /></button>
                </div>
                <button
                    onClick={handleSaveAll}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Save Changes ( {Object.keys(dataUpdate).length} )
                </button>
            </div>
        </div>
    );
}