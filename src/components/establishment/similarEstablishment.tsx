import {useList, useTranslate} from "@refinedev/core";
import React, {useContext, useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";

import {CarouselComponent, EstablishmentCard} from "@/components";
import {IEstablishment} from "@/interfaces/common";
import {ESTABLISHMENT} from "@/config/names";
import {ColorModeContext} from "@/contexts";

type TProps = {
    id: string,
}

const SimilarEstablishment = ({id}: TProps) => {

    const translate = useTranslate();
    const {collapsed} = useContext(ColorModeContext);

    const [similarItems, setSimilarItems] = useState<IEstablishment[]>([] as IEstablishment[]);

    const {data} = useList<IEstablishment>({
        resource: `${ESTABLISHMENT}/similar/${id}`
    });

    useEffect(() => {
        if (data?.data) {
            setSimilarItems(data?.data)
        }
    }, [data]);


    return (
        <Box sx={{
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            // gap: 2,
            alignItems: 'start',
            width: '100%',
            flexDirection: 'column',
            gap: 2,
            "& > div": {
                margin: '0 auto'
            }
        }}>
            <Typography
                sx={{
                    color: 'common.white',
                    pl: 2,
                    borderLeft: '3px solid',
                    borderColor: 'common.white'
                }}
                variant={'h5'}
            >
                {translate(`${ESTABLISHMENT}.similar.title`)}
            </Typography>
            <Box
                sx={{
                    width: {xs: '95vw', md: collapsed ? 'calc(100vw - 64px - 20px)' : 'calc(100vw - 200px - 20px)'},
                    maxWidth: {xs: '100%'},
                    py: 3.5,
                }}
            >
                <Box sx={{
                    width: '100%',
                    margin: '0 auto',
                    position: 'relative',
                    "& button.react-multiple-carousel__arrow--right": {
                        top: '-40px',
                        right: {xs: '10px', md: '0'},
                        bgcolor: 'unset',
                        transition: '200ms linear',
                        "&:hover": {
                            bgcolor: 'common.white',
                            "&::before": {
                                color: 'common.black',
                            }
                        },
                        "&::before": {
                            color: 'common.white',
                        }
                    },
                    "& button.react-multiple-carousel__arrow--left": {
                        top: '-40px',
                        right: {xs: '60px', md: '10px'},
                        left: 'unset',
                        bgcolor: 'unset',
                        transition: '200ms linear',
                        "&:hover": {
                            bgcolor: 'common.white',
                            "&::before": {
                                color: 'common.black',
                            }
                        },
                        "&::before": {
                            color: 'common.white',
                        },
                        transform: {sm: 'translateX(-100%)'}
                    },
                    "& ul.react-multi-carousel-dot-list": {
                        bgcolor: '#f5f5fa',
                        p: '4px 8px',
                        width: 'fit-content',
                        margin: '0 auto 5px',
                        borderRadius: '15px',
                        gap: 1,
                        bottom: '-28px',
                        "& li > button": {
                            mr: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    },
                }}>
                    <CarouselComponent
                        autoPlay={true}
                    >
                        {
                            similarItems?.map((item, index) => (
                                <Box
                                    key={item?._id + index}
                                    sx={{
                                        width: '100%',
                                        p: 1
                                    }}
                                >
                                    <EstablishmentCard
                                        elevation={3}
                                        establishment={item}
                                    />
                                </Box>
                            ))
                        }
                    </CarouselComponent>
                </Box>
            </Box>
        </Box>
    );
};
export default SimilarEstablishment;
