import { forwardRef, useImperativeHandle, useState } from "react";
import Select, { SingleValue } from 'react-select';

const CustomDropdownEditor = forwardRef((props: any, ref: any) => {
    const initial = props.values.find((opt: any) => opt.value === props.value) || null;
    const [selected, setSelected] = useState<SingleValue<OptionType>>(initial);

    const handleChange = (option: SingleValue<OptionType>) => {
        setSelected(option);

        if (props.onSelectChange) {
            props.onSelectChange(option, props);
        }
    };

    return (
        <Select
            autoFocus
            options={props.values}
            value={selected}
            onChange={(option) => {
                handleChange(option)
            }}
            menuPortalTarget={document.body}
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                menu: (base) => ({
                    ...base,
                    fontSize: '13px',
                    marginTop: -3,
                }),
            }}
        />
    );
});

export default CustomDropdownEditor;