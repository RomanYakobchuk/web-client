import {useTranslate} from "@refinedev/core";
import React, {useContext, useState} from "react";
import {ColorModeContext} from "../../../contexts";
import {Box, Button, Chip, FormControl, FormHelperText, Grid} from "@mui/material";
import {DatePicker, LocalizationProvider, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer, DemoItem} from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import {Add} from "@mui/icons-material";


type Props = {
    onSubmit: (item: string | any) => void;
    elements: string[] | any;
    onDelete: (index: number | any) => void;
    dataLabel: string
};
const DateTimeList = ({onSubmit, elements, onDelete, dataLabel}: Props) => {
    const translate = useTranslate();

    const [dateEvent, setDateEvent] = useState<any>({
        schedule: {from: '', to: ''},
        time: {from: null, to: null}
    });

    const {mode} = useContext(ColorModeContext);

    const handleAddWorkDay = () => {
        onSubmit(dateEvent);
        setDateEvent({
            schedule: {from: '', to: ''},
            time: {from: "", to: ""}
        })
    };

    return (
        <Grid container spacing={2} sx={{
            width: {xs: '100%', sm: '50%'},
            maxWidth: '500px'
        }}>
            <Grid item xs={12} gap={2} sx={{
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
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                gap: 2
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {xs: "column", sm: "row"},
                                    alignItems: 'center',
                                    flexWrap: "wrap",
                                    gap: "20px",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                sx={{
                                                    "> div": {
                                                        fontSize: '14px'
                                                    },
                                                    "> div > input":{
                                                        p: '7px 10px'
                                                    }
                                                }}
                                                views={['year', 'month', 'day']}
                                                value={dateEvent?.schedule?.from ? dateEvent?.schedule?.from : ""}
                                                onChange={(value) => {
                                                    setDateEvent({
                                                        schedule: {
                                                            from: value,
                                                            to: dateEvent?.schedule?.to
                                                        },
                                                        time: {
                                                            from: dateEvent?.time?.from,
                                                            to: dateEvent?.time?.to,
                                                        }
                                                    })
                                                }}
                                            />
                                        </LocalizationProvider>
                                        -
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                sx={{
                                                    "> div": {
                                                        fontSize: '14px'
                                                    },
                                                    "> div > input":{
                                                        p: '7px 10px'
                                                    }
                                                }}
                                                views={['year', 'month', 'day']}
                                                value={dateEvent?.schedule?.to ? dateEvent?.schedule?.to : ''}
                                                onChange={(value) => {
                                                    setDateEvent({
                                                        schedule: {
                                                            from: dateEvent?.schedule?.from,
                                                            to: value,
                                                        },
                                                        time: {
                                                            from: dateEvent?.time?.from,
                                                            to: dateEvent?.time?.to,
                                                        }
                                                    })
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={[
                                                    'MobileTimePicker',
                                                ]}
                                                sx={{
                                                    width: "50%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }}
                                            >
                                                <DemoItem label={translate("")}>
                                                    <MobileTimePicker
                                                        sx={{
                                                            width: "100%", color: "info",
                                                            p: 0,
                                                            "input": {
                                                                p: '5px 14px'
                                                            }
                                                        }}
                                                        views={['hours', 'minutes']}
                                                        defaultValue={dayjs('2022-04-17T15:30')}
                                                        value={dateEvent?.time?.from ?? ""}
                                                        onChange={(value: any) => setDateEvent({
                                                            days: {
                                                                from: dateEvent?.schedule?.from,
                                                                to: dateEvent?.schedule?.to
                                                            },
                                                            time: {
                                                                from: value,
                                                                to: dateEvent?.time?.to,
                                                            }
                                                        })}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                        -
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer
                                                components={[
                                                    'MobileTimePicker',
                                                ]}
                                                sx={{
                                                    width: "50%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: 'center',
                                                    alignItems: "center"
                                                }}
                                            >
                                                <DemoItem label={translate("")}>
                                                    <MobileTimePicker
                                                        sx={{
                                                            width: "100%", color: "info",
                                                            p: 0,
                                                            "input": {
                                                                p: '5px 14px'
                                                            }
                                                        }}
                                                        views={['hours', 'minutes']}
                                                        defaultValue={dayjs('2022-04-17T15:30')}
                                                        value={dateEvent?.time?.to ?? ""}
                                                        onChange={(value: any) => setDateEvent({
                                                            days: {
                                                                from: dateEvent?.schedule?.from,
                                                                to: dateEvent?.schedule?.to
                                                            },
                                                            time: {
                                                                from: dateEvent?.time?.from,
                                                                to: value,
                                                            }
                                                        })}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Button variant="contained" color={"info"} onClick={handleAddWorkDay}>
                                    <Add/>
                                </Button>
                            </Box>
                        </FormControl>
                    </Box>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                {elements?.map((element: any, index: any) => (
                    <Chip
                        key={index}
                        label={
                            `${element?.schedule?.from ? dayjs(element?.schedule?.from).format("DD/MM/YYYY") : ''}${element?.schedule?.to ? `-` + dayjs(element?.schedule?.to).format("DD/MM/YYYY") : ''}`
                            + '   ' +
                            `${element?.time?.from ? dayjs(element?.time?.from).format("HH:mm") : ''}${element.time.to ? `-` + dayjs(element?.time?.to).format("HH:mm") : ''}`
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
