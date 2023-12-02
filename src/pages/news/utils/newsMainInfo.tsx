import {useState, MouseEvent, useContext} from "react";
import {Box, Button, Popover, Typography} from "@mui/material";
import {Apartment, East, Place} from "@mui/icons-material";
import {useTranslate} from "@refinedev/core";
import dayjs from "dayjs";
import {Link} from "react-router-dom";

import {INews, PropertyProps} from "../../../interfaces/common";
import {BookMarkButton} from "../../../components";
import SharedComponent from "../../../components/common/shared/sharedComponent";
import {ColorModeContext} from "../../../contexts";

type TProps = {
    news: INews
}
const CLIENT_URL = import.meta.env.VITE_APP_CLIENT_API;
const NewsMainInfo = ({news}: TProps) => {
    const {mode} = useContext(ColorModeContext);
    const translate = useTranslate();
    const {_id, title, category, place, institutionId, dateEvent} = news;

    const [anchorElPopover, setAnchorElPopover] = useState<HTMLButtonElement | null>(null);

    const handleClickPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElPopover(event.currentTarget)
    }
    const handleClosePopover = () => {
        setAnchorElPopover(null);
    }

    const bgColorCategory = category === 'general' ? '#ff5f56' : category === 'events' ? '#f9ab46' : category === 'promotions' ? '#3ebafa' : 'common.white';

    const establishment = institutionId as PropertyProps;

    const openPopover = Boolean(anchorElPopover);
    const popoverId = openPopover ? 'establishment_popover' : undefined;
    return (
        <Box sx={{
            wdith: '100%',
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
                    type={'institutionNews'}
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
                    type={'institutionNews'}
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
                {
                    dateEvent?.length > 0 && (
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
                                {
                                    dateEvent?.map((event, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            position: 'relative',
                                            "::before": {
                                                content: '""',
                                                position: 'absolute',
                                                left: '-15px',
                                                top: '5px',
                                                width: '7px',
                                                height: '7px',
                                                borderRadius: '50%',
                                                bgcolor: 'common.white'
                                            }
                                        }}>
                                            <div>
                                                {
                                                    event?.schedule?.from && (
                                                        <span>
                                                        {dayjs(event?.schedule?.from)?.format('DD/MM/YYYY')}
                                                    </span>
                                                    )
                                                }
                                                {
                                                    event?.schedule?.from && event?.schedule?.to && (
                                                        ' - '
                                                    )
                                                }
                                                {
                                                    event?.schedule?.to && (
                                                        <span>
                                                        {dayjs(event?.schedule?.to)?.format('DD/MM/YYYY')}
                                                    </span>
                                                    )
                                                }
                                            </div>
                                            <div>
                                                {
                                                    event?.time?.from && (
                                                        <span>
                                                        {event?.time?.from as string}
                                                    </span>
                                                    )
                                                }
                                                {
                                                    event?.time?.from && event?.time?.to && (
                                                        ' - '
                                                    )
                                                }
                                                {
                                                    event?.time?.to && (
                                                        <span>
                                                        {event?.time?.to as string}
                                                    </span>
                                                    )
                                                }
                                            </div>
                                        </Box>
                                    ))
                                }
                            </Box>
                        </Box>
                    )
                }
                <Box>
                    <Button
                        variant={'text'}
                        color={'info'}
                        onClick={handleClickPopover}
                        aria-describedby={popoverId}
                        sx={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,

                        }}
                    >
                        <Apartment/>
                        {translate('home.one')}
                    </Button>
                    <Popover
                        id={popoverId}
                        open={openPopover}
                        anchorEl={anchorElPopover}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        sx={{
                            "& div.MuiPaper-root": {
                                backgroundColor: 'modern.modern_2.second',
                            },
                            "& div.css-ngp70-MuiPaper-root-MuiPopover-paper": {
                                boxShadow: `0px 0px 10px 0px ${mode === 'dark' ? '#f1f1f1' : '#424242'}`,
                                borderRadius: '10px'
                            }
                        }}
                    >
                        <Box sx={{
                            p: 1.5,
                            width: '100%',
                            maxWidth: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            "& a": {
                                color: '#fff',
                                bgcolor: 'info.main',
                                transition: '200ms linear',
                                "&:hover": {
                                    bgcolor: 'modern.modern_1.second',
                                }
                            }
                        }}>
                            {
                                establishment?._id && (
                                    <>
                                        {
                                            establishment?.pictures?.length > 0 && (
                                                <Box sx={{
                                                    width: '100%',
                                                    height: '200px',
                                                    "& img": {
                                                        borderRadius: '7px',
                                                        objectFit: 'cover'
                                                    }
                                                }}>
                                                    <img
                                                        style={{
                                                            width: '100%',
                                                            height: '100%'
                                                        }}
                                                        src={establishment?.pictures[0]?.url}
                                                        alt={establishment?.pictures[0]?.name}
                                                    />
                                                </Box>
                                            )
                                        }
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'end',
                                            gap: 2,
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            flexWrap: 'wrap'
                                        }}>
                                            <Typography variant={'h5'} sx={{
                                                fontSize: '20px',
                                                whiteSpace: 'break-spaces',
                                                color: 'common.white'
                                            }}>
                                                {establishment?.title}
                                            </Typography>
                                            <Box sx={{
                                                bgcolor: 'common.white',
                                                color: 'common.black',
                                                p: '3px 10px',
                                                borderRadius: '10px'
                                            }}>
                                                {translate(`home.create.type.${establishment?.type}`)}
                                            </Box>
                                        </Box>
                                        <Link
                                            style={{
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '16px',
                                                margin: '10px 0',
                                                width: '100%',
                                                justifyContent: 'center',
                                                padding: '10px',
                                                borderRadius: '10px'
                                            }}
                                            to={`/all_institutions/show/${establishment?._id}`}
                                        >
                                            {translate('home.one')}
                                            <East/>
                                        </Link>
                                    </>
                                )
                            }
                        </Box>
                    </Popover>
                </Box>
            </Box>
        </Box>
    );
};
export default NewsMainInfo
