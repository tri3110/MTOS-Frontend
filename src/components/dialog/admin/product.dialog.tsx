'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatNumber } from "@/lib/helpers";
import { toast } from "react-toastify";
import { AdminProductService } from "@/services/admin.service";
import { API_BASE_URLS } from "@/lib/constants";
import { productSchema } from "@/lib/validations";
import React from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  optionCategories: OptionType[];
  onAddSuccess: (newProduct: ProductType) => void;
  dataEdit: ProductType|null;
  setDataEdit: (data: ProductType|null) => void;
  onUpdateSuccess: (updatedScreen: ProductType) => void;
  dataTopping: ToppingType[];
  dataOptionGroup: OptionGroupType[];
}

type ProductFormValues = {
  name: string;
  price: number;
  category_id: number;
};

export default React.memo(function ProductDialogAdd(props: Props) {
    const {isOpen, setIsOpen, optionCategories, onAddSuccess
        , dataEdit, setDataEdit, onUpdateSuccess, dataTopping, dataOptionGroup} = props;

    const { 
        register, handleSubmit, control, reset, setValue
        , formState: { errors },
    } = useForm<ProductFormValues>({
      resolver: zodResolver(productSchema),
      mode: 'onBlur',
      defaultValues: {
        name: "",
        price: 0,
        category_id: 0,
      },
    });

    const [priceDisplay, setPriceDisplay] = useState("");
    const [search, setSearch] = useState("");
    const [selectedTopping, setSelectedTopping] = useState<ToppingType[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            reset({
              name: dataEdit.name,
              price: Number(dataEdit.price),
              category_id: dataEdit.category.id,
            });
            setPriceDisplay(formatNumber(String(dataEdit.price)));
            setPreviewUrl(`${API_BASE_URLS.ADMIN_MEDIA}${dataEdit.image}`);

            if (dataEdit.option_groups.length > 0) {
                const ids = dataEdit.option_groups.flatMap((group:any) => group.options.map((option:any) => option.id));
                setSelectedOptions(ids);
            }
            if (dataEdit.toppings.length > 0) {
                setSelectedTopping(dataEdit.toppings);
            }
        } else {
            reset({
              name: "",
              price: 0,
              category_id: 0,
            });
            setPriceDisplay("");
            setSelectedTopping([]);
            setSelectedOptions([]);
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen, dataEdit, reset]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
        setDataEdit(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        setSelectedTopping([]);
        setSelectedOptions([]);
        reset({ name: "", price: 0, category_id: 0 });
        setPriceDisplay("");
    }, [setIsOpen, setDataEdit, reset]);

    const onSubmit = useCallback(async (values: ProductFormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", String(values.price));
            formData.append("category_id", String(values.category_id));
            formData.append("toppings", JSON.stringify(selectedTopping));
            formData.append("options", JSON.stringify(selectedOptions));

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const result = await AdminProductService.createProduct(
                formData,
                dataEdit?.id || 0
            );

            toast.success(result.message || "Thành công");

            if (dataEdit) onUpdateSuccess(result.product);
            else onAddSuccess(result.product);

            handleCloseDialog();
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [selectedTopping, selectedOptions, selectedFile, dataEdit, onUpdateSuccess, onAddSuccess, handleCloseDialog]);

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const price = raw ? Number(raw) : 0;
        setValue("price", price, { shouldValidate: true });
        setPriceDisplay(formatNumber(raw));
    }, [setValue]);

    const filtered = dataTopping.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const isAllSelected = filtered.length > 0 && filtered.every((item) =>
            selectedTopping.some((t) => t.id === item.id)
        );

    const toggleAll = useCallback(() => {
        if (isAllSelected) {
            setSelectedTopping(
              selectedTopping.filter(
                (t) => !filtered.some((f) => f.id === t.id)
              )
            );
        } else {
            const newItems = filtered.filter(
              (item) => !selectedTopping.some((t) => t.id === item.id)
            );

            setSelectedTopping([...selectedTopping, ...newItems]);
        }
    }, [isAllSelected, filtered, selectedTopping]);

    const toggleOne = useCallback((item: ToppingType) => {
        setSelectedTopping(prev => {
            const exists = prev.some(t => t.id === item.id);
            if (exists) {
                return prev.filter(t => t.id !== item.id);
            }
            return [...prev, item];
        });
    }, []);

    const handleSelect = useCallback((optionId: number) => {
        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter((i) => i !== optionId);
            } else {
                return [...prev, optionId];
            }
        });
    }, []);

    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-1 md:p-1 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE PRODUCT":"ADD PRODUCT"}
                    </h3>
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute top-0.5 right-1 text-gray-400 bg-transparent hover:bg-gray-200 
                        hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center 
                        dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-3 px-2 py-2 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-8">
                            <div className="p-3 border border-gray-200 rounded-xl shadow-sm">
                                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                                        <div className="space-y-4">
                                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                                <label htmlFor="name" className="block text-sm font-medium col-span-2">Name <span className="text-red-500">(*)</span></label>
                                                <div className="col-span-6">
                                                    <input
                                                        id="name"
                                                        type="text"
                                                        {...register("name")}
                                                        className="w-full border px-3 py-1 rounded"
                                                    />
                                                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                                </div>
                                            </div>
                                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                                <label className="block text-sm font-medium col-span-2">
                                                    Price <span className="text-red-500">(*)</span>
                                                </label>

                                                <div className="col-span-6">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={priceDisplay}
                                                            onChange={handlePriceChange}
                                                            placeholder="0.00"
                                                            className="w-full border px-3 py-1 pr-14 rounded"
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">VNĐ</span>
                                                    </div>
                                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                                                </div>
                                            </div>
                                            <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                                <label className="block text-sm font-medium col-span-2">Category <span className="text-red-500">(*)</span></label>
                                                <div className="col-span-6">
                                                  <Controller
                                                    name="category_id"
                                                    control={control}
                                                    render={({ field }) => (
                                                      <Select
                                                        options={optionCategories}
                                                        value={optionCategories.find(opt => opt.value === field.value) || null}
                                                        onChange={(selected) => field.onChange((selected as { value: number })?.value ?? 0)}
                                                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                                                        styles={{
                                                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                            menu: (base) => ({
                                                                ...base,
                                                                fontSize: '13px',
                                                            }),
                                                        }}
                                                      />
                                                    )}
                                                  />
                                                  {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id.message}</p>}
                                                </div>
                                            </div>
                                            <div className="space-y-2 col-span-8">
                                                <label className="block text-sm font-medium">
                                                    Product Image
                                                </label>
                                                
                                                <div 
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="relative group w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all overflow-hidden"
                                                >
                                                    {previewUrl ? (
                                                        <>
                                                            <img 
                                                                src={previewUrl} 
                                                                alt="Preview" 
                                                                className="w-full h-full object-contain" 
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-white text-sm">Change Image</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center">
                                                            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <p className="mt-1 text-xs text-gray-500">Click to upload photo</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange} 
                                                    className="hidden" 
                                                    accept="image/*" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            
                            <div className="mt-2 p-3 border border-gray-200 rounded-xl shadow-sm"> 
                                <h4 className="text-sm w-full font-semibold dark:text-white pb-1"> 
                                    Option 
                                </h4> 

                                {dataOptionGroup.map((group) => (
                                    <div
                                    key={group.id}
                                    className="px-3 py-1 border border-gray-200 mt-1 bg-gray-100"
                                    >
                                        <h4 className="text-sm font-semibold dark:text-white">
                                            {group.name}
                                            {group.options.some(o => o.is_required) && (
                                            <span className="text-red-500 ml-1">*</span>
                                            )}
                                        </h4>

                                        <div className="flex gap-2 grid grid-cols-12">
                                            {group.options.map((option) => {
                                                const checked = selectedOptions.includes(option.id) || false;

                                                return (
                                                    <label
                                                    key={option.id}
                                                    className="flex col-span-3 items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type={"checkbox"}
                                                                name={`group-${group.id}`}
                                                                checked={checked}
                                                                onChange={() =>
                                                                    handleSelect(option.id)
                                                                }
                                                            />
                                                            <span className="text-sm dark:text-white">
                                                                {option.name} 
                                                            </span>
                                                            <span className="text-xs text-pink-400">
                                                                {option.price != 0 ? ` + ${formatNumber(option.price.toString())} VNĐ` : ""}
                                                            </span>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-4 p-3 border border-gray-200 rounded-xl shadow-sm">
                            <h4 className="text-sm w-full font-semibold dark:text-white pb-2">
                                Toppings
                            </h4>
                            
                            <input
                                type="text"
                                placeholder="Tìm topping..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                            />

                            <label className="flex items-center gap-2 mb-2 text-sm">
                                <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleAll}
                                />
                                All
                            </label>

                            <div className="max-h-65 overflow-y-auto space-y-2">
                                {filtered.map((item) => (
                                    <div key={item.id} className="flex gap-2 items-center">
                                        <div>
                                            <input
                                            type="checkbox"
                                            checked={selectedTopping.some(t => t.id === item.id)}
                                            onChange={() => toggleOne(item)}
                                            />
                                        </div>
                                        <div>
                                            <img
                                                src={API_BASE_URLS.ADMIN_MEDIA + (item.image ?? "")}
                                                className="w-8 h-8 object-contain transition-transform duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm">
                                                {item.name}
                                            </label>
                                            <label className="flex items-center gap-2 text-xs text-pink-400">
                                                {formatNumber(item.price.toString())} VNĐ
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <button form="product-form" type="submit" className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 px-4 py-2">
                        {dataEdit? "Save":"Add"}
                    </button>
                </div>
            </div>
        </div>
    )
})