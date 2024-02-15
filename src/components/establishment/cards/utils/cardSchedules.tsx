import {PropertyProps} from "@/interfaces/common";
import {Box} from "@mui/material";
import {useTranslate} from "@refinedev/core";

type TProps = {
    workSchedule: PropertyProps['workSchedule']
}
export const CardSchedules = ({workSchedule}: TProps) => {

    const translate = useTranslate();

    const {workDays} = workSchedule;
    const workDaysArray = workDays?.slice(0, 4);
    return (
        <Box>
            {
                workDaysArray?.length > 0 && workDaysArray?.map((workDay, index) => (
                    <Box
                        key={workDay?.days?.from + workDay?.days?.to + index}
                    >

                    </Box>
                ))
            }
        </Box>
    );
};

