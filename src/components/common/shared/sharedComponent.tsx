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
import BookMarkButton from "../buttons/BookMarkButton";


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
    sharedStyle?: SxProps
}
const SharedComponent = ({url, title, id, isOnlyShared = false, color, type, isShowSharedText = false, bookMarkStyle, sharedStyle}: TProps) => {

    const translate = useTranslate();
    const {open: openNotification} = useNotification();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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
        handleClose(event);
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
                text: url,
            })
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
    }
    return (
        <Box>
            {
                isOnlyShared ? (
                    <Button
                        sx={{
                            color: 'common.white',
                            textTransform: 'inherit',
                            gap: 1,
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: '30px',
                            ...sharedStyle
                        }}
                        onClick={handleShare}>
                        {
                            !navigator.share ? (
                                <CopyIcon sx={{
                                    color: color
                                }}/>
                            ) : (
                                <ShareIcon sx={{
                                    color: color
                                }}/>
                            )
                        }
                        {
                            isShowSharedText && translate(`buttons.${!navigator.share ? 'copy' : 'share'}`)
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
                                    onClick={handleShare}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        textTransform: 'inherit',
                                        color: 'common.white',
                                        minWidth: '30px',
                                        ...sharedStyle
                                    }}
                                >
                                    {
                                        isShowSharedText && (
                                            translate(`buttons.${!navigator.share ? 'copy' : 'share'}`)
                                        )
                                    }
                                    {
                                        !navigator.share ? <CopyIcon/> : <IosShareIcon/>
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
                                                p: '6px 8px',
                                                bgcolor: 'transparent',
                                                boxShadow: 'unset',
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
        </Box>
    );
};
export default SharedComponent
