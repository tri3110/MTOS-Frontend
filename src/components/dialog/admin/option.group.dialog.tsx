'use client';

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { optionSchema } from "@/lib/validations";
import { OptionGroupService } from "@/services/admin.service";

interface Props {
  isOpen: boolean;
  setIsOpen: (value:boolean) => void ;
  onAddSuccess: (newItem: OptionGroupType) => void;
  dataEdit: OptionGroupType | null;
  setDataEdit: (data: OptionGroupType | null) => void;
  onUpdateSuccess: (updatedItem: OptionGroupType) => void;
}

interface OptionFormItem {
    name: string;
    price: number;
}

interface TypeAdd {
    name: string;
    is_multiple: boolean;
    options: OptionFormItem[];
}

export default function OptionGroupDialogAdd(props: Props) {
    const {isOpen, setIsOpen, onAddSuccess, dataEdit, setDataEdit, onUpdateSuccess} = props
    const [form, setForm] = useState<TypeAdd>({
        name: "",
        is_multiple: false,
        options: [{ name: "", price: 0 }],
    });


    useEffect(() => {
        if (!isOpen) return;

        if (dataEdit) {
            setForm({
            name: dataEdit.name,
            is_multiple: dataEdit.is_multiple,
            options: dataEdit.options.map(o => ({
                    name: o.name,
                    price: o.price
                }))
            });
        } else {
            setForm({
                name: "",
                is_multiple: false,
                options: [{ name: "", price: 0 }],
            });
        }
    }, [isOpen, dataEdit]);

    const handleCloseDialog = () => {
        setIsOpen(false);
        setDataEdit(null);

        setForm({
            name: "",
            is_multiple: false,
            options: [{ name: "", price: 0 }],
        });
    }

    const handleSubmit = async () => {
        const validate = optionSchema.safeParse(form);

        if (!validate.success) {
            validate.error.issues.forEach((err) => {
                toast.error(err.message);
            });
            return;
        }

        const result = await OptionGroupService.createOptionGroup(form, dataEdit?.id || 0);

        if (result.option) {
            if (dataEdit) onUpdateSuccess(result.option);
            else onAddSuccess(result.option);

            toast.success("Success");
            handleCloseDialog();
        }
    };

    const addOption = () => {
        setForm(prev => ({
            ...prev,
            options: [...prev.options, { name: "", price: 0 }]
        }));
    };

    const removeOption = (index: number) => {
        setForm(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
        }));
    };

    const handleOptionChange = (index: number, field: keyof OptionFormItem, value: any) => {
        setForm(prev => ({
            ...prev,
            options: prev.options.map((opt, i) =>
            i === index ? { ...opt, [field]: value } : opt
            )
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value,}));
    };

    return(
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {dataEdit? "UPDATE OPTION":"ADD OPTION"}
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
                        
                        <div className="grid grid-cols-8 items-center gap-2">
                            <label className="col-span-2 text-sm font-medium">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="col-span-6 border px-3 py-2 rounded"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Options</span>
                                <button
                                type="button"
                                onClick={addOption}
                                className="text-sm bg-green-500 text-white px-3 py-1 rounded"
                                >
                                + Add
                                </button>
                            </div>

                            {form.options.map((opt, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="Option name"
                                        value={opt.name}
                                        onChange={(e) =>
                                        handleOptionChange(index, "name", e.target.value)
                                        }
                                        className="col-span-6 border px-2 py-1 rounded"
                                    />

                                    <input
                                        type="number"
                                        placeholder="Price"
                                        value={opt.price}
                                        onChange={(e) =>
                                        handleOptionChange(index, "price", Number(e.target.value))
                                        }
                                        className="col-span-4 border px-2 py-1 rounded"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="col-span-2 text-red-500"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
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