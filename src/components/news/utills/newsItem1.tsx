import {Link} from "react-router-dom";
import {Avatar, Box, CardMedia, Typography} from "@mui/material";
import {BookMarkButton} from "../../index";
import {Place} from "@mui/icons-material";
import React, {useContext} from "react";
import {IGetIdentity, INews, ProfileProps, PropertyProps} from "../../../interfaces/common";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {ColorModeContext} from "../../../contexts";
import MDEditor from "@uiw/react-md-editor";

type IProps = {
    itemNews: INews
}
const NewsItem1 = ({itemNews}: IProps) => {
    const {data: identity} = useGetIdentity<IGetIdentity>();
    const user = identity?.user as ProfileProps;

    const {_id, title, createdBy, category, pictures, description, place} = itemNews;

    const establishmentInfo = itemNews?.institutionId as PropertyProps;

    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);

    const bgColorCategory = category === 'general' ? '#ff5f56' : category === 'event' ? '#f9ab46' : category === 'promotions' ? '#3ebafa' : 'common.white';

    const showDescription = description?.split('\r\n')?.length > 3 ? description?.split('\r\n')?.slice(0, 3)?.join('\r\n') : description;

    const isShowAllDescription = description?.split('\r\n')?.length > 3;
    return (
        <Box sx={{
            width: '100%',
        }}>
            <Box sx={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'common.black',
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
                    to={`/all_institutions/show/${establishmentInfo?._id}`}
                    style={{
                        display: 'flex',
                        gap: "16px",
                    }}
                >
                    <Avatar
                        src={establishmentInfo?.pictures[0]?.url}
                        alt={establishmentInfo?.pictures[0]?.name}
                        sx={{
                            width: {xs: 48, sm: 56, md: 64, lg: 72},
                            height: {xs: 48, sm: 56, md: 64, lg: 72},
                        }}
                    />
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
                                fontSize: {xs: '18px', md: '22px'}
                            }}
                        >
                            {establishmentInfo?.title}
                        </Typography>
                        <Box
                            sx={{
                                bgcolor: 'common.white',
                                borderRadius: '10px',
                                color: 'common.black',
                                p: '1px 7px',
                                fontSize: {xs: '14px', md: '16px'}
                            }}
                        >
                            {translate(`home.sortByType.${establishmentInfo?.type}`)}
                        </Box>
                    </Box>
                </Link>
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
                        gap: {xs: 1, md: 2}
                    }}>
                        <CardMedia
                            component="img"
                            image={pictures[0]?.url}
                            alt="card image"
                            sx={{
                                borderRadius: "10px",
                                height: {xs: '200px', sm: '250px', md: '300px'},
                                width: {xs: '100%'},
                            }}
                        />
                        <Box sx={{
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
                                justifyContent: 'space-between'
                            }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: place?.place?.city ? 'space-between' : 'end'
                                }}>
                                    {
                                        place?.place?.city && (
                                            <Box sx={{
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
                                                        color: "secondary",
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
                                    <Typography sx={{
                                        color: 'common.black',
                                        bgcolor: bgColorCategory,
                                        p: '3px 10px',
                                        borderRadius: '15px',
                                        fontWeight: 500,

                                    }}>
                                        {translate(`news.sortByCategory.${category}`)}
                                    </Typography>
                                </Box>
                                {
                                    createdBy !== user?._id && (
                                        <BookMarkButton
                                            id={_id}
                                            bgColor={'transparent'}
                                            color={'common.white'}
                                            type={''}
                                            showText={false}
                                            style={{
                                                p: '5px',
                                                borderRadius: '5px',
                                                minWidth: '20px',
                                                bgcolor: mode === 'dark' ? '#86a8cf' : '#e6f2ff',
                                                "& svg": {
                                                    fontSize: {xs: '26px', sm: '30px'}
                                                }
                                            }}
                                        />
                                    )
                                }
                            </Box>
                            <Typography sx={{
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
                        </Box>
                    </Box>
                </Link>
            </Box>
        </Box>
    );
};
export default NewsItem1
