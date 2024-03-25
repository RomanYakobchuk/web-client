import {
    ContentCopy,
    ReplyOutlined,
    Edit,
    DeleteRounded
} from "@mui/icons-material";
import {useNotification, useTranslate} from "@refinedev/core";
import {useEffect, useState} from "react";
import {Box, Menu, MenuItem} from "@mui/material";
import CryptoJS from "crypto-js";
import {motion} from "framer-motion";

import {ButterflyIcon} from "@/components/chats/utils/Butterfly";
import {secretKeyCryptMessage} from "@/config/const";
import useLongPress from "@/hook/useLongPress";
import {IMessage} from "@/interfaces/common";

import {receiverBorder, senderBorder} from "./messageBorderStyle";
import {MessageText} from "@/components/chats/utils/messageText";
import {useStore} from "@/store";
import "./styles.css";
import "./message.css";

interface IProps {
    item: IMessage,
    lengthGroup: number,
    index: number,
    theSameUser: boolean,
}

const MessagesCard = ({item: message, lengthGroup, index, theSameUser}: IProps) => {

    const [messageText, setMessageText] = useState<string>("");
    const onClick = () => {
        // console.log('press')
    }
    const onLongPress = () => {
        setAnchorEl(document.getElementById(`demo-positioned-button${message?._id}`));
    }
    const longPressEvent = useLongPress(onLongPress, onClick, {
        shouldPreventDefault: false,
        delay: 300,
    });

    useEffect(() => {
        if (message?.text) {
            const encryptedText = message?.text?.length > 5 ? JSON?.parse(CryptoJS.AES.decrypt(message?.text, secretKeyCryptMessage)?.toString(CryptoJS.enc.Utf8)) : "";
            setMessageText(encryptedText);
        }
        return () => {
            setMessageText("")
        }
    }, [message?.text, message?._id]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
    };


    // if (!messageText) {
    //     return null;
    // }
    //

    return (
        // <>
        //     {
        //         message &&
        <motion.li
            layout
            key={message?._id}
            initial="hidden"
            whileInView="visible"
            variants={{
                hidden: {
                    opacity: 0, scale: 0.7, x: theSameUser ? -300 : 300,
                    transition: {
                        when: 'afterChildren'
                    }
                },
                visible: {
                    opacity: 1, x: 0, scale: 1, y: 0,
                    transition: {
                        when: 'beforeChildren'
                    }
                }
            }}
            exit={{
                opacity: 0,
                x: theSameUser ? -200 : 200,
                scale: 1.2,
                transition: {
                    duration: 0.6,
                    ease: 'easeOut'
                },
            }}
            transition={{
                duration: 0.4,
                type: 'spring',
                // bounce: 0.3,
                ease: 'easeOut'
            }}
            viewport={{
                once: true,
            }}
            id={message?._id}
            style={{
                listStyleType: 'none',
                width: 'fit-content',
                height: 'fit-content',
                paddingRight: theSameUser ? '5px' : '0',
                position: 'relative',
                maxWidth: '100%',
                paddingLeft: !theSameUser ? '10px' : '0',
            }}>
            <Box
                id={`demo-positioned-button${message?._id}`}
                aria-controls={open ? `demo-positioned-menu${message?._id}` : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                {...longPressEvent}
                sx={{
                    width: '100%',
                    // minHeight: '24px',
                    bgcolor: !theSameUser ? 'success.main' : 'info.main',
                    borderRadius: !theSameUser ? receiverBorder(lengthGroup, index)({}) : senderBorder(lengthGroup, index)({}),
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    textTransform: 'none',
                    cursor: 'pointer',
                    zIndex: 0,
                    justifyContent: 'center',
                    "& div.wmde-markdown": {
                        p: '0 !important'
                    }
                }}
            >
                {
                    index === 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '-6.5px',
                                zIndex: 0,
                                right: theSameUser ? '-9px' : 'unset',
                                left: !theSameUser ? '-9px' : 'unset',
                                transform: theSameUser ? 'rotateX(180deg)' : 'rotateX(180deg) rotateY(180deg)',
                                "& svg": {
                                    width: 16,
                                    height: 16,
                                    "& path": {
                                        fill: theSameUser ? '#2874CB' : '#67be23'
                                        // fill: 'black'
                                    }
                                }
                            }}
                        >
                            {
                                theSameUser
                                    ? (
                                        <ButterflyIcon
                                        />
                                    ) : (
                                        <ButterflyIcon/>
                                    )
                            }
                        </Box>
                    )
                }
                <Box sx={{
                    ml: 'auto',
                    maxWidth: '100%',
                    minWidth: '56px',
                    // boxShadow: '0 1px 2px #10232f26',
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column-reverse'
                }}>
                    <MessageText
                        message={message}
                        text={messageText}
                        theSameUser={theSameUser}
                        createdAt={message?.createdAt}
                    />
                </Box>
            </Box>
            {
                open && (
                    <MessageCardMenu
                        message={message}
                        open={open}
                        theSameUser={theSameUser}
                        messageText={messageText}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                    />
                )
            }
        </motion.li>
        // }
        // </>
    );
};
export default MessagesCard

