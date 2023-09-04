import {Box, Button, Stack, Typography} from "@mui/material";

import {IGetIdentity, INews, ProfileProps} from "../../../interfaces/common";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {EastOutlined, Place} from "@mui/icons-material";
import dayjs from "dayjs";
import React, {useContext} from "react";
import {ColorModeContext} from "../../../contexts";
import {useMobile} from "../../../utils";
import {useNavigate} from "react-router-dom";

interface IProps {
    news: INews,
    index: number
}

const NewsCard = ({
                      news,
                      index
                  }: IProps) => {
    const {title, _id, place, dateEvent, description, pictures} = news;

    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user: ProfileProps = identity?.user as ProfileProps;
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);
    const navigate = useNavigate();
    const {width} = useMobile();

    return (
        <Box
            sx={{
                width: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: width > 600 ? 'column' : 'row',
                position: 'relative',
                height: width > 600 ? 'auto' : {xs: '200px', md: '250px'},
                justifyContent: width > 600 ? 'normal' : index! % 2 === 0 ? 'end' : 'start',
                alignItems: 'center',
            }}
        >
            <Box sx={{
                position: width < 600 ? 'absolute' : 'normal',
                zIndex: 5,
                order: width < 600 ? 2 : 1,
                left: width > 600 ? 'none' : index! % 2 === 0 ? 0 : 'none',
                right: width > 600 ? 'none' : index! % 2 === 0 ? 'none' : 0,
                bottom: width > 600 ? 0 : 'none',
                width: width > 600 ? '100%' : '60%',
                borderRadius: width > 600 ? '0 0 20px 20px' : '10px',
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
                    place?.address &&
                    <Stack direction="row" gap={0.5} justifyContent={"start"} alignItems="center">
                        <Place
                            sx={{
                                fontSize: 18,
                                color: "secondary",
                            }}
                        />
                        <Typography sx={{
                            fontSize: {xs: '14px', sm: '16px'},
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center'
                        }} color="main">
                            {
                                place?.address
                            }
                        </Typography>
                    </Stack>
                }
                <Box sx={{
                    display: 'flex',
                    flexDirection: "column",
                    justifyContent: width < 400 ? 'start' : 'space-between',
                    alignItems: "start",
                    gap: width < 400 ? 1 : 0,

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
                width: width > 600 ? '100%' : '50%',
                height: '180px',
                // zIndex: 5,
                // position: 'relative',
            }}>
                {
                    pictures[0] && (
                        <img style={{
                            borderRadius: width > 600 ? '20px 20px 0 0' : '10px',
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
