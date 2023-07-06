import {Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import dayjs from "dayjs";
import {ContentCopy, ReplyOutlined} from "@mui/icons-material";
import {useEffect, useState, MouseEvent, useRef} from "react";
import {useGetIdentity, useTranslate} from "@refinedev/core";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

import {IConversation, IMessage, ProfileProps} from "../../../interfaces/common";
import {useMobile} from "../../../utils";
import useLongPress from "../../../utils/useLongPress";

import relativeTime from "dayjs/plugin/relativeTime"
import 'dayjs/locale/uk';
import 'dayjs/locale/en';

dayjs.extend(relativeTime);

interface IProps {
    message: IMessage,
    conversation?: IConversation,
    receiver: ProfileProps,
    setReplyTo: (item: IMessage) => void
}

const MessageCard = ({message, conversation, receiver, setReplyTo}: IProps) => {
    const {data: user} = useGetIdentity<ProfileProps>();
    const {i18n} = useTranslation();
    const {device, width} = useMobile();
    const navigate = useNavigate();
    const translate = useTranslate();

    useEffect(() => {
        i18n.language === "ua" ? dayjs.locale('uk') : dayjs.locale('en')
    }, [i18n.language]);

    const [showReply, setShowReply] = useState(false);
    const currentDate = dayjs();
    const createdAtDate = dayjs(message?.createdAt);

    const diffInHour = currentDate.diff(createdAtDate, 'hour');

    const onClick = () => {
        // navigate((message?.sender === conversation?.managerId?._id)
        //     ? `/all_institutions/show/${conversation?.institutionId?._id}`
        //     : `/capl`
        // )
        console.log('press')
    }
    const onLongPress = () => {
        setAnchorEl(document.getElementById(`demo-positioned-button${message?._id}`));
    }
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 300,
    };
    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions)
    const onContextMenu = (event: MouseEvent) => {
        event.preventDefault();
    };
    const textRef = useRef<HTMLDivElement>(null);

    const copyText = async () => {
        if (textRef.current) {
            const textToCopy = textRef.current.innerText;
            await navigator.clipboard.writeText(textToCopy);
        }
    };
    return (
        <Box sx={{
            display: 'flex',
            width: '100%',
            gap: 1,
            touchAction: 'none',
            alignItems: 'end',
            justifyContent: message?.sender === receiver?._id ? 'start' : 'end',
        }}
             onContextMenu={onContextMenu}
        >
            {
                showReply &&
                <IconButton
                    sx={{
                        order: message?.sender === receiver?._id ? 2 : 1
                    }}
                    onClick={() => setReplyTo(message)}
                >
                    <ReplyOutlined sx={{
                        transform: `scaleX(${message?.sender === receiver?._id ? -1 : 1})`
                    }}/>
                </IconButton>
            }
            <Box sx={{
                display: 'flex',
                justifyContent: message?.sender === receiver?._id ? 'start' : 'end',
                flexDirection: message?.sender === receiver?._id ? 'row' : 'row-reverse',
                order: message?.sender === receiver?._id ? 1 : 2,
                gap: 1,
                width: '100%'
            }}>
                <img
                    src={
                        (message?.sender === conversation?.managerId?._id)
                            ? conversation?.institutionId?.mainPhoto
                            : conversation?.userId?.avatar
                    }
                    alt={message?._id}
                    style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }}
                />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: 'calc(100% - 46px)',
                    position: 'relative',
                    alignItems: message?.sender === receiver?._id ? 'start' : 'end',
                }}>
                    <Box>
                        {
                            message?.sender === conversation?.managerId?._id
                                ? conversation?.institutionId?.title
                                : conversation?.userId?.name
                        }
                    </Box>
                    <Button
                        id={`demo-positioned-button${message?._id}`}
                        aria-controls={open ? `demo-positioned-menu${message?._id}` : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        {...longPressEvent}
                        sx={{
                            bgcolor: 'info.main',
                            padding: '10px',
                            borderRadius: message?.sender === receiver?._id ? '0px 15px 15px 15px' : '15px 0px 15px 15px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            maxWidth: '80%',
                            textTransform: 'none',
                            "&:hover": {
                                bgcolor: 'info.main',
                                color: "inherit",
                            },
                        }}
                        disableRipple
                    >
                        <Box
                            ref={textRef}
                            sx={{
                                whiteSpace: 'break-spaces',
                                fontSize: '14px',
                                color: 'info.contrastText',
                                textAlign: 'start',
                                width: '100%'
                            }}
                        >
                            {message?.text}
                        </Box>
                        <Box sx={{
                            fontSize: '12px',
                            color: 'info.contrastText',
                            display: 'flex',
                            width: '100%',
                            justifyContent: message?.sender === receiver?._id ? 'end' : 'start'
                        }}>
                            {
                                diffInHour < 1 ?
                                    dayjs(message?.createdAt).fromNow()
                                    : dayjs(message?.createdAt).format('HH:mm')
                            }
                        </Box>
                    </Button>
                    <Menu
                        id={`demo-positioned-menu${message?._id}`}
                        aria-labelledby={`demo-positioned-button${message?._id}`}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'center',
                            horizontal: message?.sender === receiver?._id  ? 'left' : 'right'
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: message?.sender === receiver?._id  ? 'left' : 'right',
                        }}
                        sx={{
                            width: '180px',
                            "& div ul li": {
                                borderBottom: '1px solid silver'
                            },
                            "& div ul li:last-child": {
                                borderBottom: 'none'
                            }
                        }}
                    >
                        {
                            [
                                {
                                    icon: <ReplyOutlined sx={{transform: 'rotateY(180deg)'}}/>,
                                    text: translate('buttons.reply'),
                                    onClick: () => setReplyTo(message)
                                },
                                {
                                    icon: <ContentCopy/>,
                                    text: translate('buttons.copy'),
                                    onClick: copyText
                                }
                            ].map((item, index) => (
                                <MenuItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        height: '30px',
                                    }}
                                    onClick={() => {
                                        item?.onClick()
                                        handleClose()
                                    }}
                                >
                                    {item?.text}
                                    {item?.icon}
                                </MenuItem>
                            ))
                        }
                    </Menu>
                </Box>
            </Box>
        </Box>
    );
};
export default MessageCard;
