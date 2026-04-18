'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Image from "next/image";
import { API_BASE_URLS } from '@/lib/constants';

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
import SliderDialogAdd from '../../../../components/dialog/admin/slider.dialog';
import useSWR from 'swr';
import { fetcherSWR } from '@/lib/helpers';
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

export default function Sliders() {

    const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
    const [dataEdit, setDataEdit] = useState<SliderType | null>(null);
    const [dataSliders, setDataSliders] = useState<SliderType[]>([]);
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

    const handleEditForm = (data: SliderType) =>{
        setDataEdit(data);
        setTimeout(() => {
            setIsOpenDialogAdd(true);
        }, 200);
    }

    const columnDefs = useMemo<ColDef<SliderType>[]>(() => [
        { 
            headerName: "No", 
            valueGetter: "node.rowIndex + 1",
            cellClass:"text-center grid-border-r",
            width: 60,
        },
        { 
            field: "title", 
            headerName: "Title",
            cellClass:"grid-border-r",
            filter: true,
            flex: 1,
        },
        {
            headerName: "Image",
            field: "image",
            width: 120,
            cellClass: "grid-border-r",
            cellRenderer: (params: any) => {
                if (!params.value) return null;

                const imageUrl = params.value.startsWith("http")
                    ? params.value
                    : `${API_BASE_URLS.ADMIN_MEDIA}${params.value}`;

                return (
                    <div className="flex items-center h-full">
                        <Image
                            className="dark:hidden h-full"
                            src={imageUrl}
                            alt="Logo"
                            width={100}
                            height={100}
                            style={{ objectFit: "contain"}}
                            unoptimized // để Next.js bỏ qua việc xử lý ảnh qua proxy vì dùng localhost
                        />
                    </div>
                );
            },
        },
        { 
            field: "link", 
            headerName: "Link",
            cellClass:"grid-border-r",
            filter: true,
            flex: 1,
        },
        { 
            field: "order", 
            headerName: "Order",
            cellClass:"grid-border-r",
            filter: true,
            flex: 1,
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ActionButtons<SliderType>
                        data={params.data}
                        id={params.data.id}
                        onEdit={handleEditForm}
                        onDeleteSuccess={(id:number) => {
                            setDataSliders(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        deleteUrl={(id) => `${API_BASE_URLS.ADMIN}sliders/delete/${id}/`}
                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataSliders]);


    const { data} = useSWR(
        API_BASE_URLS.ADMIN + "sliders/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataSliders(data.data);
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
            rowData={dataSliders}
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
        <SliderDialogAdd 
            isOpen={isOpenDialogAdd} 
            setIsOpen={setIsOpenDialogAdd} 
            onAddSuccess={(newSlider) => {
                setDataSliders(prev => [newSlider, ...prev]);
            }}
            dataEdit={dataEdit}
            setDataEdit = {setDataEdit}
            onUpdateSuccess = {(updatedSlider: SliderType)=>{
                setDataSliders(prev =>
                    prev.map(slider => slider.id === updatedSlider.id ? updatedSlider : slider)
                );
            }}
        />
        </div>
    );
}