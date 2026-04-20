'use client';

import { useCallback, useEffect} from "react";
import { toast } from "react-toastify";
import { voucherSchema } from "@/lib/validations";
import { formatDateTimeLocal } from "@/lib/helpers";
import { VoucherService } from "@/services/admin.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newItem: VoucherType) => void;
  dataEdit: VoucherType | null;
  setDataEdit: (data: VoucherType | null) => void;
  onUpdateSuccess: (updatedItem: VoucherType) => void;
}

type FormValues = {
  code: string;
  discount_type: string;
  discount_value: number;
  max_usage: number;
  expired_at: string;
  min_order_value: number;
};

export default React.memo(function VoucherDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const { 
            register, handleSubmit, reset, formState: { errors },
        } = useForm<FormValues>({
            resolver: zodResolver(voucherSchema),
            defaultValues: {
                code: "",
                discount_type: "percent",
                discount_value: 0,
                max_usage: 1,
                expired_at: "",
                min_order_value: 0
            },
        });

    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            reset({
                code: dataEdit.code,
                discount_type: dataEdit.discount_type,
                discount_value: Number(dataEdit.discount_value),
                max_usage: Number(dataEdit.max_usage),
                expired_at: formatDateTimeLocal(dataEdit.expired_at),
                min_order_value: Number(dataEdit.min_order_value),
            });
        } else {
            reset({
                code: "",
                discount_type: "percent",
                discount_value: 0,
                max_usage: 1,
                expired_at: "",
                min_order_value: 0,
            });
        }
    }, [isOpen]);

    const handleCloseDialog = useCallback(() => {
        setIsOpen(false);
        setDataEdit(null);

        reset({
            code: "",
            discount_type: "percent",
            discount_value: 0,
            max_usage: 1,
            expired_at: "",
            min_order_value: 0,
        });
    }, [setIsOpen, setDataEdit, reset]);

    const onSubmit = useCallback(async (values: FormValues) => {
        try {
            const result = await VoucherService.createVoucher(values, dataEdit?.id || 0);

            if (result &&result.voucher) {
                toast.success(result.message);
                if (dataEdit) 
                    onUpdateSuccess(result.voucher);
                else 
                    onAddSuccess(result.voucher);

                handleCloseDialog();
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        }
    }, [onUpdateSuccess, onAddSuccess, handleCloseDialog]);

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
                    <form id="voucher-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label htmlFor="code" className="block text-sm font-medium col-span-2">Code <span className="text-red-500">(*)</span></label>
                            <div className="col-span-6">
                                <input
                                    type="text"
                                    id="code"
                                    {...register("code")}
                                    className="w-full border px-3 py-1 rounded"
                                />
                                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
                            </div>
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Discount Type 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className="col-span-6">
                                <select
                                    data-testid="discount-type"
                                    {...register("discount_type")}  // Sử dụng register thay vì value/onChange
                                    className="mt-1 w-full border px-3 py-2 rounded "
                                >
                                    <option value="percent">Percent (%)</option>
                                    <option value="fixed">Fixed (VND)</option>
                                </select>
                                {errors.discount_type && <p className="text-xs text-red-500 mt-1">{errors.discount_type.message}</p>}
                            </div>
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Discount 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className="col-span-6">
                                <input
                                    type="number"
                                    data-testid="discount-value"
                                    {...register("discount_value", { valueAsNumber: true })}  // Sử dụng register, valueAsNumber cho number
                                    className="mt-1 w-full border px-3 py-2 rounded"
                                />
                                {errors.discount_value && <p className="text-xs text-red-500 mt-1">{errors.discount_value.message}</p>}
                            </div>
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Max Usage 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="number"
                                data-testid="max-usage"
                                {...register("max_usage", { valueAsNumber: true })}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                            {errors.max_usage && <p className="text-xs text-red-500 mt-1">{errors.max_usage.message}</p>}
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Min Order 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <input
                                type="number"
                                data-testid="min-order-value"
                                {...register("min_order_value", { valueAsNumber: true })}
                                className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                            />
                            {errors.min_order_value && <p className="text-xs text-red-500 mt-1">{errors.min_order_value.message}</p>}
                        </div>
                        <div className="items-center space-y-2 grid grid-cols-2 md:grid-cols-8">
                            <label className="block text-sm font-medium col-span-2">Expired At 
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className="col-span-6">
                                <input
                                    type="datetime-local"
                                    data-testid="expired-at"
                                    {...register("expired_at")}
                                    className="mt-1 w-full border px-3 py-2 rounded col-span-6"
                                />
                                {errors.expired_at && <p className="text-xs text-red-500 mt-1">{errors.expired_at.message}</p>}
                            </div>
                        </div>
                    </form>
                </div>
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <button type="submit" form="voucher-form" className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-1 cursor-pointer">
                        {dataEdit? "Save":"Add"}
                    </button>
                </div>
            </div>
        </div>
    )
})
