'use client';

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/helpers";
import { toast } from "react-toastify";
import { sliderSchema } from "@/lib/validations";
import { SliderService } from "@/services/admin.service";
import { API_BASE_URLS } from "@/lib/constants";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newSlider: SliderType) => void;
  dataEdit: SliderType|null;
  setDataEdit: (data: SliderType|null) => void;
  onUpdateSuccess: (updatedSlider: SliderType) => void;
}

interface SliderTypeAdd {
  title: string;
  image: string | null;
  link: string;
  order: number;
}

export default function SliderDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const [form, setForm] = useState<SliderTypeAdd>({
        title: '',
        image: '',
        link: '',
        order: 0,
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
            setForm({
                title: dataEdit.title,
                image: dataEdit.image,
                link: dataEdit.link,
                order: dataEdit.order,
            });
            setPreviewUrl(`${API_BASE_URLS.ADMIN_MEDIA}${dataEdit.image}`)
        }
    }, [isOpen]);

    const handleCloseDialog = () => {
        setIsOpen(false);
        setDataEdit(null);

        setForm({
            title: '',
            image: '',
            link: '',
            order: 0,
        });
    }

    const handleSubmit = async () => {
        const validate = sliderSchema.safeParse(form);

        if (!validate.success) {
            const messages = validate.error.issues[0]?.message;
            toast.error(messages);
            return false;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("link", String(form.link));
        formData.append("order", String(form.order));
        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        const result = await SliderService.createSlider(formData, dataEdit?.id || 0);

        if (result.slider){
            toast.success(result.message);
            if (dataEdit) 
                onUpdateSuccess(result.slider);
            else 
                onAddSuccess(result.slider);

            handleCloseDialog();
        }
        else{
            toast.error(result.type[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "price") {
            const raw = value.replace(/\D/g, "");

            setForm((prev) => ({
                ...prev,
                price: raw ? Number(raw) : 0,
                priceDisplay: formatNumber(raw)
            }));
        } else {
            setForm((prev) => ({
            ...prev,
            [name]: value,
            }));
        }
    };
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
                    <form onSubmit={handleCloseDialog} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-12">
                            <div className="space-y-4">
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Title <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        autoFocus
                                        value={form.title}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                    />
                                </div>
                                {
                                    dataEdit && 
                                    <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                        <label className="block text-sm font-medium col-span-2">
                                            Order <span className="text-red-500">(*)</span>
                                        </label>
                                        <div className="relative col-span-6">
                                            <input
                                            type="text"
                                            name="order"
                                            value={form.order}
                                            onChange={handleChange}
                                            className="w-full border px-3 py-2 pr-14 rounded"
                                            />
                                        </div>
                                    </div>
                                }
                                
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">
                                        Link
                                    </label>
                                    <div className="relative col-span-6">
                                        <input
                                        type="text"
                                        name="link"
                                        value={form.link}
                                        onChange={handleChange}
                                        className="w-full border px-3 py-2 pr-14 rounded"
                                        />
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
                    <div onClick={()=>handleSubmit()} className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </div>
                </div>
            </div>
        </div>
    )
}