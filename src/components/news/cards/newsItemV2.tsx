import {useState, MouseEvent, useContext} from "react";
import {Link} from "react-router-dom";
import {Box, Popover, Typography} from "@mui/material";
import {useTranslate} from "@refinedev/core";
import {CallMadeSharp, Place} from "@mui/icons-material";
import MDEditor from "@uiw/react-md-editor";

import {ColorModeContext} from "@/contexts";
import {INews, PropertyProps} from "@/interfaces/common";
import BookMarkButton from "../../common/buttons/BookMarkButton";
import SharedComponent from "../../common/shared/sharedComponent";
import {useMobile} from "@/hook";

type TProps = {
    news: INews
}
const NewsItemV2 = ({news}: TProps) => {

    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {width} = useMobile();

    const [anchorElPopover, setAnchorElPopover] = useState<HTMLDivElement | null>(null);

    const handleClickPopover = (event: MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setAnchorElPopover(event.currentTarget);
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }
    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'news_popover_info' : undefined;

    const imageUrl = news?.pictures?.length > 0 ? news?.pictures[0]?.url : ''

    const establishment = news?.establishmentId as PropertyProps;

    const showPopoverDescription = news?.description?.split('\r\n')?.length > 6 ? news?.description?.split('\r\n')?.slice(0, 6)?.join('\r\n') : news?.description;

    const titleEstanlishment = establishment?.title?.length > 14 ? establishment?.title?.slice(0, 14) : establishment?.title;
    const titleNews = news?.title?.length > 20 ? news?.title?.slice(0, 20) : news?.title;

    const isSplicedTitle = establishment?.title?.length > 14;
    const isSplicedNewsTitle = news?.title?.length > 20;

    const descLL = 50
    const descLN = 4;

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
    const showDescription = newDesc(news?.description);

    const isShowAllDescription = news?.description?.split('\r\n')?.length > descLN;

    return (
        <Link
            style={{
                textDecoration: 'none'
            }}
            to={`/news/show/${news?._id}`}
        >
            <Box
                sx={{
                    color: 'common.white',
                    border: 'none',
                    width: '100%',
                    // maxWidth: '350px',
                    bgcolor: 'common.black',
                    borderRadius: {xs: '10px', sm: '16px'},
                    // margin: '0 auto',
                    // borderRadius: '15px',
                    // backgroundImage: `url("${imageUrl}")`,
                    // backgroundPosition: 'center',
                    // backgroundSize: 'cover',
                    // height: {xs: '220px', sm: '200px', lg: '220px'},
                    height: '100%',
                    // p: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent: 'space-between',
                    gap: 1
                }}
                // onClick={handleClickPopover}
            >
                <Box sx={{
                    width: '100%',
                    height: {xs: '150px', sm: '200px'},
                    "& img":{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: {xs: '10px 10px 0px 0px', sm: '16px 16px 0px 0px'}
                    }
                    // borderRadius: '10px',
                }}>
                    <img
                        src={imageUrl}
                        alt={imageUrl}
                    />
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: {xs: '7px', sm: '12px'},
                    left: {xs: '7px', sm: '12px'},
                    bgcolor: 'common.white',
                    p: '6px 12px',
                    width: 'fit-content',
                    color: 'common.black',
                    fontWeight: 600,
                    borderRadius: '20px',
                    fontSize: {xs: '16px', sm: '14px', lg: '16px'}
                }}>
                    {translate(`news.sortByCategory.${news?.category}`)}
                </Box>
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    position: 'absolute',
                    top: {xs: '7px', sm: '12px'},
                    right: {xs: '7px', sm: '12px'},
                }}>
                    <SharedComponent
                        url={`${import.meta.env.VITE_APP_CLIENT_API}/news/show/${news?._id}`}
                        title={news?.title}
                        name={news?.title}
                        type={"establishmentNews"}
                        isOnlyShared
                        sharedStyle={{
                            color: '#f1f1f1',
                            bgcolor: '#cf6b59',
                            width: '30px',
                            height: '30px',
                            borderRadius: '5px',
                            p: 2
                        }}
                    />
                    <BookMarkButton
                        style={{
                            width: '30px',
                            height: '30px',
                            borderRadius: '5px',
                            minWidth: '20px',
                            p: 2,
                            bgcolor: mode === 'dark' ? '#2f4496' : '#9cabe3'
                        }}
                        color={'common.white'}
                        id={news?._id}
                        type={"establishmentNews"}
                        showText={false}
                    />
                </Box>
                <Box sx={{
                    width: '100%',
                    height: 'auto',
                    p: {xs: 1, sm: 2},
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 1
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            width: 'calc(100% + 8px)',
                            ml: '-4px',
                            bgcolor: 'modern.modern_2.second',
                            p: 0.5,
                            borderRadius: '10px'
                        }}
                    >
                        {
                            establishment?._id && (
                                <Box sx={{
                                    // p: {xs: '4px 12px', lg: '8px 12px'},
                                    // color: '#f1f1f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    // bgcolor: 'rgba(1, 1, 1, 0.4)',
                                    // borderRadius: '30px',
                                    // backdropFilter: 'blur(15px)',
                                    "& img": {
                                        width: {xs: '36px', sm: '42px'},
                                        height: {xs: '36px', sm: '42px'},
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }
                                }}>
                                    <img
                                        src={establishment?.pictures?.length > 0 ? establishment?.pictures[0]?.url : ''}
                                        alt={'establishment_picture'}
                                    />
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'start',
                                    }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 600,
                                                fontSize: '14px'
                                            }}
                                        >
                                            {titleEstanlishment}
                                            {isSplicedTitle && '...'}
                                        </Typography>
                                        <Box sx={{
                                            fontSize: '14px'
                                        }}>
                                            {translate(`home.sortByType.${establishment?.type}`)}
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        }
                    </Box>
                    <Box
                        sx={{
                            // bgcolor: 'rgba(255, 255, 255, 0.4)',
                            // backdropFilter: 'blur(5px)',
                            // p: '0px 0 0px 10px',
                            // color: '#1a1a1a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 'fit-content',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: {xs: '16px', md: '18px'},
                            "& a": {
                                textDecoration: 'none',
                                color: '#fafafa',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                bgcolor: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                boxShadow: '0px 0px 3px 0px #fafafa',
                                "& svg": {
                                    color: '#fafafa'
                                }
                            }
                        }}
                    >
                        {news?.title}
                        {isSplicedNewsTitle && '...'}
                        {/*<Link*/}
                        {/*    to={`/news/show/${news?._id}`}*/}
                        {/*>*/}
                        {/*    <CallMadeSharp/>*/}
                        {/*</Link>*/}
                    </Box>
                    <Box sx={{
                        "*":{
                            color: 'common.white'
                        }
                    }}>
                        <MDEditor.Markdown
                            style={{
                                fontSize: '14px',
                                background: 'transparent',
                            }}
                            source={showDescription?.trim() + `${isShowAllDescription ? '...' : ''}`}
                        />
                    </Box>
                </Box>
            </Box>
            {/*<Popover*/}
            {/*    id={popoverId}*/}
            {/*    open={openPopover}*/}
            {/*    anchorEl={anchorElPopover}*/}
            {/*    onClose={handleClosePopover}*/}
            {/*    anchorOrigin={{*/}
            {/*        vertical: 'center',*/}
            {/*        horizontal: 'center',*/}
            {/*    }}*/}
            {/*    transformOrigin={{*/}
            {/*        vertical: 'center',*/}
            {/*        horizontal: 'center',*/}
            {/*    }}*/}
            {/*    sx={{*/}
            {/*        "& div.MuiPaper-root": {*/}
            {/*            backgroundColor: 'common.black',*/}
            {/*            boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,*/}
            {/*            borderRadius: '7px'*/}
            {/*        },*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Box sx={{*/}
            {/*        width: '300px',*/}
            {/*        height: 'fit-content',*/}
            {/*        // maxHeight: {xs: '400px', md: '600px', lg: '700px'},*/}
            {/*        overflowY: 'auto',*/}
            {/*        display: 'flex',*/}
            {/*        p: 2,*/}
            {/*        flexDirection: 'column',*/}
            {/*        color: 'common.white',*/}
            {/*        gap: 1*/}
            {/*    }}>*/}
            {/*        <Typography*/}
            {/*            variant={'h5'}*/}
            {/*        >*/}
            {/*            {translate('news.create.description')}*/}
            {/*        </Typography>*/}
            {/*        <Box sx={{*/}
            {/*            whiteSpace: 'break-spaces'*/}
            {/*        }}>*/}
            {/*            {showPopoverDescription}*/}
            {/*            {*/}
            {/*                isShowAllDescription && '...'*/}
            {/*            }*/}
            {/*        </Box>*/}
            {/*        {*/}
            {/*            news?.place?.place?.city && (*/}
            {/*                <Box sx={{*/}
            {/*                    display: 'flex',*/}
            {/*                    alignItems: 'center',*/}
            {/*                    gap: 0.5,*/}
            {/*                    my: 2*/}
            {/*                }}>*/}
            {/*                    <Place/>*/}
            {/*                    {news.place.place.city}*/}
            {/*                </Box>*/}
            {/*            )*/}
            {/*        }*/}
            {/*        <Box sx={{*/}
            {/*            width: '100%',*/}
            {/*            display: 'flex',*/}
            {/*            justifyContent: 'center',*/}
            {/*            alignItems: 'center',*/}
            {/*            "& a": {*/}
            {/*                textDecoration: 'none',*/}
            {/*                fontSize: '16px',*/}
            {/*                fontWeight: 600,*/}
            {/*                display: 'flex',*/}
            {/*                alignItems: 'center',*/}
            {/*                gap: 1,*/}
            {/*                bgcolor: 'common.white',*/}
            {/*                color: 'common.black',*/}
            {/*                p: '7px 20px',*/}
            {/*                borderRadius: '20px',*/}
            {/*                width: 'fit-content'*/}
            {/*            }*/}
            {/*        }}>*/}
            {/*            <Link*/}
            {/*                to={`/news/show/${news?._id}`}*/}
            {/*            >*/}
            {/*                {translate('buttons.details')}*/}
            {/*                <CallMadeSharp/>*/}
            {/*            </Link>*/}
            {/*        </Box>*/}
            {/*    </Box>*/}
            {/*</Popover>*/}
        </Link>
    );
};
export default NewsItemV2
