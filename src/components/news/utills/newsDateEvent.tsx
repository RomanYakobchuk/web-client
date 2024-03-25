import {Box, SxProps} from "@mui/material";
import dayjs from "dayjs";

import {INewsDateEvent} from "@/interfaces/common";

type TProps = {
    dateEvent: INewsDateEvent[],
    lengthItems?: number | null,
    styles?: SxProps
}
export const NewsDateEvent = ({dateEvent, lengthItems = null, styles}: TProps) => {


    const dates = lengthItems ? dateEvent?.slice(0, lengthItems) : dateEvent;

    return (
        <>
            {
                dates?.length > 0 &&
                dates?.map((event, index) => (
                    <Box key={index} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        "::before": {
                            content: '""',
                            position: 'absolute',
                            left: '-15px',
                            top: '5px',
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            bgcolor: 'common.white'
                        },
                        ...styles
                    }}>
                        <div>
                            {
                                event?.schedule?.from && (
                                    <Box
                                        component="span"
                                    >
                                        {dayjs(event?.schedule?.from)?.format('DD/MM/YYYY')}
                                    </Box>
                                )
                            }
                            {
                                event?.schedule?.from && event?.schedule?.to && (
                                    ' - '
                                )
                            }
                            {
                                event?.schedule?.to && (
                                    <Box
                                        component="span"
                                    >
                                        {dayjs(event?.schedule?.to)?.format('DD/MM/YYYY')}
                                    </Box>
                                )
                            }
                        </div>
                        <div>
                            {
                                event?.time?.from && (
                                    <Box
                                        component="span"
                                    >
                                        {event?.time?.from as string}
                                    </Box>
                                )
                            }
                            {
                                event?.time?.from && event?.time?.to && (
                                    ' - '
                                )
                            }
                            {
                                event?.time?.to && (
                                    <Box
                                        component="span"
                                    >
                                        {event?.time?.to as string}
                                    </Box>
                                )
                            }
                        </div>
                    </Box>
                ))
            }
        </>
    );
};

