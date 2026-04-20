'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_BASE_URLS } from '@/lib/constants';
import { VoucherService } from '@/services';

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
import { fetcherSWR, formatNumber } from '@/lib/helpers';
import VoucherDialogAdd from '../../../../components/dialog/admin/voucher.dialog';
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

export default function Vouchers() {

    const [isOpen, setIsOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState<VoucherType | null>(null);
    const [dataVoucher, setDataVoucher] = useState<VoucherType[]>([]);
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

    const handleEditForm = (data: VoucherType) =>{
        setDataEdit(data);
        setTimeout(() => {
            setIsOpen(true);
        }, 200);
    }

    const columnDefs = useMemo<ColDef<VoucherType>[]>(() => [
        { 
            headerName: "No", 
            valueGetter: "node.rowIndex + 1",
            cellClass:"text-center grid-border-r",
            width: 60,
        },
        { 
            field: "code", 
            headerName: "Code",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "discount_type", 
            headerName: "Discount Type",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "discount_value", 
            headerName: "Discount",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "max_usage", 
            headerName: "Max Usage",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "used_count", 
            headerName: "Used Count",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "expired_at", 
            headerName: "Expired At",
            cellClass:"grid-border-r",
            filter: true,
        },
        { 
            field: "min_order_value", 
            headerName: "Min Order",
            cellClass:"grid-border-r text-right",
            width: 150,
            valueFormatter: ({ value }) => {
                return formatNumber(String(value)) + " VND";
            },
            filter: true,
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ActionButtons<VoucherType>
                        data={params.data}
                        id={params.data.id}
                        onEdit={handleEditForm}
                        onDeleteSuccess={(id:number) => {
                            setDataVoucher(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        deleteUrl={(id) => `${API_BASE_URLS.ADMIN}vouchers/delete/${id}/`}
                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataVoucher]);

    const { data} = useSWR(
        API_BASE_URLS.ADMIN + "vouchers/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataVoucher(data.data);
        }
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            const pagingPanel = document.querySelector('.ag-paging-panel');
            if (pagingPanel && !pagingPanel.querySelector('#add-btn')) {
                const btn = document.createElement('button');
                btn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                `;
                btn.id = 'add-btn';
                btn.className = 'flex px-1 py-1 ml-3 border border-gray-200 rounded absolute left-1 hover:bg-blue-300 hover:text-white';
                btn.onclick = () => {
                    setIsOpen(true);
                };
                pagingPanel.appendChild(btn);
                clearInterval(interval);
            }
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ag-theme-alpine gridWrapper" style={{ height: "calc(100vh - 150px)" }}>
        <AgGridReact
            ref={gridRef}
            rowData={dataVoucher}
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
        <VoucherDialogAdd 
            isOpen={isOpen} 
            setIsOpen={setIsOpen} 
            onAddSuccess={(newItem) => {
                setDataVoucher(prev => [newItem, ...prev]);
            }}
            dataEdit={dataEdit}
            setDataEdit = {setDataEdit}
            onUpdateSuccess = {(updatedItem: VoucherType)=>{
                setDataVoucher(prev =>
                    prev.map(item => item.id === updatedItem.id ? updatedItem : item)
                );
            }}
        />
        </div>
    );
}