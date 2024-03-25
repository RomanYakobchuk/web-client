import {IEstablishment} from "@/interfaces/common";
import {Box} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {useMobile} from "@/hook";
import {ColorModeContext} from "@/contexts";

type TProps = {
    workSchedule: IEstablishment['workSchedule'],
    slicedNumber?: number,
    parentWidth?: number
}
export const CardSchedules = ({workSchedule, slicedNumber, parentWidth}: TProps) => {

    const translate = useTranslate();

    const {width} = useMobile();
    const {collapsed} = useContext(ColorModeContext);
    const [slices, setSlices] = useState<number>(2);

    useEffect(() => {
        const n = slicedNumber ? slicedNumber : parentWidth ? Math.floor((parentWidth - 32) / 112) : width < 1400 ? width < 600 ? Math.floor((width - 70) / 112) : width < 900 ? Math.floor((width - 336) / 112) : (collapsed ? Math.floor((width - 390) / 160) : Math.floor((width - 590) / 112)) : 4;
        setSlices(n);
    }, [parentWidth, slicedNumber]);
    const {workDays} = workSchedule;
    const workDaysArray = workDays?.slice(0, slices);

    return (
        <Box sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'start',
            width: '100%',
        }}>
            {
                workDaysArray?.length > 0 && workDaysArray?.map((workDay, index) => (
                    <Box
                        key={workDay?.days?.from + workDay?.days?.to + index}
                        sx={{
                            display: 'flex',
                            // bgcolor: 'modern.modern_2.second',
                            py: 0.5,
                            border: '1px solid silver',
                            px: 1,
                            borderRadius: '7px',
                            flexDirection: 'column',
                            justifyContent: "start",
                            alignItems: 'start',
                        }}>
                        <Box
                            sx={{
                                fontSize: {xs: '14px', sm: '15px'},
                                fontWeight: 600
                            }}
                        >
                            {workDay?.time?.from} - {workDay?.time?.to}
                        </Box>
                        <Box
                            sx={{
                                fontSize: {xs: '13px', sm: '14px'}
                            }}
                        >
                            {
                                translate(`home.create.workSchedule.dayName.${workDay?.days?.from}.short`)
                            }
                            -
                            {
                                translate(`home.create.workSchedule.dayName.${workDay?.days?.to}.short`)
                            }
                        </Box>
                    </Box>
                ))
            }
        </Box>
    );
};

