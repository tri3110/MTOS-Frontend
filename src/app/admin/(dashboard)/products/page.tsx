'use client'

import { useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import CustomDropdownEditor from '@/components/admin/CustomDropdownEditor';
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

import dynamic from 'next/dynamic';
const ProductDialogAdd = dynamic(
    () => import('@/components/dialog/admin/product.dialog'),
    { ssr: false }
);
import ActionButtons from '@/components/common/ActionButtons';
import useSWR from 'swr';
import { fetcherSWR, formatNumber } from '@/lib/helpers';

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

export default function Products() {

    const [isOpenDialogAdd, setIsOpenDialogAdd] = useState(false);
    const [dataEdit, setDataEdit] = useState<ProductType | null>(null);
    const [dataProducts, setDataProducts] = useState<ProductType[]>([]);
    const [dataCategories, setDataCategories] = useState<CategoryType[]>([]);
    const [optionCategories, setOptionCategories] = useState<OptionType[]>([]);
    const [dataOptionGroup, setDataOptionGroup] = useState<OptionGroupType[]>([]);
    const [dataTopping, setDataTopping] = useState<ToppingType[]>([]);
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

    const handleEditForm = (data: ProductType) =>{
        setDataEdit(data);
        setTimeout(() => {
            setIsOpenDialogAdd(true);
        }, 200);
    }

    const columnDefs = useMemo<ColDef<ProductType>[]>(() => [
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
            // editable: true,
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
            field: "price", 
            headerName: "Price",
            cellClass:"grid-border-r text-right",
            width: 150,
            valueFormatter: ({ value }) => {
                return formatNumber(String(value)) + " VND";
            },
            // editable: true,
            filter: true,
        },
        { 
            field: "purchase_count", 
            headerName: "Purchase Count",
            width: 200,
            // editable: true,
            filter: true,
            cellClass: (params) => {
                const isNumber = typeof params.value === 'number';
                return (isNumber ? 'text-center ' : '') + 'grid-border-r';
            }, 
        },
        {
            headerName: "Category",
            field: "category.id",
            cellClass:"grid-border-r",
            filter: true,
            // editable: true,
            cellEditorParams: {
                values: optionCategories,
                onSelectChange: (option: any, props: any) => {
                    if (option) {
                        const selectedId = option.value;
                        const cinema = props.values.find((opt: any) => opt.value === selectedId);
                        if (cinema) {
                            const fullCinema = dataCategories.find((c: any) => c.id === selectedId);
                            if (fullCinema) props.data.cinema = fullCinema;
                        }
                    }
                }
            },
            valueFormatter: ({ value }) => {
                const opt = optionCategories.find(opt => opt.value === value);
                return opt?.label || value;
            },
            cellEditor: CustomDropdownEditor,
            flex: 1
        },
        { 
            headerName: "Action",
            colId: "action",
            cellRenderer: (params: any) => {
                return(
                    <ActionButtons<ProductType>
                        data={params.data}
                        id={params.data.id}
                        onEdit={handleEditForm}
                        onDeleteSuccess={(id:number) => {
                            setDataProducts(prev => {
                                return prev.filter(s => s.id !== id);
                            });
                        }}
                        deleteUrl={(id) => `${API_BASE_URLS.ADMIN}products/delete/${id}/`}
                    />
                )
            },
            width: 120,
            pinned: "right"
        },
    ], [dataCategories]);

    const { data} = useSWR(
        API_BASE_URLS.ADMIN + "products/get/",
        fetcherSWR
    );

    useEffect(() => {
        if (data) {
            setDataProducts(data.products);
            setDataCategories(data.categories);
            setDataOptionGroup(data.options);
            setDataTopping(data.toppings);
            const options: OptionType[] = data.categories.map((category: any) => ({
                label: category.name,
                value: category.id,
            }));
            setOptionCategories(options);
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
            rowData={dataProducts}
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
        <ProductDialogAdd 
            isOpen={isOpenDialogAdd} 
            setIsOpen={setIsOpenDialogAdd} 
            optionCategories={optionCategories}
            onAddSuccess={(newProduct) => {
                setDataProducts(prev => [newProduct, ...prev]);
            }}
            dataEdit={dataEdit}
            setDataEdit = {setDataEdit}
            onUpdateSuccess = {(updatedProduct: ProductType)=>{
                setDataProducts(prev =>
                    prev.map(product => product.id === updatedProduct.id ? updatedProduct : product)
                );
            }}
            dataTopping={dataTopping}
            dataOptionGroup={dataOptionGroup}
        />
        </div>
    );
}