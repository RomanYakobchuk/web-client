import {useState, MouseEvent, useContext} from "react";
import {Box, Button, Popover, Typography} from "@mui/material";
import {Apartment, East, Place} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import dayjs from "dayjs";
import {Link} from "react-router-dom";

import {INews, IEstablishment} from "@/interfaces/common";
import {BookMarkButton} from "@/components";
import SharedComponent from "@/components/common/shared/sharedComponent";
import {ColorModeContext} from "@/contexts";
import {ESTABLISHMENT, SHOW} from "@/config/names";
import {NewsDateEvent} from "@/components/news/utills/newsDateEvent";
import {EstablishmentPopoverBtn} from "@/components/buttons/establishmentPopover/EstablishmentPopoverBtn";

type TProps = {
    news: INews
}
const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;
const NewsMainInfo = ({news}: TProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {_id, title, category, place, establishmentId, dateEvent} = news;

    const bgColorCategory = category === 'general' ? '#ff5f56' : category === 'events' ? '#f9ab46' : category === 'promotions' ? '#3ebafa' : 'common.white';

    const establishment = establishmentId as IEstablishment;

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: 1.5,
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
            }}>
                <BookMarkButton
                    id={_id}
                    type={'establishmentNews'}
                    showText={true}
                    style={{
                        boxShadow: 'unset',
                        p: '6px 0px',
                        bgcolor: 'transparent',
                        ":hover": {
                            boxShadow: 'unset',
                            bgcolor: 'transparent',
                        },
                        "& svg": {
                            color: 'common.white',
                            order: -1
                        },
                        gap: 0.5
                    }}
                />
                <SharedComponent
                    url={`${CLIENT_URL}/news/show/${_id}`}
                    title={title}
                    type={'establishmentNews'}
                    isOnlyShared={true}
                    color={'common.white'}
                    name={title}
                    isShowSharedText={true}
                    sharedStyle={{
                        gap: 0.5,
                        p: '6px 0px'
                    }}
                />
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                "& a": {
                    color: 'common.black',
                    transition: '200ms linear',
                    backgroundColor: bgColorCategory,
                    "&:hover": {
                        backgroundColor: 'common.white',
                    }
                }
            }}>
                <Typography
                    variant={'h5'}
                    sx={{
                        color: 'common.white',
                        fontSize: {xs: '24px', md: '28px'}
                    }}
                >
                    {title}
                </Typography>
                <Link
                    to={`/news?pageSize=10&current=1&filters[0][field]=category&filters[0][value]=${category}&filters[0][operator]=eq`}
                    style={{
                        textDecoration: 'none',
                        padding: '3px 10px',
                        borderRadius: '15px',
                        fontWeight: 500,
                    }}>
                    {translate(`news.sortByCategory.${category}`)}
                </Link>
            </Box>
            {
                place?.place?.city && place?.place?.address && (
                    <Box sx={{
                        display: 'flex',
                        gap: 0.5,
                        alignItems: 'center',
                        // color: 'common.white',
                        "& svg": {
                            color: 'silver'
                        },
                    }}>
                        <Place sx={{
                            width: {xs: '24px', md: '28px'},
                            height: {xs: '24px', md: '28px'}
                        }}/>
                        <Box sx={{
                            display: 'flex',
                            color: '#867f7f',
                            fontSize: {xs: '14px', md: '16px'},
                            flexDirection: 'column',
                        }}>
                            <span>
                                {place?.place?.city}
                            </span>
                            <span>
                                {place?.place?.address}
                            </span>
                        </Box>
                    </Box>
                )
            }
            <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'start',
                width: '100%',
                justifyContent: {xs: 'space-between', lg: 'start'},
                flexDirection: {xs: 'row', lg: 'column'}
            }}>
                <Box sx={{
                    color: 'common.white',
                    "& div": {
                        color: 'common.white',
                    },
                }}>
                    <Typography variant={'subtitle1'} sx={{
                        fontWeight: 600
                    }}>
                        {translate('news.dateEvent.title')}
                    </Typography>
                    <Box sx={{
                        marginLeft: '32px'
                    }}>
                        <NewsDateEvent dateEvent={news?.dateEvent}/>
                    </Box>
                </Box>
                <EstablishmentPopoverBtn establishment={establishment}/>
            {/*    ESTABLSIHMENTBTN*/}
            </Box>
        </Box>
    );
};
export default NewsMainInfo
