import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import React from "react";
import {IReserve} from "@/interfaces/common";
import {useTranslate} from "@refinedev/core";

type TProps = {
    value: IReserve['userStatus']['value'],
    disabled: boolean,
    label: string,
    onChange: (event: SelectChangeEvent<any>) => void
}
const ChooseNewStatus = ({value, disabled, label, onChange}: TProps) => {
    const translate = useTranslate();
    return (
        <FormControl fullWidth>
            <InputLabel
                id={'StatusLabel'}>{label}</InputLabel>
            <Select
                size={"small"}
                disabled={disabled}
                value={value || "draft"}
                labelId={'StatusLabel'}
                label={label}
                onChange={(event) => onChange(event)}
            >
                {
                    [
                        {
                            label: "accepted",
                            value: "accepted",
                        },
                        {
                            label: "draft",
                            value: "draft",
                        },
                        {
                            label: "rejected",
                            value: "rejected",
                        },
                    ]?.map((item) => (
                        <MenuItem
                            value={item?.value}
                            key={item?.value}
                        >
                            {translate(`capl.status.${item?.label}`)}
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    );
};
export default ChooseNewStatus
