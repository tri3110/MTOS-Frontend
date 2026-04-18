'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { voucherSchema } from "@/lib/validations";
import { formatDateTimeLocal } from "@/lib/helpers";
import { VoucherService } from "@/services/admin.service";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newItem: VoucherType) => void;
  dataEdit: VoucherType | null;
  setDataEdit: (data: VoucherType | null) => void;
  onUpdateSuccess: (updatedItem: VoucherType) => void;
}

export default function VoucherDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const [form, setForm] = useState<VoucherType>({
        code: "",
        discount_type: "percent",
        discount_value: 0,
        max_usage: 1,
        expired_at: "",
        min_order_value: 0,
        is_active: true,
    });

    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            setForm({
                code: dataEdit.code,
                discount_type: dataEdit.discount_type,
                discount_value: Number(dataEdit.discount_value),
                max_usage: Number(dataEdit.max_usage),
                expired_at: formatDateTimeLocal(dataEdit.expired_at),
                min_order_value: Number(dataEdit.min_order_value),
                is_active: dataEdit.is_active,
            });
        }
    }, [isOpen]);

    const handleCloseDialog = () => {
        setIsOpen(false);
        setDataEdit(null);

        setForm({
            code: "",
            discount_type: "percent",
            discount_value: 0,
            max_usage: 1,
            expired_at: "",
            min_order_value: 0,
            is_active: true,
        });
    }

    const handleSubmit = async () => {
        const validate = voucherSchema.safeParse(form);

        if (!validate.success) {
            const messages = validate.error.issues[0]?.message;
            toast.error(messages);
            return false;
        }

        const result = await VoucherService.createVoucher(form, dataEdit?.id || 0);

        if (result.voucher){
            toast.success(result.message);
            if (dataEdit) 
                onUpdateSuccess(result.voucher);
            else 
                onAddSuccess(result.voucher);

            handleCloseDialog();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        const checked = (e.target as HTMLInputElement).checked;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
        }));
    };

    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE VOUCHER":"ADD VOUCHER"}
                    </h3>
                    <button onClick={() => handleCloseDialog()} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <form className="space-y-4">
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Code 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Discount Type 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <select
                                name="discount_type"
                                value={form.discount_type}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            >
                                <option value="percent">Percent (%)</option>
                                <option value="fixed">Fixed (VND)</option>
                            </select>
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Discount 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="number"
                                name="discount_value"
                                value={form.discount_value}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Max Usage 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="number"
                                name="max_usage"
                                value={form.max_usage}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Min Order 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="number"
                                name="min_order_value"
                                value={form.min_order_value}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Expired At 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="expired_at"
                                value={form.expired_at}
                                onChange={handleChange}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
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
