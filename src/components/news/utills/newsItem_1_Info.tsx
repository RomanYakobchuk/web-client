import {Box, CardMedia, SxProps, Typography} from "@mui/material";
import {Place} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {useTranslate} from "@refinedev/core";

import {ColorModeContext} from "../../../contexts";
import {INews} from "../../../interfaces/common";
import SharedComponent from "../../common/shared/sharedComponent";

type TProps = {
    news: INews,
    style?: SxProps
}
const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;
const NewsItem1Info = ({news, style}: TProps) => {

    const {_id, pictures, description, place, category, title} = news;

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();


    const bgColorCategory = category === 'general' ? '#ff5f56' : category === 'events' ? '#f9ab46' : category === 'promotions' ? '#3ebafa' : 'common.white';

    const showDescription = description?.split('\r\n')?.length > 3 ? description?.split('\r\n')?.slice(0, 3)?.join('\r\n') : description;

    const isShowAllDescription = description?.split('\r\n')?.length > 3;

    return (
        <Link to={`/news/show/${_id}`}>
            <Box sx={{
                position: 'relative',
                width: {xs: 'calc(100% - 48px)', sm: 'calc(100% - 60px)', md: 'calc(100% - 64px)', lg: 'calc(100% - 72px)'},
                height: '100%',
                marginLeft: {xs: '48px', sm: '56px', md: '64px', lg: '72px'},
                "&::before": {
                    display: 'block',
                    position: 'absolute',
                    left: {xs: '-24px', sm: '-28px', md: '-32px', lg: '-36px'},
                    content: "''",
                    width: '1px',
                    height: '100%',
                    bgcolor: 'silver'
                },
                display: 'flex',
                flexDirection: 'column',
                gap: {xs: 1, md: 2},
                ...style
            }}>
                <CardMedia
                    className={'newsCardMedia'}
                    component="img"
                    image={pictures[0]?.url}
                    alt="card image"
                    sx={{
                        borderRadius: "10px",
                        height: {xs: '200px', sm: '250px', md: '300px'},
                        width: {xs: '100%'},
                    }}
                />
                <Box
                    className={'newsTextContentCard'}
                    sx={{
                        display: 'flex',
                        width: '100%',
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
                            gap: 2,
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
                                            height: '50px',
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
                            fontSize: {xs: '1.4rem', md: '1.6rem'},
                            fontWeight: 700
                        }}>
                        {title}
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
                            <SharedComponent
                                isShowSharedText={true}
                                url={`${CLIENT_URL}/news/show/${_id}`}
                                title={title} type={"institutionNews"}
                                id={_id}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Link>
    );
};
export default NewsItem1Info
