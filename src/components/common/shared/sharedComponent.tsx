import {Box, Button, Divider, IconButton, InputAdornment, SxProps, TextField} from "@mui/material";
import {useNotification, useTranslate} from "@refinedev/core";
import IosShareIcon from '@mui/icons-material/IosShare';
import CopyIcon from '@mui/icons-material/ContentCopy';
import {styled, alpha} from '@mui/material/styles';
import Menu, {MenuProps} from '@mui/material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import MenuItem from '@mui/material/MenuItem';
import {MoreHoriz, MoreHorizRounded} from "@mui/icons-material";
import {MouseEvent, useState} from "react";


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

import BookMarkButton from "@/components/buttons/BookMarkButton";
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
    type: 'establishment' | 'establishmentNews',
    isShowSharedText?: boolean,
    bookMarkStyle?: SxProps,
    sharedStyle?: SxProps,
    name?: string
}
const SharedComponent = ({
                             url,
                             title,
                             id,
                             isOnlyShared = false,
                             color,
                             type,
                             isShowSharedText = false,
                             bookMarkStyle,
                             sharedStyle,
                         }: TProps) => {

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

    const handleDeviceShare = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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
        }
    }
    const handleShare = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleClose(event);

        setOpenModal(true);
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
        fontSize: {xs: '16px', sm: '18px'},
        color: 'common.white',
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
            <ModalWindow
                open={openModal}
                timeOut={400}
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
                bodyProps={{
                    maxWidth: '100%',
                    p: 2
                }}
                contentProps={{
                    width: '90%',
                    maxWidth: '550px',
                    height: 'fit-content',
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
                        gap: 1,
                        width: '100%'
                    }}>
                        <TextField
                            fullWidth
                            type={'url'}
                            size={'medium'}
                            color={'info'}
                            sx={{
                                boxShadow: '0px 0px 2px 2px #c1c1c1',
                                borderRadius: '10px',
                                "& fieldset": {
                                    border: 'unset'
                                },
                                "& > div": {
                                    borderRadius: '10px',
                                },
                                bgcolor: 'cornflowerblue',
                                "& input": {
                                    color: '#f1f1f1'
                                }
                            }}
                            InputProps={{
                                readOnly: true,
                                endAdornment: <InputAdornment position={'end'}>
                                    <IconButton
                                        onClick={copy}
                                        sx={{
                                            bgcolor: 'common.black',
                                            borderRadius: '7px',
                                            transition: '200ms linear',
                                            "&:hover": {
                                                bgcolor: 'common.white',
                                                "& svg": {
                                                    color: 'common.black'
                                                }
                                            },
                                            "& svg": {
                                                color: 'common.white'
                                            }
                                        }}
                                    >
                                        <CopyIcon fontSize={'small'}/>
                                    </IconButton>
                                </InputAdornment>
                            }}
                            value={url}
                        />
                    </Box>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr 1fr 1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr'},
                        gap: 1,
                        alignItems: 'start',
                        width: '100%',
                        "& > div": {},
                        "& button": {
                            justifyContent: 'start',
                            textTransform: 'inherit',
                            p: '8px !important',
                            display: 'flex',
                            flexDirection: {xs: 'column', sm: 'row'},
                            alignItems: 'center',
                            gap: 2,
                            width: '100%',
                            transition: '200ms linear',
                            borderRadius: '10px',
                            "&:hover": {
                                bgcolor: '#2874CB !important',
                                "& > div": {
                                    color: '#f8f8f8'
                                }
                            }
                        }
                    }}>
                        <Box>
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
                        </Box>
                        <Box>
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
                        </Box>
                        <Box>
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
                        </Box>
                        <Box>
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
                        </Box>
                        <Box>
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
                        </Box>
                        <Box>
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
                        </Box>
                        <Box>
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
                        {
                            !navigator?.share ? "" : (
                                <Box>
                                    <Button
                                        onClick={handleDeviceShare}
                                    >
                                        <Box
                                            sx={{
                                                width: '46px',
                                                height: '46px',
                                                borderRadius: '50%',
                                                bgcolor: 'silver',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <MoreHorizRounded
                                                fontSize={'large'}
                                            />
                                        </Box>
                                        <Box sx={{
                                            ...sharedTextButtonStyle
                                        }}>
                                            {translate('buttons.more')}
                                        </Box>
                                    </Button>
                                </Box>
                            )
                        }
                    </Box>
                </Box>
            </ModalWindow>
            {/*)*/}
            {/*}*/}
        </Box>
    );
};
export default SharedComponent
