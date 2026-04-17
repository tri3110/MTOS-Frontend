'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import styles from '@/static/styles/admin.module.css';
import { AgGridReact } from 'ag-grid-react';

import { 
    ColDef, 
    ModuleRegistry, 
    ClientSideRowModelModule,
    ValidationModule,
    NumberEditorModule,
    TextEditorModule,
    CellStyleModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CustomFilterModule,
    PaginationModule,
    GridOptions,
    CustomEditorModule,
    EventApiModule,
    SelectEditorModule,
    RowApiModule,
} from 'ag-grid-community';
import ActionButtons from '@/components/common/ActionButtons';
import useSWR from 'swr';
import { fetcherSWR, formatNumber } from '@/utils/common';
ModuleRegistry.registerModules([
    ClientSideRowModelModule, 
    ValidationModule, 
    NumberEditorModule,
    TextEditorModule,
    CellStyleModule,
    TextFilterModule,
    NumberFilterModule,
    DateFilterModule,
    CustomFilterModule,
    PaginationModule,
    CustomEditorModule,
    EventApiModule,
    SelectEditorModule,
    RowApiModule
]);

const getActionsByStatus = (status: string) => {
    switch (status) {
        case "pending":
        case "waiting_payment":
            return ["confirmed", "cancelled"];
        case "confirmed":
            return ["preparing"];
        case "preparing":
            return ["delivering"];
        case "delivering":
            return ["completed"];
        default:
            return [];
    }
};

const actionLabelMap: Record<string, string> = {
    confirmed: "Confirm",
    preparing: "Prepare",
    delivering: "Deliver",
    completed: "Complete",
    cancelled: "Cancel",
};

const actionStyleMap: Record<string, string> = {
    confirmed: "bg-blue-500 text-white",
    preparing: "bg-purple-500 text-white",
    delivering: "bg-orange-500 text-white",
    completed: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
};

export default function Vouchers() {

    const [dataObject, setDataObject] = useState<OrderType[]>([]);
    const gridRef = useRef<AgGridReact<any>>(null);

    const gridOptions: GridOptions = {
        pagination: true,
        paginationPageSize: 10,
        floatingFiltersHeight: 38,
        headerHeight: 30,
        paginationPageSizeSelector: [5, 10, 20],
    };
    const defaultColDef = {
        floatingFilter: true,
        resizable: true,
        sortable: true,
    }

    const columnDefs = useMemo<ColDef<OrderType>[]>(() => [
        { 
            headerName: "No", 
            valueGetter: "node.rowIndex + 1",
            cellClass:"text-center grid-border-r",
            width: 60,
        },
        { 
            field: "customer_name", 
            headerName: "Customer",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "store", 
            headerName: "Store",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "total_price", 
            headerName: "Total",
            cellClass:"grid-border-r text-right",
            filter: true,
            valueFormatter: (params) => {
                return formatNumber(params.value) + " VNĐ";
            }
        },
        { 
            field: "status", 
            headerName: "Status",
            cellClass:"grid-border-r items-center justify-center",
            filter: true,
            cellRenderer: (params: any) => {
                const status = params.value;

                const statusMap: Record<string, string> = {
                    pending: "bg-gray-200 text-gray-800",
                    waiting_payment: "bg-yellow-200 text-yellow-800",
                    confirmed: "bg-blue-200 text-blue-800",
                    preparing: "bg-purple-200 text-purple-800",
                    delivering: "bg-orange-200 text-orange-800",
                    completed: "bg-green-200 text-green-800",
                    cancelled: "bg-red-200 text-red-800",
                };

                const labelMap: Record<string, string> = {
                    pending: "Pending",
                    waiting_payment: "Waiting Payment",
                    confirmed: "Confirmed",
                    preparing: "Preparing",
                    delivering: "Delivering",
                    completed: "Completed",
                    cancelled: "Cancelled",
                };

                return (
                    <span
                        className={`w-full h-full flex items-center justify-center text-xs font-medium ${
                            statusMap[status] || "bg-gray-100"
                        }`}
                    >
                        {labelMap[status] || status}
                    </span>
                );
            }
        },
        { 
            field: "payment_method", 
            headerName: "Payment",
            cellClass:"grid-border-r text-center",
            filter: true,
        },
        { 
            field: "created_at", 
            headerName: "Created",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                const { id, status } = params.data;
                const actions = getActionsByStatus(status);
                return(
                    <div className='flex items-center justify-center'>
                        {
                            actions.length > 0 && <div className="flex gap-1 h-6">
                                {actions.map((action) => (
                                    <button
                                        key={action}
                                        className={`px-2 py-1 text-xs rounded ${actionStyleMap[action]}`}
                                        onClick={() => handleChangeStatus(id, action)}
                                    >
                                        {actionLabelMap[action]}
                                    </button>
                                ))}
                            </div>
                        }
                        <ActionButtons<OrderType>
                            data={params.data}
                            id={params.data.id}
                            onDeleteSuccess={(id:number) => {
                                setDataObject(prev => {
                                    return prev.filter(s => s.id !== id);
                                });
                            }}
                            deleteUrl={(id) => `${process.env.NEXT_PUBLIC_HTTP_ADMIN}orders/delete/${id}/`}
                        />
                    </div>
                )
            },
            width: 150,
            pinned: "right"
        },
    ], [dataObject]);

    const {data} = useSWR(
        process.env.NEXT_PUBLIC_HTTP_ADMIN + "orders/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataObject(data);
        }
    }, [data]);

    const handleChangeStatus = async (id: number, status: string) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_HTTP_ADMIN}orders/update/${id}/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            // update UI
            setDataObject(prev =>
                prev.map(order =>
                    order.id === id ? { ...order, status } : order
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={`ag-theme-alpine ${styles.gridWrapper}`} style={{ height: "calc(100vh - 150px)" }}>
        <AgGridReact
            ref={gridRef}
            rowData={dataObject}
            columnDefs={columnDefs}
            getRowId={(params) => String(params.data.id)}
            editType="fullRow"
            gridOptions={gridOptions}
            defaultColDef={defaultColDef}
            onCellDoubleClicked={(event) => {
                if (event.colDef.colId === 'action') {
                    event.api.stopEditing(true);
                    return;
                }
            }}
        />
        </div>
    );
}