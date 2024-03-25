import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    OutlinedInputProps, FilledInputProps, SxProps
} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import React, {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";
import {Switch} from "antd";

import {IFreeSeatsProps} from "@/interfaces/common";
import {ESTABLISHMENT} from "@/config/names";


type TProps = {
    freeSeats: IFreeSeatsProps,
    setFreeSeats: Dispatch<SetStateAction<IFreeSeatsProps>>,
    styles?: SxProps
}

const SearchByFreeSeats = ({setFreeSeats, freeSeats, styles}: TProps) => {

    const translate = useTranslate();

    const [currentFreeSeats, setCurrentFreeSeats] = useState<IFreeSeatsProps>({} as IFreeSeatsProps);
    useEffect(() => {
        if (freeSeats) {
            setCurrentFreeSeats(freeSeats)
        }
    }, [freeSeats]);

    const size = 'small';

    const handleChangeValue = (event: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentFreeSeats((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.name === 'status' ? event.target.value : Number(event.target.value)
        }))
    }
    const handleChangeIsCombine = (checked: boolean) => {
        setCurrentFreeSeats((prevState) => ({...prevState, isCombineTheSeats: checked}))
    }
    console.log(currentFreeSeats)
    const handleClickChange = () => {
        setFreeSeats(currentFreeSeats)
    }
    const InputProps: Partial<FilledInputProps> | Partial<OutlinedInputProps> = {
        inputMode: "numeric",
        inputProps: {min: 0}
    };

    const color = 'secondary';
    return (
        <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
            gap: 2,
            '& div': {
                width: '100%',
                // maxWidth: '350px'
            },
            "& div.MuiInputBase-root": {
                borderRadius: '7px'
            },
            ...styles
        }}>
            <Box>
                <Typography>
                    {translate(`${ESTABLISHMENT}.freeSeats.isCombine`)}
                </Typography>
                <Switch
                    // defaultChecked={false}
                    // disabled={isAllowedUser}
                    checked={currentFreeSeats['isCombineTheSeats'] ?? false}
                    onChange={(checked) => {
                        handleChangeIsCombine(checked)
                    }}
                />
                {/*<Switch*/}
                {/*    color={'info'}*/}
                {/*    sx={{*/}
                {/*        "& span.MuiSwitch-track": {*/}
                {/*            bgcolor: currentFreeSeats['isCombineTheSeats'] ? 'info.main' : 'common.white'*/}
                {/*        }*/}
                {/*    }}*/}
                {/*    checked={isCombineTheSeats ?? false}*/}
                {/*    onChange={(_, checked) => {*/}
                {/*        console.log(checked)*/}
                {/*        handleChangeIsCombine(checked)*/}
                {/*    }}*/}
                {/*    inputProps={{'aria-label': 'controlled'}}*/}
                {/*    size={'medium'}*/}
                {/*/>*/}
            </Box>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    gap: 1
                }}
            >
                <Box>
                    <Typography>
                        {translate(`${ESTABLISHMENT}.freeSeats.tableNumber`)}
                    </Typography>
                    <TextField
                        name={'table'}
                        value={currentFreeSeats['table'] ?? ""}
                        onChange={handleChangeValue}
                        size={size}
                        InputProps={InputProps}
                        type={"number"}
                        color={color}
                    />
                </Box>
                <Box>
                    <Typography>
                        {translate(`${ESTABLISHMENT}.freeSeats.numberOfSeats`)}
                    </Typography>
                    <TextField
                        name={'numberOfSeats'}
                        value={currentFreeSeats['numberOfSeats'] ?? ""}
                        onChange={handleChangeValue}
                        size={size}
                        color={color}
                        type={"number"}
                        InputProps={InputProps}
                    />
                </Box>
            </Box>
            <Box>
                <Typography>
                    {translate(`${ESTABLISHMENT}.freeSeats.statusOfSeats.title`)}
                </Typography>
                <Select
                    value={currentFreeSeats['status'] || ' '}
                    size={'small'}
                    name={'status'}
                    color={color}
                    onChange={(event) => handleChangeValue(event)}
                >
                    {
                        [
                            {
                                v: "free",
                                title: "free"
                            },
                            {
                                v: "reserved",
                                title: "reserved"
                            },
                            {
                                v: ' ',
                                title: "all"
                            },
                        ]?.map((item) => (
                            <MenuItem
                                key={item.title}
                                value={item.v}
                            >
                                {translate(`${ESTABLISHMENT}.freeSeats.statusOfSeats.${item.title}`)}
                            </MenuItem>
                        ))
                    }
                </Select>
            </Box>
        </Box>
    );
};
export default SearchByFreeSeats;
