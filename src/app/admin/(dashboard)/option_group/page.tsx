'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_BASE_URLS } from '@/lib/constants';
import { OptionGroupService } from '@/services/admin.service';
import dynamic from 'next/dynamic';
const OptionGroupDialogAdd = dynamic(
    () => import('@/components/dialog/admin/option.group.dialog'),
    { ssr: false }
);

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

export default function OptionGroup() {

    const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
    const [dataEdit, setDataEdit] = useState<OptionGroupType | null>(null);
    const [dataOptionGroup, setDataOptionGroup] = useState<OptionGroupType[]>([]);
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

    const columnDefs = useMemo<ColDef<OptionGroupType>[]>(() => [
        { 
            headerName: "No", 
            valueGetter: "node.rowIndex + 1",
            cellClass:"text-center grid-border-r",
            width: 60,
        },
        { 
            field: "name", 
            headerName: "Name",
            cellClass:"grid-border-r",
            filter: true,
            flex: 1,
        },
        {
            headerName: "Options",
            field: "options",
            flex: 3,
            cellClass:"grid-border-r",
            cellRenderer: (params: any) => {
                return (
                <div>
                    {params.data.options.map((opt: any) => (
                        <span key={opt.id} className='p-2'>
                            - {opt.name}
                        </span>
                    ))}
                </div>
                );
            },
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ActionButtons<OptionGroupType>
                        data={params.data}
                        id={params.data.id}
                        // onEdit={handleEditForm}
                        onDeleteSuccess={(id:number) => {
                            setDataOptionGroup(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        deleteUrl={(id) => `${API_BASE_URLS.ADMIN}option_group/delete/${id}/`}
                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataOptionGroup]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await OptionGroupService.getOptionGroups();
                setDataOptionGroup(data.options);

            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };
        fetchData();
    }, []);

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
                    setIsOpenDialogAdd(true);
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
            rowData={dataOptionGroup}
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
        <OptionGroupDialogAdd 
            isOpen={isOpenDialogAdd} 
            setIsOpen={setIsOpenDialogAdd} 
            onAddSuccess={(newItem) => {
                setDataOptionGroup(prev => [newItem, ...prev]);
            }}
            dataEdit={dataEdit}
            setDataEdit = {setDataEdit}
            onUpdateSuccess = {(updatedItem: OptionGroupType)=>{
                setDataOptionGroup(prev =>
                    prev.map(slider => slider.id === updatedItem.id ? updatedItem : slider)
                );
            }}
        />
        </div>
    );
}