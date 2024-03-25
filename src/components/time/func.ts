import {IWorkDay} from "@/interfaces/common";
import dayjs from "dayjs";

const generateHoursAndMinutesArray = () => {
    const hoursAndMinutes = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            hoursAndMinutes.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return hoursAndMinutes;
}

// const getRoundedTime = (time: string): Date => {
//     const parts = time.split(':');
//     const hour = parseInt(parts[0]);
//     const minute = parseInt(parts[1]);
//     const date = new Date();
//     date.setHours(hour, minute, 0, 0);
//
//     const roundedMinute = Math.round(date.getMinutes() / 30) * 30;
//     date.setMinutes(roundedMinute);
//
//     return date;
// };
const getRoundedTime = (time: string, date: Date | null): Date => {
    const parts = time.split(':');
    let hour = parseInt(parts[0]);
    let minute = parseInt(parts[1]);

    if (minute === 0) {
        minute = 0;
    } else if (minute <= 30) {
        minute = 30;
    } else {
        minute = 0;
        hour += 1;
    }
    date = date || new Date();
    date.setHours(hour, minute, 0, 0);

    return date;
};


const isWorkDayFunc = ({workDays, weekends, date}: {
    date: Date, weekends?: string, workDays?: IWorkDay[]
}) => {
    if ( !workDays || workDays?.length <= 0) return true;
    const dayOfWeek = date.getDay();
    const isWeekend = weekends?.split(", ").some(weekend => {
        const [day, month] = weekend.split(".");
        return date.getDate() === parseInt(day) && date.getMonth() + 1 === parseInt(month);
    });
    if (isWeekend) return false;

    return workDays?.some(workDay => {
        return dayOfWeek >= workDay.days.from && dayOfWeek <= workDay.days.to;
    });
};

const isSelectableDate = ({maxDate, minDate, date, weekends, workDays}: {
    date: Date,
    maxDate?: Date | null, minDate?: Date | null, weekends?: string, workDays?: IWorkDay[]
}) => {
    const isSelectable = (minDate ? dayjs(date)?.format("YYYY-MM-DD") >= dayjs(minDate)?.format("YYYY-MM-DD") : true) && (maxDate ? dayjs(date)?.format("YYYY-MM-DD") <= dayjs(maxDate)?.format("YYYY-MM-DD") : true);

    return isSelectable
        && isWorkDayFunc({date, weekends, workDays});
};

const isTimeInWorkDayRange = (time: string, workDay: IWorkDay, date: Date, disabled: boolean): boolean => {
    const {from, to} = workDay.time;
    const timeParts = time.split(":");
    const workDayFromParts = from.split(":");
    const workDayToParts = to.split(":");

    const startTime = new Date();
    const endTime = new Date();

    const setStartTime = new Date(startTime?.setHours(parseInt(workDayFromParts[0]), parseInt(workDayFromParts[1])));
    const setEndTimeM = new Date(endTime?.setHours(parseInt(workDayToParts[0]), parseInt(workDayToParts[1])));
    const setEndTime = new Date(setEndTimeM?.setMinutes(setEndTimeM?.getMinutes() - 60));

    const currentTime = new Date();
    const setCurrentTime = new Date(currentTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1])));
    if (currentTime?.getDate() !== date?.getDate() || currentTime?.getMonth() !== date?.getMonth()) {
        return setCurrentTime >= setStartTime && setCurrentTime <= setEndTime;
    }
    return (setCurrentTime >= setStartTime && setCurrentTime <= setEndTime && !disabled);
};


const isTimeInWorkDaysRange = (time: string, workDays: IWorkDay[], date: Date | null, disabled: boolean): boolean => {
    return (workDays && workDays?.length > 0) ? workDays?.some(workDay => isTimeInWorkDayRange(time, workDay, date as Date, disabled)) : true;
};

const isTimeInRangeForDays = (times: string[], workDays: IWorkDay[], date: Date | null, disabled: boolean): boolean => {
    return times.some(time => isTimeInWorkDaysRange(time, workDays, date, disabled));
};
export {
    generateHoursAndMinutesArray,
    getRoundedTime,
    isSelectableDate,
    isWorkDayFunc,
    isTimeInWorkDaysRange,
    isTimeInWorkDayRange,
    isTimeInRangeForDays
}