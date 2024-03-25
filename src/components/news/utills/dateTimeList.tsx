import React, {useContext, useState} from "react";
import {Box, Button, Chip, FormControl, FormHelperText, Grid, SxProps, TextField} from "@mui/material";
import dayjs from "dayjs";
import {Add} from "@mui/icons-material";
import {DatePicker} from "antd";

import {ColorModeContext} from "../../../contexts";
import {INewsDateEvent} from "../../../interfaces/common";
import {useTranslate} from "@refinedev/core";
import {antdInputStyle} from "../../../styles";


type Props = {
    onSubmit: (item: string | any) => void;
    elements: string[] | any;
    onDelete: (index: number | any) => void;
    dataLabel: string,
    style?: SxProps
};
const DateTimeList = ({onSubmit, elements, onDelete, dataLabel, style}: Props) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();

    const [dateEvent, setDateEvent] = useState<INewsDateEvent>({} as INewsDateEvent);

    const handleAddWorkDay = () => {
        onSubmit(dateEvent);
        setDateEvent({} as INewsDateEvent)
    };
    const size = 'small';
    return (
        <Grid sx={{
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', sm: 'repeat(2, 1fr)'},
            gap: 1,
            p: '10px',
            m: '10px 0',
            borderRadius: '10px',
            // bgcolor: mode === 'dark' ? '#1f1f1f' : '#f6f6f6',
            alignItems: 'start',
            "& div.MuiGrid-item": {
                pl: '0',
                pt: '0'
            },
            ...style
        }}>
            <Grid item gap={2} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <FormControl fullWidth>
                    <Box sx={{
                        width: "100%",
                    }}>
                        <FormControl fullWidth sx={{
                            fontWeight: 500,
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}>
                            <FormHelperText
                                sx={{
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    fontSize: {xs: 12, sm: 16},
                                    color: mode === "dark" ? "#fcfcfc" : "#11142D",
                                }}
                            >
                                {dataLabel}
                            </FormHelperText>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                gap: 2,
                                width: '1005'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {xs: "column", sm: "row"},
                                    alignItems: 'center',
                                    flexWrap: "wrap",
                                    gap: "20px",
                                    justifyContent: "space-between",
                                    "& div.css-1u3bzj6-MuiFormControl-root-MuiTextField-root": {
                                        width: '100%',
                                    }
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: 1,
                                        ...antdInputStyle,
                                        "& div.ant-picker": {
                                            bgcolor: 'transparent',
                                        },
                                        "& input::placeholder": {
                                            color: mode === 'dark' ? '#fff !important' : '#000 !important'
                                        },
                                        "& span.ant-picker-suffix": {
                                            color: mode === 'dark' ? '#fff !important' : '#000 !important'
                                        }
                                    }}>
                                        <FormControl fullWidth>
                                            <DatePicker
                                                value={dateEvent?.schedule?.from ? dayjs(dateEvent?.schedule?.from) : null}
                                                onChange={(_, dateString) => {
                                                    setDateEvent((prevState) => ({
                                                        ...prevState,
                                                        schedule: {
                                                            from: dateString as string,
                                                            to: prevState?.schedule?.to as string
                                                        }
                                                    }))
                                                }}
                                            />
                                        </FormControl>
                                        -
                                        <FormControl fullWidth>
                                            <DatePicker
                                                value={dateEvent?.schedule?.to ? dayjs(dateEvent?.schedule?.to) : null}
                                                onChange={(_, dateString) => {
                                                    setDateEvent((prevState) => {
                                                        return {
                                                            ...prevState,
                                                            schedule: {
                                                                from: prevState?.schedule?.from as string,
                                                                to: dateString as string,
                                                            }
                                                        }
                                                    })
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        <FormControl fullWidth>
                                            <TextField
                                                size={size}
                                                type={'time'}
                                                value={dateEvent?.time?.from ?? ''}
                                                onChange={(event) => setDateEvent((prevState) => ({
                                                    ...prevState,
                                                    time: {
                                                        from: event.target.value,
                                                        to: dateEvent?.time?.to,
                                                    }
                                                }))}
                                            />
                                        </FormControl>
                                        -
                                        <FormControl fullWidth>
                                            <TextField
                                                type={'time'}
                                                size={size}
                                                value={dateEvent?.time?.to ?? ''}
                                                onChange={(event) => setDateEvent((prevState) => ({
                                                    ...prevState,
                                                    time: {
                                                        from: dateEvent?.time?.from,
                                                        to: event.target.value,
                                                    }
                                                }))}
                                            />
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    color={"info"} onClick={handleAddWorkDay}>
                                    <Add/>
                                </Button>
                            </Box>
                        </FormControl>
                    </Box>
                </FormControl>
            </Grid>
            <Grid item>
                <FormHelperText
                    sx={{
                        fontWeight: 400,
                        textTransform: 'lowercase',
                        margin: "10px 0",
                        fontSize: {xs: 12, sm: 16},
                        color: mode === "dark" ? "#fcfcfc" : "#11142D",
                    }}
                >
                    {translate('actions.list')}
                </FormHelperText>
                {elements?.map((element: any, index: any) => (
                    <Chip
                        key={index}
                        label={
                            `${element?.schedule?.from ? dayjs(element?.schedule?.from).format('YYYY-MM-DD') : ''}${(element?.schedule?.from && element?.schedule?.to ? '-' : '') + (element?.schedule?.to ? dayjs(element?.schedule?.to).format('YYYY-MM-DD') : '')}`
                            + '   ' +
                            `${element?.time?.from ?? ''}${(element?.time?.from && element?.time?.to ? '-' : '') + (element?.time?.to ? element?.time?.to : '')}`
                        }
                        onDelete={() => onDelete(index)}
                        size={"small"}
                        sx={{
                            p: "5px",
                            fontSize: '16px',
                            m: 0.5,
                            color: (theme) => theme.palette.secondary.main,
                            borderColor: mode === "dark" ? '#fcfcfc' : '#314d63'
                        }}
                        variant="outlined"
                    />
                ))}
            </Grid>
        </Grid>
    );
};
export default DateTimeList;