type TMessageCardMenu = {
    message: IMessage,
    open: boolean,
    theSameUser: boolean,
    messageText: string,
    handleClose: () => void,
    anchorEl: HTMLElement | null,
}
const MessageCardMenu = ({message, open, theSameUser, messageText, anchorEl, handleClose}: TMessageCardMenu) => {

    const {setStateMessage, chatMessages, handleUpdateMessages} = useStore(state => state);

    const {open: openNot} = useNotification();
    const translate = useTranslate();
    const copyText = async () => {
        if (messageText) {
            await navigator.clipboard.writeText(messageText);
            openNot?.({
                type: 'success',
                message: 'Success'
            })
        }
    };

    const handleDeleteMessage = (message: IMessage) => {
        setTimeout(() => {
            handleUpdateMessages(chatMessages?.filter((item) => item?._id !== message?._id));
        }, 1000);
    }

    return (
        <Menu
            id={`demo-positioned-menu${message?._id}`}
            aria-labelledby={`demo-positioned-button${message?._id}`}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'center',
                horizontal: theSameUser ? 'left' : 'right'
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: theSameUser ? 'left' : 'right',
            }}

            sx={{
                "& > div.MuiPaper-root": {
                    px: 2,
                    py: 1,
                    bgcolor: 'common.black',
                    borderRadius: '16px',
                    "& ul": {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        "& li": {
                            gap: 1,
                            p: '10px 20px',
                            borderRadius: '20px',
                            transition: '200ms linear',
                            height: 'fit-content',
                            "&:hover": {
                                bgcolor: 'common.white',
                                "&:not(.deleteMessage)": {
                                    color: 'common.black',
                                }
                            }
                        }
                    }
                },
            }}
        >
            {
                [
                    {
                        icon: <ReplyOutlined sx={{transform: 'rotateY(180deg)'}}/>,
                        text: translate('buttons.reply'),
                        onClick: () => {
                            setStateMessage({
                                typeState: 'reply',
                                message: {
                                    ...message,
                                    text: messageText,
                                    newText: null,
                                }
                            })
                        }
                    },
                    {
                        icon: <ContentCopy/>,
                        text: translate('buttons.copy'),
                        onClick: () => copyText()
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
            {
                theSameUser && (
                    <MenuItem
                        key={'edit'}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '30px',
                        }}
                        onClick={() => {
                            setStateMessage({
                                typeState: 'edit',
                                message: {
                                    ...message,
                                    text: messageText,
                                    newText: messageText
                                }
                            })
                            handleClose()
                        }}
                    >
                        {translate('buttons.edit')}
                        <Edit/>
                    </MenuItem>
                )
            }
            {
                (theSameUser || !theSameUser) && (
                    <MenuItem
                        key={'delete'}
                        className={'deleteMessage'}
                        sx={{
                            color: 'error.main',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '30px',
                        }}
                        onClick={async () => {
                            handleClose();
                            handleDeleteMessage(message);
                        }}
                    >
                        {translate('buttons.delete')}
                        <DeleteRounded/>
                    </MenuItem>
                )
            }
        </Menu>
    )
}