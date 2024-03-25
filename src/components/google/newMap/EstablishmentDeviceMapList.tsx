import {IEstablishment} from "@/interfaces/common";
import {CustomDrawer} from "@/components";

import './style.css';
import {Box, Paper, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {touchScroll} from "@/components/common/scroll/touchScroll";
import {TruncateSingleText} from "@/utils";
import {Link} from "react-router-dom";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {Place, StarRounded} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";

type TProps = {
    establishments: IEstablishment[],
}

export const EstablishmentDeviceMapList = ({establishments}: TProps) => {

    const translate = useTranslate();

    useEffect(() => {
        setTimeout(() => {
            touchScroll('.establishmentDeviceMapListScrollContent', 1);
        }, 500)
    }, [establishments])

    return (
        <CustomDrawer
            anchor={'bottom'}
            maxWidth={'90vw'}
            isScaleRoot={false}
            isOnlySwiper={true}
            title={''}
            open={true}
            swiperClasses={'establishmentDeviceMapList'}
            toggleDrawer={(value) => {
            }}
            swiperDefaultSnap={210}
            swiperSnapPoints={[210, 50]}
            showDefaultHeader={true}
            isShowCloseButton={false}
            isShowHeader={false}
            isOnlyOpen={true}
        >
            <Box
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    height: '150px',
                    py: 1
                }}
                className={'establishmentDeviceMapListScrollContent'}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        gap: 2,
                        width: 'fit-content',
                        height: '100%',
                        px: 1
                    }}
                >
                    {
                        establishments?.length > 0 && establishments?.map((establishment) => (
                            <Paper
                                elevation={3}
                                key={establishment?._id}
                                sx={{
                                    width: '300px',
                                    height: '100%',
                                    bgcolor: 'common.black',
                                    borderRadius: '10px',
                                    "& > a": {
                                        p: 1,
                                        display: 'flex',
                                        gap: 1,
                                        width: '100%',
                                        height: '100%',
                                        textDecoration: 'none'
                                    }
                                }}
                            >
                                <Link
                                    to={`/${ESTABLISHMENT}/${SHOW}/${establishment?._id}`}
                                >
                                    <Box
                                        component={"img"}
                                        src={establishment?.pictures?.length > 0 ? establishment?.pictures[0]?.url : ''}
                                        sx={{
                                            objectFit: 'cover',
                                            width: '120px',
                                            height: '100%',
                                            borderRadius: '7px'
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 'calc(100% - 130px)',
                                            color: 'common.white',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <TruncateSingleText
                                            width={'100%'}
                                            styles={{
                                                fontSize: '1.2rem',
                                                fontWeight: 600
                                            }}
                                            str={establishment.title as string}
                                        />
                                        <Box sx={{
                                            display: 'flex',
                                            gap: 1,
                                            alignItems: 'center',
                                            fontSize: '1.2rem'
                                        }}>
                                            <StarRounded sx={{color: 'info.main'}}/>
                                            {establishment?.rating > 0 ? establishment?.rating?.toFixed(2) : establishment?.rating}
                                            <Box
                                                component={'span'}
                                                sx={{
                                                    margin: '0 5px',
                                                    fontSize: '1rem',
                                                    color: 'silver'
                                                }}
                                            >
                                                ({establishment?.reviewsLength})
                                            </Box>
                                        </Box>
                                        <Typography sx={{
                                            width: 'fit-content',
                                            color: 'common.black',
                                            bgcolor: 'common.white',
                                            p: '4px 8px',
                                            borderRadius: '7px',
                                            fontWeight: 500,
                                            fontSize: {xs: '0.775rem', sm: '0.875rem', md: '1rem'},
                                            "@media screen and ((max-width: 1000px && min-width: 900px) || max-width: 600px)": {
                                                fontSize: '0.875rem'
                                            },
                                        }}>
                                            {translate(`home.create.type.${establishment?.type}`)}
                                        </Typography>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            justifyContent: 'start',
                                            alignItems: 'center'
                                        }}>
                                            <Place
                                                sx={{
                                                    fontSize: 20,
                                                    color: "secondary.main",
                                                }}
                                            />
                                            <Box sx={{
                                                fontSize: '14px',
                                                display: 'flex',
                                                // height: '30px',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                {
                                                    establishment?.place?.city
                                                }
                                            </Box>
                                        </Box>
                                    </Box>
                                </Link>
                            </Paper>
                        ))
                    }
                </Box>
            </Box>
        </CustomDrawer>
    );
};

