import {
    Box,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
    Switch,
    OutlinedInputProps, FilledInputProps
} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {ChangeEvent, Dispatch, SetStateAction, useEffect, useState} from "react";

import {IFreeSeatsProps} from "../../../../interfaces/common";
import {ESTABLISHMENT} from "@/config/names";


type TProps = {
    freeSeats: IFreeSeatsProps,
    setFreeSeats: Dispatch<SetStateAction<IFreeSeatsProps>>
}

const SearchByFreeSeats = ({setFreeSeats, freeSeats}: TProps) => {

    const translate = useTranslate();

    const [currentFreeSeats, setCurrentFreeSeats] = useState({} as IFreeSeatsProps);

    useEffect(() => {
        if (freeSeats) {
            setCurrentFreeSeats(freeSeats)
        }
    }, [freeSeats]);

    const size = 'small';

    const handleChangeValue = (event: SelectChangeEvent | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCurrentFreeSeats((prevState) => ({...prevState, [event.target.name]: event.target.name === 'status' ? event.target.value : Number(event.target.value)}))
    }
    const handleChangeIsCombine = (event: ChangeEvent<HTMLInputElement>) => {
        setCurrentFreeSeats((prevState) => ({...prevState, isCombineTheSeats: event.target.checked}))
    }
    const handleClickChange = () => {
        setFreeSeats(currentFreeSeats)
    }
    const InputProps: Partial<FilledInputProps> | Partial<OutlinedInputProps> = {
        inputMode: "numeric",
        inputProps: {min: 0}
    };

    return (
        <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'},
            gap: 2,
            '& div': {
                width: '100%',
                maxWidth: '350px'
            },
            "& div.MuiInputBase-root":{
                borderRadius: '7px'
            }
        }}>
            <Box>
                <Typography>
                    {translate(`${ESTABLISHMENT}.freeSeats.isCombine`)}
                </Typography>
                <Switch
                    color={'info'}
                    sx={{
                        "& span.MuiSwitch-track": {
                            bgcolor: currentFreeSeats['isCombineTheSeats'] ? 'info.main' : 'common.white'
                        }
                    }}
                    checked={currentFreeSeats['isCombineTheSeats'] ?? false}
                    onChange={handleChangeIsCombine}
                    inputProps={{'aria-label': 'controlled'}}
                    size={'medium'}
                />
            </Box>
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
                    type={"number"}
                    InputProps={InputProps}
                />
            </Box>
            <Box>
                <Typography>
                    {translate(`${ESTABLISHMENT}.freeSeats.statusOfSeats.title`)}
                </Typography>
                <Select
                    value={currentFreeSeats['status'] ?? ' '}
                    size={'small'}
                    name={'status'}
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
