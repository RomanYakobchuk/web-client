import {styled, alpha} from '@mui/material/styles';
import Menu, {MenuProps} from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ShareIcon from '@mui/icons-material/Share';
import IosShareIcon from '@mui/icons-material/IosShare';
import CopyIcon from '@mui/icons-material/ContentCopy';
import {Box, Button, Divider, IconButton, SxProps} from "@mui/material";
import {MoreHoriz} from "@mui/icons-material";
import {MouseEvent, useState} from "react";
import {useNotification, useTranslate} from "@refinedev/core";

import {
    EmailShareButton,
    EmailIcon,
    FacebookShareButton,
    FacebookIcon,
    TelegramShareButton,
    TelegramIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon,
    RedditShareButton,
    RedditIcon,
    ViberShareButton,
    ViberIcon
} from "react-share";

import BookMarkButton from "../buttons/BookMarkButton";
import {ModalWindow} from "@/components";


const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        backgroundColor: theme.palette.common.black,
        color:
        theme.palette.common.white,
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.common.white,
                backgroundColor: theme.palette.common.black,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

type TProps = {
    url: string,
    title: string,
    id?: string,
    isOnlyShared?: boolean
    color?: string,
    type: 'institution' | 'institutionNews',
    isShowSharedText?: boolean,
    bookMarkStyle?: SxProps,
    sharedStyle?: SxProps,
    name?: string
}
const SharedComponent = ({url, title, id, isOnlyShared = false, color, type, isShowSharedText = false, bookMarkStyle, sharedStyle, name}: TProps) => {

    const translate = useTranslate();
    const {open: openNotification} = useNotification();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const dataShare = {
        title: title,
        url: url,
        text: url,
    };
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(null);
    };

    const handleShare = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleClose(event);

        if (navigator.share) {
            navigator.share(dataShare)
                .then(() => openNotification?.({
                    type: 'success',
                    message: 'Link shared successful',
                    description: 'Shared',
                }))
                .catch(() => openNotification?.({
                    type: 'error',
                    description: 'Shared',
                    message: 'Error shared link'
                }))
        } else {
            setOpenModal(true)
        }
    }
    const copy = () => {
        navigator.clipboard.writeText(url)?.then(() => openNotification?.({
            type: 'success',
            description: 'Shared',
            message: 'Link copied successful'
        }))?.catch(() => openNotification?.({
            type: 'error',
            description: 'Shared',
            message: 'Error copied link'
        }));
    }
    const sharedIconButtonStyle = {
        size: 46,
        round: true
    }
    const sharedTextButtonStyle = {
        fontSize: {xs: '18px', sm: '22px'},
        fontWeight: 600
    }
    return (
        <Box>
            {
                isOnlyShared ? (
                    <Button
                        variant={'text'}
                        sx={{
                            color: 'common.white',
                            textTransform: 'inherit',
                            gap: 1,
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: '30px',
                            p: '5px',
                            "& svg": {
                                fontSize: {xs: '26px', sm: '30px'}
                            },
                            ...sharedStyle
                        }}
                        onClick={handleShare}>
                        <ShareIcon sx={{
                            color: color
                        }}/>
                        {
                            isShowSharedText && translate(`buttons.share`)
                        }
                    </Button>
                ) : (
                    <>
                        <IconButton
                            id={'shared-menu-button'}
                            aria-controls={open ? 'shared-menu-list' : undefined}
                            aria-haspopup={'true'}
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <MoreHoriz sx={{
                                color: color
                            }}/>
                        </IconButton>
                        <StyledMenu
                            open={open}
                            onClose={handleClose}
                            anchorEl={anchorEl}
                            id={'shared-menu-list'}
                            MenuListProps={{
                                'aria-labelledby': 'shared-menu-button'
                            }}
                        >
                            <MenuItem
                                disableRipple
                            >
                                <Button
                                    variant={'text'}
                                    onClick={handleShare}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textTransform: 'inherit',
                                        p: '0px 8px',
                                        color: 'common.white',
                                        minWidth: '30px',
                                        ...sharedStyle
                                    }}
                                >
                                    {
                                        isShowSharedText && (
                                            translate('buttons.share')
                                        )
                                    }
                                    {
                                        <IosShareIcon/>
                                    }
                                </Button>
                            </MenuItem
                            >
                            {
                                !isOnlyShared && id && (
                                    <Divider sx={{
                                        bgcolor: 'silver'
                                    }}/>
                                )
                            }
                            {
                                !isOnlyShared && id && (
                                    <MenuItem disableRipple>
                                        <BookMarkButton
                                            style={{
                                                p: '0px 8px',
                                                bgcolor: 'transparent',
                                                boxShadow: 'unset',
                                                color: 'common.white',
                                                ":hover": {
                                                    boxShadow: 'unset',
                                                    bgcolor: 'transparent',
                                                },
                                                ...bookMarkStyle
                                            }}
                                            type={type} showText={true} id={id}/>
                                    </MenuItem>
                                )
                            }
                        </StyledMenu>
                    </>
                )
            }
            {/*{*/}
            {/*    openModal && (*/}
            <ModalWindow
                open={openModal}
                setOpen={setOpenModal}
                title={
                    <Box sx={{
                        fontSize: {xs: '18px', sm: '22px'},
                        fontWeight: 600,
                        p: '5px 16px'
                    }}>
                        {translate('buttons.share')}
                    </Box>
                }
                contentProps={{
                    width: '90%',
                    maxWidth: '550px',
                    maxHeight: '70%',
                    borderRadius: '10px'
                }}
            >
                <Box sx={{
                    py: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}>
                        <a href={url}>{name}</a>
                        <IconButton onClick={copy}>
                            <CopyIcon fontSize={'small'}/>
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        alignItems: 'start',
                        width: '100%',
                        "& button": {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }
                    }}>
                        <TelegramShareButton
                            url={url}
                        >
                            <TelegramIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Telegram
                            </Box>
                        </TelegramShareButton>
                        <FacebookShareButton
                            url={url}
                        >
                            <FacebookIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Facebook
                            </Box>
                        </FacebookShareButton>
                        <TwitterShareButton
                            url={url}
                        >
                            <TwitterIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Twitter
                            </Box>
                        </TwitterShareButton>
                        <ViberShareButton
                            url={url}
                        >
                            <ViberIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Viber
                            </Box>
                        </ViberShareButton>
                        <WhatsappShareButton
                            url={url}
                        >
                            <WhatsappIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Whatsapp
                            </Box>
                        </WhatsappShareButton>
                        <RedditShareButton
                            url={url}
                        >
                            <RedditIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Reddit
                            </Box>
                        </RedditShareButton>
                        <EmailShareButton
                            url={url}
                        >
                            <EmailIcon {...sharedIconButtonStyle}/>
                            <Box sx={{
                                ...sharedTextButtonStyle
                            }}>
                                Email
                            </Box>
                        </EmailShareButton>
                    </Box>
                </Box>
            </ModalWindow>
            {/*)*/}
            {/*}*/}
        </Box>
    );
};
export default SharedComponent
