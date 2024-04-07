import React, {Dispatch, SetStateAction} from "react";
import { styled } from '@mui/material/styles';
import {Rating} from "@mui/material";
import {StarBorderRounded, StarHalfRounded, StarRounded} from "@mui/icons-material";


type TProps = {
    value: number | null,
    disabled?: boolean,
    onChange?: (value: number | null) => void,
    readOnly?: boolean,
    precision?: number,
    size?: number
}
export const StarRating = ({value, disabled = false, size = 45, precision = 0.5, onChange, readOnly = false}: TProps) => {

    return (
        <div>
            <Rating
                sx={{
                    '& .MuiRating-iconFilled': {
                        color: 'info.main',
                    },
                    '& .MuiRating-iconHover': {
                        color: 'cornflowerblue',
                    },
                    "& span svg":{
                        width: `${size}px`,
                        height: `${size}px`,
                    }
                }}
                precision={precision} size={"large"}
                value={value}
                readOnly={readOnly}
                disabled={disabled}
                onChange={(_, value) => {
                    if (!readOnly && onChange) {
                        onChange(value)
                    }
                }}
                emptyIcon={<StarBorderRounded fontSize={'inherit'}/>}
                icon={<StarRounded fontSize={'inherit'}/>}
            />
        </div>
    );
};

