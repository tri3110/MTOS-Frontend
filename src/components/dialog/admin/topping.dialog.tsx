'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/helpers";
import { toast } from "react-toastify";
import { toppingSchema } from "@/lib/validations";
import { useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToppingService } from "@/services/admin.service";
import { API_BASE_URLS } from "@/lib/constants";
import React from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newItem: ToppingType) => void;
  dataEdit: ToppingType | null;
  setDataEdit: (data: ToppingType | null) => void;
  onUpdateSuccess: (updatedItem: ToppingType) => void;
}

type FormValues = {
  name: string;
  price: number;
};

export default React.memo(function ToppingDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    
    const { 
        register, handleSubmit, reset, setValue, formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(toppingSchema),
        defaultValues: {
            name: "",
            price: 0
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [priceDisplay, setPriceDisplay] = useState("");

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
            });
            setPriceDisplay(formatNumber(String(dataEdit.price)));
            setPreviewUrl(`${API_BASE_URLS.ADMIN_MEDIA}${dataEdit.image}`);
        } else {
            reset({
              name: "",
              price: 0,
            });
            setPriceDisplay("");
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen, dataEdit, reset]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
        setDataEdit(null);

        reset({ name: "", price: 0});
        setPriceDisplay("");
        setSelectedFile(null);
        setPreviewUrl(null);
        
    }, [setIsOpen, setDataEdit, reset]);

    const onSubmit = useCallback(async (values: FormValues) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("price", String(values.price));
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const result = await ToppingService.createToppings(formData, dataEdit?.id || 0);

            if (result.topping) {
                toast.success(result.message);
                if (dataEdit) 
                    onUpdateSuccess(result.topping);
                else 
                    onAddSuccess(result.topping);

                handleCloseDialog();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }, [selectedFile, dataEdit, onUpdateSuccess, onAddSuccess, handleCloseDialog]);

    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const price = raw ? Number(raw) : 0;
        setValue("price", price, { shouldValidate: true });
        setPriceDisplay(formatNumber(raw));
    }, [setValue]);

    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE TOPPING":"ADD TOPPING"}
                    </h3>
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <form id="topping-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                    <label htmlFor="price" className="block text-sm font-medium col-span-2">
                                        Price <span className="text-red-500">(*)</span>
                                    </label>

                                    <div className="col-span-6">
                                        <div className="relative">
                                            <input
                                            type="text"
                                            id="price"
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
                                <div className="space-y-2 col-span-8">
                                    <label className="block text-sm font-medium">
                                        Image
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
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <button type="submit" form="topping-form" className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </button>
                </div>
            </div>
        </div>
    )
})