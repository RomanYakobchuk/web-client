import {Box, CardMedia, SxProps, Typography} from "@mui/material";
import {Place} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "@/contexts";
import {INews} from "@/interfaces/common";
import SharedComponent from "../../common/shared/sharedComponent";
import {useMobile} from "@/hook";
import {BookMarkButton} from "@/components";

type TProps = {
    news: INews,
    style?: SxProps
}
const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;
const NewsItem1Info = ({news, style}: TProps) => {

    const {_id, pictures, description, place, category, title} = news;

    const {width} = useMobile();
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();


    const bgColorCategory = category === 'general' ? '#ff5f56' : category === 'events' ? '#f9ab46' : category === 'promotions' ? '#3ebafa' : 'common.white';

    const descLL = width < 600 ? 30 : width < 900 ? 50 : width < 1200 ? 80 : 100;
    const descLN = width < 600 ? 3 : width < 900 ? 4 : width < 1200 ? 4 : 6;

    const newDesc = (description: string) => {
        let textLimited: string | string[] = description?.split('');
        if (textLimited?.length >= descLL) {
            textLimited = textLimited?.slice(0, descLL)?.join('');
            const lines = textLimited?.split('\r\n');
            if (lines?.length >= descLN) {
                return lines?.slice(0, descLN)?.join('\r\n');
            } else {
                return lines?.join('\r\n');
            }
        } else {
            const lines = textLimited?.join('')?.split('\r\n');
            if (lines?.length >= descLN) {
                return lines?.slice(0, descLN)?.join('\r\n');
            } else {
                return lines?.join('\r\n');
            }
        }
    }
    const showDescription = newDesc(description);

    const isShowAllDescription = description?.split('\r\n')?.length > descLN;

    const l = 14;
    const titleNews = title?.length > l ? title?.slice(0, l) : title;
    const isSplicedNewsTitle = title?.length > l;

    const xtraSmall = width < 500;
    return (
        <Link to={`/news/show/${_id}`}>
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: xtraSmall ? 'column' : 'row',
                gap: {xs: 2, md: 4, lg: 6},
                justifyContent: 'space-between',
                ...style
            }}>
                <CardMedia
                    className={'newsCardMedia'}
                    component="img"
                    image={pictures[0]?.url}
                    alt="card image"
                    sx={{
                        // order: 1,
                        borderRadius: "10px",
                        height: xtraSmall ? '200px' : {xs: '130px', sm: '170px', md: '200px'},
                        width: xtraSmall ? '100%' : {xs: 'calc(45% - 8px)', lg: 'calc(35% - 8px)'},
                    }}
                />
                <Box
                    className={'newsTextContentCard'}
                    sx={{
                        display: 'flex',
                        width: xtraSmall ? '100%' : {xs: 'calc(55% - 8px)', lg: 'calc(65% - 8px)'},
                        flexDirection: 'column',
                        p: '0 0 10px 0',
                        justifyContent: 'space-between'
                    }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            flexWrap: 'wrap',
                            // gap: 2,
                            justifyContent: place?.place?.city ? 'space-between' : 'end'
                        }}>
                            {
                                place?.place?.city && (
                                    <Box
                                        className={'newsPlaceCard'}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            gap: 1,
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            colro: mode === "dark" ? '#f1e6e6' : "#1d1a39"
                                        }}>
                                        <Place
                                            sx={{
                                                fontSize: 24,
                                                color: "secondary.main",
                                            }}
                                        />
                                        <Box sx={{
                                            fontSize: '16px',
                                            display: 'flex',
                                            height: '30px',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            {
                                                place?.place?.city
                                            }
                                        </Box>
                                    </Box>
                                )
                            }
                            <Typography
                                className={'newsCategoryCard'}
                                sx={{
                                    color: 'common.black',
                                    bgcolor: bgColorCategory,
                                    p: '3px 10px',
                                    borderRadius: '15px',
                                    fontWeight: 500,
                                }}>
                                {translate(`news.sortByCategory.${category}`)}
                            </Typography>
                        </Box>
                        {/*<BookMarkButton*/}
                        {/*    id={_id}*/}
                        {/*    bgColor={'transparent'}*/}
                        {/*    color={'common.white'}*/}
                        {/*    type={'institutionNews'}*/}
                        {/*    showText={false}*/}
                        {/*    style={{*/}
                        {/*        p: '5px',*/}
                        {/*        borderRadius: '5px',*/}
                        {/*        minWidth: '20px',*/}
                        {/*        bgcolor: mode === 'dark' ? '#86a8cf' : '#e6f2ff',*/}
                        {/*        "& svg": {*/}
                        {/*            fontSize: {xs: '26px', sm: '30px'}*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </Box>
                    <Typography
                        className={'newsTitleCard'}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: {xs: '18px', md: '1.6rem'},
                            fontWeight: 600
                        }}>
                        {titleNews}
                        {isSplicedNewsTitle && '...'}
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'end'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'start',
                        }}>
                            <MDEditor.Markdown source={showDescription}
                                               style={{
                                                   whiteSpace: 'pre-wrap',
                                                   fontSize: "14px",
                                                   padding: "5px 0",
                                                   background: 'transparent',
                                                   color: mode === 'dark' ? '#fff' : '#000'
                                               }}/>
                            {
                                isShowAllDescription && (
                                    <span style={{
                                        fontSize: '14px',
                                        textTransform: 'lowercase'
                                    }}>{translate('buttons.more')}</span>
                                )
                            }
                        </Box>
                        <Box>
                            {
                                width < 1200 ? (
                                    <SharedComponent
                                        name={title}
                                        isShowSharedText={true}
                                        url={`${CLIENT_URL}/news/show/${_id}`}
                                        title={title} type={"institutionNews"}
                                        id={_id}
                                    />
                                ) : (
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'end',
                                        gap: 1
                                    }}>
                                        <SharedComponent
                                            url={`${import.meta.env.VITE_APP_CLIENT_API}/news/show/${_id}`}
                                            title={title}
                                            name={title}
                                            isOnlyShared
                                            isShowSharedText={false}
                                            type={"institutionNews"}
                                            sharedStyle={{
                                                "& svg": {
                                                    order: 1,
                                                    fontSize: {xs: '26px', sm: '30px'}
                                                },
                                                bgcolor: '#369fff',
                                                color: '#fff',
                                                borderRadius: '5px',
                                                transition: '200ms linear',
                                                "&:hover": {
                                                    bgcolor: '#6382ff'
                                                }
                                            }}
                                        />
                                        <BookMarkButton
                                            id={_id}
                                            type={"institutionNews"}
                                            showText={false}
                                            color={'common.white'}
                                            style={{
                                                bgcolor: '#fb952a',
                                                color: '#fff',
                                                borderRadius: '5px',
                                                transition: '200ms linear',
                                                minWidth: '30px',
                                                "&:hover": {
                                                    bgcolor: '#fe6522'
                                                }
                                            }}
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Link>
    );
};
export default NewsItem1Info
