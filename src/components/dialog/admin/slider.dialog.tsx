'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sliderSchema } from "@/lib/validations";
import { SliderService } from "@/services/admin.service";
import { API_BASE_URLS } from "@/lib/constants";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newSlider: SliderType) => void;
  dataEdit: SliderType|null;
  setDataEdit: (data: SliderType|null) => void;
  onUpdateSuccess: (updatedSlider: SliderType) => void;
}

type FormValues = {
    title: string;
    order?: number;
    link?: string;
};

export default React.memo(function SliderDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    
    const { 
        register, handleSubmit, reset, formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(sliderSchema),
        defaultValues: {
            title: "",
            order: 0,
            link: "",
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            reset({
                title: dataEdit.title,
                link: dataEdit.link,
                order: dataEdit.order,
            });
            setPreviewUrl(`${API_BASE_URLS.ADMIN_MEDIA}${dataEdit.image}`)
        }
        else {
            reset({
              title: "",
              link: "",
              order: 0,
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [isOpen, dataEdit, reset]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
        setDataEdit(null);

        reset({
            title: '',
            link: '',
            order: 0,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        
    }, [setIsOpen, setDataEdit, reset]);

    const onSubmit = useCallback(async (values: FormValues) => {
        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("link", values.link || '');
            formData.append("order", String(values.order));
            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            const result = await SliderService.createSlider(formData, dataEdit?.id || 0);

            if (result.slider) {
                toast.success(result.message);
                if (dataEdit) 
                    onUpdateSuccess(result.slider);
                else 
                    onAddSuccess(result.slider);

                handleCloseDialog();
            }
        } catch (err) {
            toast.error("Create failed");
        }
    }, [selectedFile, dataEdit, onUpdateSuccess, onAddSuccess, handleCloseDialog]);
    
    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE SLIDER":"ADD SLIDER"}
                    </h3>
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <form id="slider-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                            <div className="space-y-4">
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label htmlFor="title" className="block text-sm font-medium col-span-2">Title <span className="text-red-500">(*)</span></label>
                                    <div className="col-span-6">
                                        <input
                                            id="title"
                                            type="text"
                                            autoFocus
                                            {...register("title")}
                                            className="w-full border px-3 py-1 rounded"
                                        />
                                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                                    </div>
                                </div>
                                {
                                    dataEdit && 

                                    <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                        <label htmlFor="order" className="block text-sm font-medium col-span-2">Order <span className="text-red-500">(*)</span></label>
                                        <div className="col-span-6">
                                            <input
                                                id="order"
                                                type="number"
                                                {...register("order")}
                                                className="w-full border px-3 py-1 rounded"
                                            />
                                            {errors.order && <p className="text-xs text-red-500 mt-1">{errors.order.message}</p>}
                                        </div>
                                    </div>
                                }
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label htmlFor="link" className="block text-sm font-medium col-span-2">Link</label>
                                    <div className="col-span-6">
                                        <input
                                            id="link"
                                            type="text"
                                            {...register("link")}
                                            className="w-full border px-3 py-1 rounded"
                                        />
                                        {errors.link && <p className="text-xs text-red-500 mt-1">{errors.link.message}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-8">
                                    <label className="block text-sm font-medium">
                                        Slider Image
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
                    <button form="slider-form" type="submit" className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </button>
                </div>
            </div>
        </div>
    )
})