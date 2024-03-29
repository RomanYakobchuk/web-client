import {Link} from "react-router-dom";
import {Avatar, Box, Typography} from "@mui/material";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {INews, IEstablishment} from "@/interfaces/common";
import NewsItem1Info from "./newsItem_1_Info";
import {ColorModeContext} from "@/contexts";
import {ESTABLISHMENT, SHOW} from "@/config/names";

type IProps = {
    itemNews: INews
}
const NewsItem1 = ({itemNews}: IProps) => {
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const establishmentInfo = itemNews?.establishmentId as IEstablishment;

    const l = innerWidth < 600 ? 20 : innerWidth < 900 ? 30 : 100;
    const titleEstablishment = establishmentInfo?.title?.length > l ? establishmentInfo?.title?.slice(0, l) : establishmentInfo?.title;
    const isSplicedEstablishmentTitle = establishmentInfo?.title?.length > l;
    return (
        <Box sx={{
            width: '100%',
            position: 'relative',
            "&::before": {
                content: '""',
                position: 'absolute',
                width: '10px',
                height: '100%',
                bgcolor: 'common.white',
                // left: {xs: '-28px', sm: '-26px', md: '-22px', lg: '-20px'},
                left: 0,
                // transform: 'translateX(-50%)',
                top: 0,
                borderRadius: '0 7px 7px 0'
            },
            pl: '20px',
            // bgcolor: 'modern.modern_1.main',
            // backgroundImage: mode === 'dark' ? 'radial-gradient(circle, rgba(62,71,97,1) 0%, rgba(34,29,57,1) 100%)' : 'radial-gradient(circle, rgba(181,184,226,1) 0%, rgba(206,221,238,1) 100%)',
            // borderRadius: '10px',
            // boxShadow: `0px 0px 5px 0px ${mode === 'dark' ? '#000' : '#fff'}`,
            // backgroundSize: '400% 400%',
            // WebkitAnimation: 'bgcolorGradientAnimation 10s ease infinite',
            // MozAnimation: 'bgcolorGradientAnimation 10s ease infinite',
            // animation: 'bgcolorGradientAnimation 10s ease infinite',
            // maxWidth: '600px',
        }}>
            <Box sx={{
                // padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                // bgcolor: 'common.black',
                borderRadius: {xs: '0', sm: '15px'},
                width: '100%',
                gap: 2,
                color: 'common.white',
                "& a": {
                    textDecoration: 'none',
                    color: 'common.white',
                },
            }}>
                <Link
                    to={`/${ESTABLISHMENT}/${SHOW}/${establishmentInfo?._id}`}
                    style={{
                        display: 'flex',
                        gap: "16px",
                    }}
                >
                    {
                        establishmentInfo?.pictures?.length > 0 && (
                            <Avatar
                                src={establishmentInfo?.pictures[0]?.url}
                                alt={establishmentInfo?.pictures[0]?.name}
                                sx={{
                                    width: {xs: 38, sm: 42, md: 48, lg: 52},
                                    height: {xs: 38, sm: 42, md: 48, lg: 52},
                                }}
                            />
                        )
                    }
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {xs: 'row', md: 'column'},
                            gap: {xs: 2, md: 0},
                            alignItems: {xs: 'center', md: 'start'}
                        }}
                    >
                        <Typography
                            variant={'h5'}
                            sx={{
                                fontSize: {xs: '15px', md: '17px'}
                            }}
                        >
                            {titleEstablishment}
                            {isSplicedEstablishmentTitle && '...'}
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: 'common.white',
                                borderRadius: '10px',
                                color: 'common.black',
                                p: '1px 7px',
                                fontSize: {xs: '13px', md: '15px'}
                            }}
                        >
                            {translate(`home.sortByType.${establishmentInfo?.type}`)}
                        </Box>
                    </Box>
                </Link>
                <Box sx={{
                    p: 2,
                    borderRadius: '10px',
                    width: '100%',
                    // position: 'relative',
                    bgcolor: mode === 'dark' ? '#050505' : '#f5f5f5',
                }}>
                    <NewsItem1Info news={itemNews}/>
                </Box>
            </Box>
        </Box>
    );
};
export default NewsItem1
