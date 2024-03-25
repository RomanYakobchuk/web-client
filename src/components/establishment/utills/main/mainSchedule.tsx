import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import {IEstablishment} from "@/interfaces/common";
import {useTranslate} from "@refinedev/core";

type TProps = {
    workSchedule: IEstablishment['workSchedule']
}
export const MainSchedule = ({workSchedule}: TProps) => {

    const translate = useTranslate();

    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            p: '10px',
            borderRadius: '15px',
            justifyContent: 'start',
            bgcolor: 'modern.modern_1.main',
            alignItems: 'start',
            color: 'common.white'
        }}>
            <Typography sx={{
                fontWeight: 600,
                fontSize: '1.1rem'
            }}>
                {translate("home.create.workSchedule.title")}
            </Typography>
            <Stack sx={{
                gap: 1
            }}>
                {
                    workSchedule?.workDays?.map((workDay, index) => (
                        <Box key={index} sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: "start",
                            alignItems: 'start',
                            ml: 1
                        }}>
                            <Box
                                component="span"
                            >
                                {
                                    translate(`home.create.workSchedule.dayName.${workDay?.days?.from}.full`)
                                }
                                -
                                {
                                    translate(`home.create.workSchedule.dayName.${workDay?.days?.to}.full`)
                                }
                            </Box>
                            <Box
                                component="span"
                            >
                                {workDay?.time?.from} - {workDay?.time?.to}
                            </Box>
                        </Box>
                    ))
                }
            </Stack>
            <Typography sx={{
                mt: 1,
                fontWeight: 600
            }}>
                {translate("home.create.workSchedule.weekend.title")}
            </Typography>
            <Box sx={{
                ml: 1
            }}>
                {workSchedule?.weekend}
            </Box>
        </Box>
    );
};

