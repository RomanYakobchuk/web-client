import React, {Dispatch, ReactNode, SetStateAction, useEffect, useState} from 'react';
import {Box, Button, Divider, IconButton, MenuItem, Select, SelectChangeEvent, SxProps} from "@mui/material";

import "./calendar.css"
import {ArrowBackIosNewRounded, ArrowForwardIosRounded, KeyboardArrowDownRounded} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import {
    generateHoursAndMinutesArray,
    getRoundedTime,
    isSelectableDate,
    isTimeInWorkDaysRange
} from "./func";
import dayjs from "dayjs";
import {IEstablishment} from "@/interfaces/common";

interface CalendarProps {
    minDate?: Date | null;
    maxDate?: Date | null;
    value?: Date | null;
    setValue?: Dispatch<SetStateAction<Date | null>>
    styles?: SxProps,
    isTimeExist?: boolean,
    workSchedule?: IEstablishment['workSchedule'] | null,
    isShowTodayBtn?: boolean
}

const Calendar: React.FC<CalendarProps> = ({
                                               minDate,
                                               maxDate,
                                               value,
                                               styles,
                                               isTimeExist = false,
                                               setValue,
                                               workSchedule: wS = null,
                                               isShowTodayBtn = true
                                           }) => {

    const translate = useTranslate();

    const [workSchedule, setWorkSchedule] = useState<IEstablishment['workSchedule'] | null>(wS);
    useEffect(() => {
        if (wS) {
            setWorkSchedule(wS);
        }
    }, [wS]);

    const {workDays, weekend} = workSchedule || {workDays: [], weekends: ""};
    const [selectedDate, setSelectedDate] = useState<Date | null>(value ? getRoundedTime(dayjs(value)?.format("HH:mm"), value) : new Date());
    const [currentMonth, setCurrentMonth] = useState<number>(selectedDate?.getMonth() || new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(selectedDate?.getFullYear() || new Date().getFullYear());
    const times = generateHoursAndMinutesArray();
    const currentTimeByValue = value ? dayjs(getRoundedTime(dayjs(value)?.format("HH:mm"), selectedDate))?.format("HH:mm") : null;
    const defaultTime = currentTimeByValue ? currentTimeByValue : dayjs(getRoundedTime(dayjs()?.format("HH:mm"), selectedDate))?.format('HH:mm');
    const [selectedTime, setSelectedTime] = useState<string>(defaultTime);

    const [isChooseMonth, setIsChooseMonth] = useState<boolean>(false);

    const disabledMinMonth = !minDate ? false : currentYear === minDate?.getFullYear() && minDate?.getMonth() >= currentMonth;
    const disabledMaxMonth = !maxDate ? false : currentYear === maxDate?.getFullYear() && maxDate?.getMonth() <= currentMonth;

    const handleDateClick = (date: Date, selectedTime?: string) => {
        const isSelectable = isSelectableDate({
            date, maxDate, minDate, workDays, weekends: weekend
        });
        if (isSelectable) {
            if (selectedTime) {
                const [hours, minutes] = selectedTime?.split(':')?.map((part) => parseInt(part));
                const newDate = new Date(date?.setHours(hours, minutes, 0, 0));
                setSelectedDate(newDate);
                if (setValue) {
                    setValue(newDate);
                }
            }
        }
    };

    const disabledPrevMonth = minDate ? currentYear === minDate?.getFullYear() && minDate?.getMonth() >= currentMonth : false;
    const disabledNextMonth = maxDate ? currentYear === maxDate?.getFullYear() && maxDate?.getMonth() <= currentMonth : false;
    const handlePrevMonth = () => {
        if (disabledPrevMonth) {
            return;
        }
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prevYear => prevYear - 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth - 1);
        }
    };


    const handleNextMonth = () => {
        if (disabledNextMonth) {
            return;
        }
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prevYear => prevYear + 1);
        } else {
            setCurrentMonth(prevMonth => prevMonth + 1);
        }
    };

    const handleChangeYear = (event: SelectChangeEvent<number>) => {
        const v = event.target.value;
        const year = typeof v === 'string' ? parseInt(v) : v;
        setCurrentYear(year);
    };


    const renderCalendar = () => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Неділя - 0, потрібно ввести 6

        const weeks: ReactNode[] = [];

        let week: ReactNode[] = [];
        // Додаємо порожні дні до початку місяця
        for (let i = 0; i < firstDayOfWeek; i++) {
            week.push(<div key={`empty-start-${i}`} className="empty-day"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const h = new Date()?.getHours();
            const m = new Date()?.getMinutes();
            const s = new Date()?.getSeconds();
            const date = new Date(currentYear, currentMonth, day, h, m, s + 1);

            const isSelectable = isSelectableDate({date, maxDate, minDate, weekends: weekend, workDays: workDays});
            const isSelected = selectedDate && date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();

            if (isSelected && !isSelectable) {
                setSelectedDate(new Date(dayjs(date)?.add(1, 'day')?.toString()))
                console.log('wrong date')
            }
            const dayClassNames = ['day'];
            if (!isSelectable) dayClassNames.push('disabled');
            if (isSelected) dayClassNames.push('selected');

            week.push(
                <Box
                    key={day}
                    className={dayClassNames.join(' ')}
                    onClick={() => {
                        // console.log(isSelectable)
                        isSelectable && handleDateClick(date, selectedTime)
                    }} // Додаємо перевірку на робочі дні тижня при кліку
                    sx={{
                        color: isSelectable ? 'common.white' : 'silver !important',
                        borderRadius: '10px',
                        transition: '200ms linear',
                        "&:nth-of-type(6), &:nth-of-type(7)": {
                            color: 'error.main',
                        },
                        "&:hover": {
                            bgcolor: !isSelectable ? 'unset' : 'common.white',
                            color: !isSelectable ? 'unset' : 'common.black'
                        },
                        "&.selected": {
                            color: 'common.black',
                            bgcolor: 'common.white'
                        },
                    }}
                >
                    {day}
                </Box>
            );

            // Якщо кінець тижня або місяця, додаємо тиждень до календаря та розпочинаємо новий тиждень
            if (week.length === 7 || day === daysInMonth) {
                // Додаємо порожні дні до кінця місяця, якщо це останній тиждень
                if (day === daysInMonth && week.length < 7) {
                    for (let i = week.length; i < 7; i++) {
                        week.push(<div key={`empty-end-${i}`} className="empty-day"></div>);
                    }
                }

                weeks.push(
                    <Box key={`week-${weeks.length}`} className="week">
                        {week}
                    </Box>
                );
                week = [];
            }
        }

        return weeks;
    };


    const translateNames = translate('home.create.workSchedule.dayName', {returnObjects: true}) as any;
    const dayNames = Object.keys(translateNames)?.map((key) => translateNames[key]);

    const translateMonths = translate('dates.months', {returnObjects: true}) as any;
    const months = Object.keys(translateMonths)?.map((key) => translateMonths[key]);
    const disabledMonth = (index: number) => !!(minDate && new Date(minDate)?.getFullYear() === currentYear && index < new Date(minDate)?.getMonth()) || !!(maxDate && new Date(maxDate)?.getFullYear() === currentYear && index > new Date(maxDate)?.getMonth());

    const handleIsChooseMonth = () => {
        setIsChooseMonth((prevState) => !prevState);
    }
    const handleChooseMonth = (month: number) => {
        setCurrentMonth(month);
        setIsChooseMonth(false);
    }
    const handleCurrentDate = () => {
        setCurrentYear(new Date().getFullYear());
        setCurrentMonth(new Date().getMonth());
        const currentTime = dayjs(getRoundedTime(dayjs(minDate || new Date())?.format("HH:mm"), new Date()))?.format("HH:mm");
        setSelectedTime(currentTime);
        const [hours, minutes] = currentTime?.split(':')?.map((part) => parseInt(part));

        handleDateClick(new Date(new Date()?.setHours(hours, minutes, 0, 0)), currentTime);
    }
    const minSelectYear = minDate ? minDate.getFullYear() : new Date().getFullYear() - 80;
    const maxSelectYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear() + 10;

    const handleChangeTime = (event: SelectChangeEvent) => {
        const value = event.target.value;
        const disabled = (minDate ? value < dayjs(minDate)?.format("HH:mm") : false) || (maxDate ? value >= dayjs(maxDate)?.format("HH:mm") : false);
        const isSelectable = isTimeInWorkDaysRange(value, workDays, selectedDate, disabled)
        if (isTimeExist && isSelectable) {
            setSelectedTime(value);
            const [hours, minutes] = value?.split(':')?.map((part) => parseInt(part));
            selectedDate?.setHours(hours, minutes, 0, 0);
            if (selectedDate) {
                handleDateClick(selectedDate, value);
            }
        }
    };

    return (
        <>
            <Box
                sx={{
                    minWidth: '300px',
                    width: '100%',
                    transition: 'all 200ms linear',
                    px: 1,
                    py: 2,
                    m: '0 auto',
                    borderRadius: '16px',
                    bgcolor: 'common.black',
                    ...styles
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        color: 'common.white',
                        "& svg": {
                            color: 'common.white',
                        }
                    }}
                    className="calendar-container">
                    <Box
                        sx={{
                            "& .MuiIconButton-root": {
                                border: '1px solid silver',
                                borderRadius: '7px',
                                p: 0.5,
                                "& svg": {
                                    fontSize: '20px'
                                }
                            }
                        }}
                        className="calendar-header">
                        <IconButton
                            sx={{
                                cursor: 'pointer'
                            }}
                            disabled={disabledMinMonth}
                            onClick={handlePrevMonth}
                        >
                            <ArrowBackIosNewRounded/>
                        </IconButton>
                        <Box
                            sx={{
                                textTransform: 'inherit',
                                fontSize: '16px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            <Button
                                onClick={handleIsChooseMonth}
                                variant={'text'}
                                color={'secondary'}
                                sx={{
                                    textTransform: 'inherit',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                }}
                            >
                                {months[currentMonth]}
                            </Button>
                            <Select
                                size={'small'}
                                value={currentYear || new Date().getFullYear()}
                                onChange={handleChangeYear}
                                MenuProps={{
                                    sx: {
                                        maxHeight: '300px'
                                    }
                                }}
                                sx={{
                                    p: 0,
                                    color: 'common.white',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    "& > div": {
                                        py: 0.5,
                                        pl: 0.5,
                                    },
                                    "& > fieldset": {
                                        border: 'none'
                                    },
                                    "&:focus": {
                                        border: 'none',
                                        bgcolor: 'transparent',
                                    },
                                }}
                            >
                                {Array.from({length: maxSelectYear - minSelectYear + 1}, (_, index) => minSelectYear + index).map((year) => (
                                    <MenuItem
                                        key={year}
                                        value={year}
                                        sx={{
                                            color: 'common.white',
                                            bgcolor: 'common.black',
                                            padding: '8px 16px',
                                            display: 'flex',
                                            "&:hover": {
                                                bgcolor: 'common.white',
                                                color: 'common.black',
                                            }
                                        }}
                                    >
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>
                        <IconButton
                            sx={{
                                cursor: 'pointer'
                            }}
                            disabled={disabledMaxMonth}
                            onClick={handleNextMonth}
                        >
                            <ArrowForwardIosRounded/>
                        </IconButton>
                        {
                            isChooseMonth && (
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'common.black',
                                        position: 'absolute',
                                        left: '2px',
                                        // right: 0,
                                        width: 'fit-content',
                                        top: '40px',
                                        borderRadius: '7px',
                                        zIndex: 2,
                                        boxShadow: '0px 0px 5px 3px #a3a3a3',
                                        // transform: 'translate(-36%, 25%)',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 'fit-content',
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(3, 80px)',
                                            gridAutoRows: '30px',
                                            gap: 0.5,
                                            fontWeight: 400,
                                        }}
                                    >
                                        {
                                            months?.map((month, index) => (
                                                <Button
                                                    variant={'text'}
                                                    color={'secondary'}
                                                    key={month + index}
                                                    sx={{
                                                        textTransform: 'inherit',
                                                        fontSize: '1rem',
                                                    }}
                                                    onClick={() => handleChooseMonth(index)}
                                                    disabled={disabledMonth(index)}
                                                >
                                                    {month}
                                                </Button>
                                            ))
                                        }
                                    </Box>
                                </Box>
                            )
                        }
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.5,
                            // "& .week:not(:last-of-type)": {
                            //     // borderBottom: '1px solid silver',
                            //     // pb: 0.5
                            // }
                        }}
                    >
                        <Box
                            sx={{
                                "& div:nth-of-type(6), & div:nth-of-type(7)": {
                                    color: 'error.main',
                                },
                            }}
                            className="week">
                            {
                                dayNames?.length > 0 && dayNames?.map((value: { short: string }, index) => (
                                    <Box
                                        key={index}
                                        className="dayName"
                                        sx={{
                                            fontWeight: 600,
                                            "&:hover + < div.week > .day": {
                                                bgcolor: 'silver',
                                                borderRadius: '5px'
                                            }
                                        }}
                                    >
                                        {value?.short}
                                    </Box>
                                ))
                            }
                        </Box>
                        {renderCalendar()}
                    </Box>
                    {
                        isShowTodayBtn && (
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'end',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Button
                                    variant={'text'}
                                    color={'info'}
                                    sx={{
                                        textTransform: 'inherit'
                                    }}
                                    onClick={handleCurrentDate}
                                >
                                    {translate('dates.today')}
                                </Button>
                            </Box>
                        )
                    }
                    {
                        isTimeExist && (
                            <>
                                <Divider
                                    sx={{
                                        height: '1px',
                                        width: '95%',
                                        margin: '0 auto',
                                        bgcolor: 'silver',
                                        mb: 2
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Select
                                        IconComponent={(props) => (<KeyboardArrowDownRounded {...props}/>)}
                                        size={'small'}
                                        value={selectedTime}
                                        onChange={handleChangeTime}
                                        autoWidth={false}
                                        MenuProps={{
                                            sx: {
                                                maxHeight: '300px',
                                                "& .MuiMenu-paper": {
                                                    minWidth: '250px',
                                                    borderRadius: '16px',
                                                    '&::-webkit-scrollbar': {
                                                        width: '10px',
                                                    },
                                                    // '&::-webkit-scrollbar-track': {
                                                    //
                                                    // },
                                                    '&::-webkit-scrollbar-thumb': {
                                                        bgcolor: 'silver',
                                                        borderRadius: '7px'
                                                    }
                                                }
                                            },
                                        }}
                                        sx={{
                                            p: 0,
                                            color: 'common.white',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            width: '80%',
                                            "& > div": {
                                                textAlign: 'center'
                                            },
                                            "& > fieldset": {
                                                borderRadius: '10px',
                                                border: '2px solid cornflowerblue'
                                            },
                                            "&:focus": {
                                                border: 'none',
                                                bgcolor: 'transparent',
                                            },
                                        }}
                                    >
                                        {times.map((time) => {
                                            const disabled = (minDate ? time <= dayjs(minDate)?.format("HH:mm") : false) || (maxDate ? time > dayjs(maxDate)?.format("HH:mm") : false);
                                            const isSelectable = isTimeInWorkDaysRange(time, workDays, selectedDate, disabled)
                                            return (
                                                <MenuItem
                                                    key={time}
                                                    disabled={!isSelectable}
                                                    value={time}
                                                    sx={{
                                                        width: '250px',
                                                        color: 'common.white',
                                                        bgcolor: 'common.black',
                                                        padding: '8px 16px',
                                                        m: 1,
                                                        display: 'flex',
                                                        borderRadius: '14px',
                                                        justifyContent: 'center',
                                                        "&:hover": {
                                                            bgcolor: 'common.white',
                                                            color: 'common.black',
                                                        }
                                                    }}
                                                >
                                                    {time}
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Box>
                            </>
                        )
                    }
                </Box>
            </Box>
        </>
    );
};

export default Calendar;

// const renderCalendar = () => {
//
//     const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
//     const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
//     const daysInMonth = lastDayOfMonth.getDate();
//     let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
//     if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Неділя - 0, потрібно ввести 6
//
//     const weeks: ReactNode[] = [];
//
//     let week: ReactNode[] = [];
//     // Додаємо порожні дні до початку місяця
//     for (let i = 0; i < firstDayOfWeek; i++) {
//         week.push(<div key={`empty-start-${i}`} className="empty-day"></div>);
//     }
//
//     for (let day = 1; day <= daysInMonth; day++) {
//         const h = new Date()?.getHours();
//         const m = new Date()?.getMinutes();
//         const s = new Date()?.getSeconds();
//         const date = new Date(currentYear, currentMonth, day, h, m, s + 1);
//
//         const isSelectable = (minDate ? dayjs(date)?.format("YYYY-MM-DD") >= dayjs(minDate)?.format("YYYY-MM-DD") : true) && (maxDate ? dayjs(date)?.format("YYYY-MM-DD") <= dayjs(maxDate)?.format("YYYY-MM-DD") : true);
//
//         const isSelected = selectedDate && date.getFullYear() === selectedDate.getFullYear() && date.getMonth() === selectedDate.getMonth() && date.getDate() === selectedDate.getDate();
//
//         const dayClassNames = ['day'];
//         if (!isSelectable) dayClassNames.push('disabled');
//         if (isSelected) dayClassNames.push('selected');
//
//         week.push(
//             <Box
//                 key={day}
//                 className={dayClassNames.join(' ')}
//                 onClick={() => isSelectable && handleDateClick(date)}
//                 sx={{
//                     color: isSelectable ? 'common.white' : 'silver !important',
//                     borderRadius: '10px',
//                     transition: '200ms linear',
//                     "&:nth-of-type(6), &:nth-of-type(7)": {
//                         color: 'error.main',
//                     },
//                     "&:hover": {
//                         bgcolor: !isSelectable ? 'unset' : 'common.white',
//                         color: !isSelectable ? 'unset' : 'common.black'
//                     },
//                     "&.selected": {
//                         color: 'common.black',
//                         bgcolor: 'common.white'
//                     },
//                 }}
//             >
//                 {day}
//             </Box>
//         );
//
//         // Якщо кінець тижня або місяця, додаємо тиждень до календаря та розпочинаємо новий тиждень
//         if (week.length === 7 || day === daysInMonth) {
//             // Додаємо порожні дні до кінця місяця, якщо це останній тиждень
//             if (day === daysInMonth && week.length < 7) {
//                 for (let i = week.length; i < 7; i++) {
//                     week.push(<div key={`empty-end-${i}`} className="empty-day"></div>);
//                 }
//             }
//
//             weeks.push(
//                 <Box key={`week-${weeks.length}`} className="week">
//                     {week}
//                 </Box>
//             );
//             week = [];
//         }
//     }
//
//     return weeks;
// };

