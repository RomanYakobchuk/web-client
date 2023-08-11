import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Chip,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {Add} from "@mui/icons-material";
import {LocalizationProvider, MobileTimePicker} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer, DemoItem} from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../contexts";
import {IWorkDay} from "../../../interfaces/common";
import {buttonStyle, selectStyle, textFieldStyle} from "../../../styles";


type Props = {
    onSubmit: (item: string | any) => void;
    elements: string[] | any;
    onDelete: (index: number | any) => void;
    label: string,
    onSubmitWeekend: (item: string | any) => void,
    dataLabel: string,
    workScheduleWeekend: string
};


const ScheduleList = ({
                          onSubmit,
                          elements,
                          onDelete,
                          onSubmitWeekend,
                          label,
                          dataLabel,
                          workScheduleWeekend
                      }: Props) => {
    const translate = useTranslate();
    const [workDay, setWorkDay] = useState<IWorkDay | any>({
        days: {from: 'monday', to: 'friday'},
        time: {from: '', to: ''}
    });
    const [weekend, setWeekend] = useState<string>(workScheduleWeekend);

    useEffect(() => {
        if (workScheduleWeekend) {
            setWeekend(workScheduleWeekend)
        }
    }, [workScheduleWeekend])
    useEffect(() => {
        if (weekend) {
            onSubmitWeekend(weekend)
        }
    }, [weekend])
    const {mode} = useContext(ColorModeContext);
    const handleAddWorkDay = () => {
        if (workDay.days.from && workDay.days.to && workDay.time.from && workDay.time.to) {
            onSubmit(workDay as IWorkDay);
            setWorkDay({days: {from: '', to: ''}, time: {from: null, to: null}});
        }
    };

    return (
        <Grid container spacing={2} maxWidth={500}>
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
                                    width: "80%",
                                    justifyContent: "space-between",
                                }}>
                                    <Box sx={{
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "start",
                                        alignItems: "center",
                                        gap: 1
                                    }}>
                                        <FormControl sx={{width: '100%'}}>
                                            <Select
                                                id="demo-simple-select-1"
                                                color={"secondary"}
                                                required
                                                size={"small"}
                                                sx={{
                                                    width: "100%",
                                                    fontSize: {xs: 12, sm: 16},
                                                    ...selectStyle
                                                }}
                                                value={workDay?.days?.from ? workDay?.days?.from : "monday"}
                                                onChange={(event: any) => setWorkDay({
                                                    days: {
                                                        from: event.target.value,
                                                        to: workDay?.days?.to
                                                    },
                                                    time: {
                                                        from: workDay?.time?.from,
                                                        to: workDay?.time?.to,
                                                    }
                                                })}
                                            >
                                                <MenuItem
                                                    value={"monday"}>{translate("home.create.workSchedule.dayName.monday")}</MenuItem>
                                                <MenuItem
                                                    value={"tuesday"}>{translate("home.create.workSchedule.dayName.tuesday")}</MenuItem>
                                                <MenuItem
                                                    value={"wednesday"}>{translate("home.create.workSchedule.dayName.wednesday")}</MenuItem>
                                                <MenuItem
                                                    value={"thursday"}>{translate("home.create.workSchedule.dayName.thursday")}</MenuItem>
                                                <MenuItem
                                                    value={"friday"}>{translate("home.create.workSchedule.dayName.friday")}</MenuItem>
                                                <MenuItem
                                                    value={"saturday"}>{translate("home.create.workSchedule.dayName.saturday")}</MenuItem>
                                                <MenuItem
                                                    value={"sunday"}>{translate("home.create.workSchedule.dayName.sunday")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                        -
                                        <FormControl sx={{width: '100%'}}>
                                            <Select
                                                sx={{
                                                    width: "100%",
                                                    fontSize: {xs: 12, sm: 16},
                                                    ...selectStyle
                                                }}
                                                required
                                                size={"small"}
                                                color={"secondary"}
                                                id="demo-simple-select-2"
                                                value={workDay?.days?.to ? workDay?.days?.to : "friday"}

                                                onChange={(event: any) => setWorkDay({
                                                    days: {
                                                        from: workDay?.days?.from,
                                                        to: event.target.value
                                                    },
                                                    time: {
                                                        from: workDay?.time?.from,
                                                        to: workDay?.time?.to,
                                                    }
                                                })}
                                            >
                                                <MenuItem
                                                    value={"monday"}>{translate("home.create.workSchedule.dayName.monday")}</MenuItem>
                                                <MenuItem
                                                    value={"tuesday"}>{translate("home.create.workSchedule.dayName.tuesday")}</MenuItem>
                                                <MenuItem
                                                    value={"wednesday"}>{translate("home.create.workSchedule.dayName.wednesday")}</MenuItem>
                                                <MenuItem
                                                    value={"thursday"}>{translate("home.create.workSchedule.dayName.thursday")}</MenuItem>
                                                <MenuItem
                                                    value={"friday"}>{translate("home.create.workSchedule.dayName.friday")}</MenuItem>
                                                <MenuItem
                                                    value={"saturday"}>{translate("home.create.workSchedule.dayName.saturday")}</MenuItem>
                                                <MenuItem
                                                    value={"sunday"}>{translate("home.create.workSchedule.dayName.sunday")}</MenuItem>
                                            </Select>
                                        </FormControl>
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
                                                                p: '5px 14px',
                                                            },
                                                            ...textFieldStyle
                                                        }}
                                                        views={['hours', 'minutes']}
                                                        // defaultValue={dayjs('2022-04-17T15:30')}
                                                        value={workDay?.time?.from ? workDay?.time?.from?.toDate() : ""}
                                                        onChange={(value: any) => setWorkDay({
                                                            days: {
                                                                from: workDay?.days?.from,
                                                                to: workDay?.days?.to
                                                            },
                                                            time: {
                                                                from: value ? dayjs(value) : null,
                                                                to: workDay?.time?.to,
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
                                                                p: '5px 14px',
                                                            },
                                                            ...textFieldStyle
                                                        }}
                                                        views={['hours', 'minutes']}
                                                        value={workDay?.time?.to ? workDay?.time?.to?.toDate() : ""}
                                                        onChange={(value: any) => setWorkDay({
                                                            days: {
                                                                from: workDay?.days?.from,
                                                                to: workDay?.days?.to
                                                            },
                                                            time: {
                                                                from: workDay?.time?.from,
                                                                to: value ? dayjs(value) : null,
                                                            }
                                                        })}
                                                    />
                                                </DemoItem>
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Button sx={buttonStyle} variant="contained" color={"info"} onClick={handleAddWorkDay}>
                                    <Add/>
                                </Button>
                            </Box>
                        </FormControl>
                    </Box>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                {elements?.length > 0 ? elements?.map((element: IWorkDay, index: any) => (
                    <Chip
                        key={index}
                        label={`${translate(`home.create.workSchedule.dayName.${element?.days?.from}`)}-${translate(`home.create.workSchedule.dayName.${element?.days?.to}`)}     ${dayjs(element?.time?.from).format("HH:mm")}-${dayjs(element?.time?.to).format("HH:mm")}`}
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
                )) : ''}
            </Grid>
            <Grid item xs={12} gap={2} sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <FormControl fullWidth>
                    <FormHelperText
                        sx={{
                            fontWeight: 500,
                            margin: "10px 0",
                            fontSize: {xs: 12, sm: 16},
                            color: mode === "dark" ? "#fcfcfc" : "#11142D",
                        }}
                    >
                        {label}
                    </FormHelperText>
                    <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        color={"secondary"}
                        size={"small"}
                        variant="outlined"
                        sx={textFieldStyle}
                        placeholder={`${translate("home.create.workSchedule.weekend.example")}: 01.01, 07.01, ...`}
                        value={weekend ? weekend : ''}
                        onChange={(e: any) => setWeekend(e.target.value)}
                    />
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default ScheduleList;

