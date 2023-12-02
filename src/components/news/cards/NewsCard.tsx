import {Box, Button, Stack, Typography} from "@mui/material";
import { useTranslate} from "@refinedev/core";
import {EastOutlined, Place} from "@mui/icons-material";
import dayjs from "dayjs";
import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";

import {INews} from "@/interfaces/common";
import {ColorModeContext} from "@/contexts";
import {useMobile} from "@/hook";

interface IProps {
    news: INews,
    index: number
}

const NewsCard = ({
                      news,
                      index
                  }: IProps) => {
    const {title, _id, place, dateEvent, description, pictures} = news;

    const translate = useTranslate();
    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: {xs: 'row', sm: 'column'},
                position: 'relative',
                height: {xs: '200px', sm: 'auto', md: '250px'},
                justifyContent: index! % 2 === 0 ? 'end' : 'start',
                "@media screen and (min-width: 600px)":{
                    width: 'normal'
                },
                alignItems: 'center',
            }}
        >
            <Box sx={{
                position: {xs: 'absolute', sm: 'normal'},
                zIndex: 5,
                order: {xs: 2, sm: 1},
                left: index! % 2 === 0 ? 0 : 'none',
                bottom: 'none',
                right: index! % 2 === 0 ? 'none' : 0,
                "@media screen and (min-width: 600px)": {
                    left: 'none',
                    bottom: 0,
                    right: 'none'
                },
                width: {xs: '60%', sm: '100%'},
                borderRadius: {xs: '10px', sm: '0 0 20px 20px'},
                bgcolor: mode === 'light' ? '#ffffff' : '#241d30',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: '10px'
            }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <Typography sx={{
                        fontSize: '18px',
                        fontWeight: 700
                    }}>
                        {title}
                    </Typography>
                    <Typography sx={{
                        fontSize: '14px',
                        fontWeight: 400
                    }}>
                        {description?.slice(0, 50)}{description?.length > 50 && '...'}
                    </Typography>
                </Box>
                {
                    place?.place?.address &&
                    <Stack direction="row" gap={0.5} justifyContent={"start"} alignItems="center">
                        <Place
                            sx={{
                                fontSize: 18,
                                color: "secondary.main",
                            }}
                        />
                        <Typography sx={{
                            fontSize: {xs: '14px', sm: '16px'},
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center'
                        }} color="main">
                            {
                                place?.place?.address
                            }
                        </Typography>
                    </Stack>
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: 'space-between',
                    gap: 0,
                    "@media screen and (max-width: 400px)":{
                        justifyContent: 'start',
                        gap: 1
                    },
                    alignItems: "start",

                }}>
                    <Box sx={{
                        // width: '100%',
                        my: 1.5,
                    }}>
                        {
                            dateEvent?.length > 0 && dateEvent?.map((date, index: number) => (
                                <Box key={index} sx={{
                                    bgcolor: 'black',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    color: '#fff',
                                    p: '10px 15px',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Box sx={{
                                        display: 'flex'
                                    }}>
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {date?.schedule?.from && dayjs(date?.schedule?.from)?.format("DD.MM.YY")}
                                        </Box>
                                        {
                                            date?.schedule?.to && ' - '
                                        }
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {date?.schedule?.to && dayjs(date?.schedule?.to)?.format("DD.MM.YY")}
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                    }}>
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {date?.time?.from && dayjs(date?.time?.from)?.format("HH:mm")}
                                        </Box>
                                        {
                                            date?.time?.to && ' - '
                                        }
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {date?.time?.to && dayjs(date?.time?.to)?.format("HH:mm")}
                                        </Box>
                                    </Box>
                                </Box>
                            ))[0]
                        }
                    </Box>
                    <Button
                        sx={{
                            fontSize: {xs: '12px', sm: '14px'},
                            width: '100%',
                            borderRadius: '20px',
                            minWidth: '100px',
                            mt: 1
                        }}
                        onClick={() => navigate(`/news/show/${_id}`)}
                        color={"secondary"}
                        endIcon={<EastOutlined/>}
                        variant={"outlined"}>
                        {translate("buttons.details")}
                    </Button>
                </Box>
            </Box>
            <Box sx={{
                display: 'flex',
                width: {xs: '50%', sm: '100%'},
                height: '180px',
                // zIndex: 5,
                // position: 'relative',
            }}>
                {
                    pictures[0] && (
                        <img style={{
                            borderRadius: width < 600 ? '10px' : '20px 20px 0 0',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }} src={pictures[0]?.url} alt={"mainPhoto"}/>
                    )
                }
            </Box>
        </Box>
    );
};
export default NewsCard;
