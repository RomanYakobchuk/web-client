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
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../../contexts";
import {IWorkDay} from "../../../../interfaces/common";
import {selectStyle, textFieldStyle} from "../../../../styles";


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
        const {mode} = useContext(ColorModeContext);

        const [workDay, setWorkDay] = useState<IWorkDay>({
            days: {from: 1, to: 5},
            time: {from: '08:00', to: '21:00'}
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
        const handleAddWorkDay = () => {
            if (workDay.days.from && workDay.days.to && workDay.time.from && workDay.time.to) {
                onSubmit(workDay as IWorkDay);
                setWorkDay({days: {from: 1, to: 5}, time: {from: "08:00", to: "21:00"}});
            }
        };

        return (
            <Grid container spacing={2} sx={{
                display: 'grid',
                gridTemplateColumns: {xs: '1fr', md: 'repeat(2, 1fr)'},
                gap: 1,
                alignItems: 'center'
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
                                        justifyContent: "space-between",
                                        "& div.css-1u3bzj6-MuiFormControl-root-MuiTextField-root":{
                                            width: '100%',
                                        }
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
                                                    value={workDay?.days?.from ? workDay?.days?.from : 1}
                                                    onChange={(event: any) => setWorkDay((prevState) => ({
                                                        ...prevState,
                                                        days: {
                                                            from: event.target.value,
                                                            to: workDay?.days?.to
                                                        }
                                                    }))}
                                                >
                                                    {
                                                        [1, 2, 3, 4, 5, 6, 7].map((value) => (
                                                                <MenuItem
                                                                    key={value}
                                                                    value={value}
                                                                >{translate(`home.create.workSchedule.dayName.${value}.full`)}</MenuItem>
                                                            )
                                                        )
                                                    }
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
                                                    value={workDay?.days?.to ? workDay?.days?.to : 5}
                                                    onChange={(event: any) => setWorkDay((prevState) => ({
                                                        ...prevState,
                                                        days: {
                                                            from: workDay?.days?.from,
                                                            to: event.target.value
                                                        }
                                                    }))}
                                                >
                                                    {
                                                        [1, 2, 3, 4, 5, 6, 7].map((value) => (
                                                                <MenuItem
                                                                    key={value}
                                                                    value={value}
                                                                >{translate(`home.create.workSchedule.dayName.${value}.full`)}</MenuItem>
                                                            )
                                                        )
                                                    }
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
                                            <TextField
                                                type={'time'}
                                                size={'small'}
                                                sx={{
                                                    width: '100%'
                                                }}
                                                value={workDay?.time?.from ?? "08:00"}
                                                onChange={(event: any) => setWorkDay((prevState) => (
                                                        {
                                                            ...prevState,
                                                            time: {
                                                                from: event.target.value ?? "08:00",
                                                                to: workDay?.time?.to,
                                                            }
                                                        }
                                                    )
                                                )
                                                }
                                            />
                                            -
                                            <TextField
                                                type={'time'}
                                                size={'small'}
                                                sx={{
                                                    width: '100%'
                                                }}
                                                value={workDay?.time?.to ?? "08:00"}
                                                onChange={(event) => setWorkDay((prevState) => (
                                                    {
                                                        ...prevState,
                                                        time: {
                                                            from: workDay?.time?.from,
                                                            to: event.target.value ?? "21:00",
                                                        }
                                                    }
                                                ))
                                                }
                                            />
                                        </Box>
                                    </Box>
                                    <Button sx={{}} variant="contained" color={"info"} onClick={handleAddWorkDay}>
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
                            label={`${translate(`home.create.workSchedule.dayName.${element?.days?.from}.full`)}-${translate(`home.create.workSchedule.dayName.${element?.days?.to}.full`)}     ${element?.time?.from}-${element?.time?.to}`}
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
        )
            ;
    }
;

export default ScheduleList;

