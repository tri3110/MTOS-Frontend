'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { API_BASE_URLS } from '@/lib/constants';
import { CategoryService } from '@/services';
import dynamic from 'next/dynamic';

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

const CategoryDialogAdd = dynamic(
    () => import('@/components/dialog/admin/category.dialog'),
    { ssr: false }
);

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

export default function Categories() {

    const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
    const [dataEdit, setDataEdit] = useState<CategoryType | null>(null);
    const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);
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

    const handleEditForm = (data: CategoryType) =>{
        setDataEdit(data);
        setTimeout(() => {
            setIsOpenDialogAdd(true);
        }, 200);
    }

    const columnDefs = useMemo<ColDef<CategoryType>[]>(() => [
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
            cellEditorParams: {
                getValidationErrors: (params:any) => {
                    const { value } = params;
                    if (!value) {
                        return ["Name isn't emty"];
                    }

                    return null;
                },
            },
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ActionButtons<CategoryType>
                        data={params.data}
                        id={params.data.id}
                        onEdit={handleEditForm}
                        onDeleteSuccess={(id:number) => {
                            setDataCategories(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        deleteUrl={(id) => `${API_BASE_URLS.ADMIN}categories/delete/${id}/`}
                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataCategories]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await CategoryService.getCategories();
                setDataCategories(response.data as any);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
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
            rowData={dataCategories}
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
        <CategoryDialogAdd 
            isOpen={isOpenDialogAdd} 
            setIsOpen={setIsOpenDialogAdd} 
            onAddSuccess={(newCategory) => {
                setDataCategories(prev => [newCategory, ...prev]);
            }}
            dataEdit={dataEdit}
            setDataEdit = {setDataEdit}
            onUpdateSuccess = {(updatedCategory: CategoryType)=>{
                setDataCategories(prev =>
                    prev.map(category => category.id === updatedCategory.id ? updatedCategory : category)
                );
            }}
        />
        </div>
    );
}