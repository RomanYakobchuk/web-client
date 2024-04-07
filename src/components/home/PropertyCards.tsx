import {ApartmentRounded, NewspaperRounded, WineBarRounded} from "@mui/icons-material";
import {useLink, useTranslate} from "@refinedev/core";
import {Box, Paper} from "@mui/material";
import EastRoundedIcon from '@mui/icons-material/EastRounded';
import {useContext} from "react";

import {CAPL, ESTABLISHMENT, NEWS} from "@/config/names";
import {ColorModeContext} from "@/contexts";

export const PropertyCards = () => {
    const link = useLink();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const blur = mode === 'dark' ? 0.6 : 1;
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(150px, 1fr))',
                gap: {xs: 1, sm: 2},
                maxHeight: 'fit-content'
            }}
        >
            {
                [
                    {
                        text: translate('establishment.establishment'),
                        icon: <ApartmentRounded/>,
                        link: `/${ESTABLISHMENT}`,
                        bgColor: `linear-gradient(90deg, rgba(16,60,231,${blur}) 0%, rgba(100,233,255,${blur}) 100%)`,
                        hoverBgColor: 'rgba(16,60,231,1)'
                    },
                    {
                        text: translate('news.news'),
                        icon: <NewspaperRounded/>,
                        link: `/${NEWS}`,
                        bgColor: `linear-gradient(90deg, rgba(97,87,255,${blur}) 0%, rgba(238,73,253,${blur}) 100%)`,
                        hoverBgColor: 'rgba(97,87,255,1)'
                    },
                    {
                        text: translate('capl.reservation'),
                        icon: <WineBarRounded/>,
                        link: `/${CAPL}`,
                        bgColor: `linear-gradient(90deg, rgba(255,64,102,${blur}) 0%, rgba(255,241,106,${blur}) 100%)`,
                        hoverBgColor: 'rgba(255,64,102,1)'
                    },
                ]?.map((property, index) => (
                    <Paper
                        elevation={2}
                        // component={link}
                        // to={property?.link}
                        key={index}
                        sx={{
                            borderRadius: '16px',
                            textDecoration: 'none',
                            background: property?.bgColor,
                            width: '100%',
                            overflow: 'hidden',
                            maxHeight: 'fit-content',
                            position: 'relative',
                            "&:after": {
                                transition: 'all 300ms linear',
                                position: 'absolute',
                                content: '""',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                zIndex: 0,
                                background: property?.hoverBgColor
                            },
                            "&:hover:after": {
                                opacity: 1
                            }
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                content: '""',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: 'fit-content',
                                zIndex: 1,
                                p: {xs: 1.5, sm: 2},
                                fontSize: {xs: '1rem', sm: '1.2rem', lg: '1.5vw'},
                                fontWeight: 600,
                                color: '#f9f9f9',
                                display: 'flex',
                                flexDirection: {lg: 'row'},
                                flexWrap: {xs: 'wrap', lg: 'nowrap'},
                                gap: {xs: 1, lg: 1.5},
                                alignItems: {xs: 'start', lg: 'center'},
                                justifyContent: {xs: 'space-between', lg: 'start'},
                                "& svg": {
                                    fontSize: {xs: '1.6rem', lg: '2rem'},
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    order: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                                    display: 'flex',
                                    p: 1,
                                    borderRadius: '10px'
                                }}
                            >
                                {property?.icon}
                            </Box>
                            <Box
                                sx={{
                                    width: {xs: '100%', lg: 'fit-content'},
                                    order: {xs: 3, lg: 2},
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {property?.text}
                            </Box>
                            <Box
                                component={link}
                                to={property?.link}
                                sx={{
                                    width: 'fit-content',
                                    display: 'flex',
                                    order: {xs: 2, lg: 3},
                                    ml: 'auto',
                                    p: 1,
                                    bgcolor: 'rgba(0, 0, 0, 0.4)',
                                    borderRadius: '50%',
                                    "& svg":{
                                        color: '#f9f9f9'
                                    }
                                }}
                            >
                                <EastRoundedIcon/>
                            </Box>
                        </Box>
                    </Paper>
                ))
            }
        </Box>
    );
};

