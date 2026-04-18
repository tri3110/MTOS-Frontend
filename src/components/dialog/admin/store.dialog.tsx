'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { storeSchema } from "@/lib/validations";
import { StoreService } from "@/services/admin.service";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newItem: StoreType) => void;
  dataEdit: StoreType|null;
  setDataEdit: (data: StoreType|null) => void;
  onUpdateSuccess: (updatedItem: StoreType) => void;
}

export default function StoreDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const [form, setForm] = useState<StoreType>({
        name: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            setForm({
                name: dataEdit.name,
                address: dataEdit.address,
                phone: dataEdit.phone,
            });
        }
    }, [isOpen]);

    const handleCloseDialog = () => {
        setIsOpen(false);
        setDataEdit(null);

        setForm({
            name: "",
            address: "",
            phone: "",
        });
    }

    const handleSubmit = async () => {
        const validate = storeSchema.safeParse(form);

        if (!validate.success) {
            const messages = validate.error.issues[0]?.message;
            toast.error(messages);
            return false;
        }

        const result = await StoreService.createStore(form, dataEdit?.id || 0);
        
        if (result.store){
            toast.success(result.message);
            if (dataEdit) 
                onUpdateSuccess(result.store);
            else 
                onAddSuccess(result.store);

            handleCloseDialog();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE STORE":"ADD STORE"}
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
                                    <label className="block text-sm font-medium col-span-2">Name <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        autoFocus
                                        value={form.name}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                    />
                                </div>
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Address <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                    />
                                </div>
                                <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                                    <label className="block text-sm font-medium col-span-2">Phone <span className="text-red-500">(*)</span></label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <div onClick={()=>handleSubmit()} className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-1 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </div>
                </div>
            </div>
        </div>
    )
}