import React, {useState, MouseEvent} from "react";
import {Box} from "@mui/material";
import dayjs from "dayjs";

type TProps = {
    date: Date,
    isFirstAgo?: boolean
}
const ShowTimeComponent = ({date, isFirstAgo = true}: TProps) => {
    const [isShowTimeFromNow, setIsShowTimeFromNow] = useState<boolean>(true);

    const handleChange = (event: MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        event.stopPropagation();
        event.preventDefault();
        setIsShowTimeFromNow((prevState) => !prevState);
    }
    return (
        <Box sx={{
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            cursor: 'pointer'
        }}
             onClick={handleChange}
        >
            {
                isShowTimeFromNow && isFirstAgo ? (
                    dayjs(date).fromNow()
                ) : (
                    <Box sx={{
                        display: 'flex',
                        gap: 1
                    }}>
                                        <span>
                                            {dayjs(date)?.format('DD.MM.YYYY')}
                                        </span>
                        <span>
                                            {dayjs(date)?.format('HH:mm')}
                                        </span>
                    </Box>
                )
            }
        </Box>
    );
};
export default ShowTimeComponent
