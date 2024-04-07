import {DeleteOutlined, DoneAllRounded, DoneRounded, DragHandle, MoreVertRounded} from "@mui/icons-material";
import {Reorder, useDragControls, useMotionValue} from "framer-motion";
import {useContext, useEffect, useState, MouseEvent} from "react";
import {Box, Button, IconButton, Popover} from "@mui/material";
import parse from "html-react-parser";
import CryptoJS from "crypto-js";
import dayjs from "dayjs";

import {IConversation} from "@/interfaces/common";
import {secretKeyCryptMessage} from "@/config/const";
import {formatText, TruncateSingleText} from "@/utils";
import {useLink, useTranslate} from "@refinedev/core";
import {useMobile, useUserInfo} from "@/hook";
import {ColorModeContext} from "@/contexts";
import {CHATS, SHOW} from "@/config/names";
import {useStore} from "@/store";
import NoAvatar from "../../../../public/images/chats/noAvatar.png";

interface IProps {
    conversation: IConversation,
    isSelectedChat: boolean,
    handleDeleteChat: (chat: IConversation) => void,
    index: number,
}

const messageStatus = {
    sent: <DoneRounded/>,
    read: <DoneAllRounded/>
}

const ListChatCard = ({conversation, isSelectedChat, handleDeleteChat, index}: IProps) => {

    const {chatEditMode} = useStore();
    const controls = useDragControls();
    const y = useMotionValue(0);

    const link = useLink();
    const {user} = useUserInfo();
    const {device} = useMobile();
    const translate = useTranslate();
    const {mode} = useContext(ColorModeContext);


    const [currentChat, setCurrentChat] = useState<IConversation>(conversation);
    useEffect(() => {
        if (conversation) {
            setCurrentChat(conversation);
        }
    }, [conversation]);

    const sender = currentChat?.members?.find((member) => {
        // const memberSender = member?.user as ProfileProps;
        return member?.userId === currentChat?.lastMessage?.sender;
    });

    const encryptedLastMessage = currentChat?.lastMessage?.text?.length > 5 ? JSON?.parse(CryptoJS.AES.decrypt(currentChat?.lastMessage?.text, secretKeyCryptMessage)?.toString(CryptoJS.enc.Utf8)) : "";

    const isSameUser = currentChat?.lastMessage?.sender === user?._id;

    const isUnreadMessage = !isSameUser && currentChat?.lastMessage?.status !== 'read';

    const cardStyle = chatEditMode ? {
        bgcolor: mode === 'dark' ? "#494949" : '#d8d8d8',
        color: 'common.white',
        cursor: 'default',
        borderRadius: '4px',
    } : {
        borderRadius: '20px',
        bgcolor: isSelectedChat ? "info.main" : 'modern.modern_4.main',
        color: isSelectedChat && !chatEditMode ? "secondary.contrastText" : 'common.white',
        cursor: isSelectedChat ? 'default' : 'pointer',
        "&:hover": {
            bgcolor: "info.main",
            color: "secondary.contrastText",
            boxShadow: '0px 4px 8px 0px rgba(125, 125, 125, 0.6)',
            "& svg": {
                color: '#f9f9f9'
            },
            "& .newUnreadMessage": {
                bgcolor: 'success.main'
            }
        }
    };
    return (
        <Reorder.Item
            value={currentChat?._id}
            key={currentChat?._id}
            initial={{opacity: 0, scale: 0.5, y: -300}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, x: 200, scale: 1.2}}
            transition={{
                duration: 0.3,
                type: 'spring',
                delay: (0.2 + (0.1 * index))
            }}
            style={{
                y,
                width: '100%',
                listStyleType: 'none',
                display: 'flex',
                alignItems: 'center',
            }}
            dragListener={false}
            dragControls={controls}
        >
            <Box
                component={chatEditMode ? 'div' : link}
                to={`/${CHATS}/${SHOW}/${currentChat?._id}`}
                sx={{
                    position: 'relative',
                    width: '100%',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    transition: 'all 300ms linear',
                    p: 1.5,
                    gap: 1,
                    ...cardStyle
                }}
            >
                {
                    isUnreadMessage && (
                        <Box
                            className={'newUnreadMessage'}
                            sx={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                                boxShadow: '0px 0px 2px 0px silver',
                                zIndex: 6,
                                width: '12px',
                                borderRadius: '50%',
                                height: '12px',
                                bgcolor: isSelectedChat && !chatEditMode ? 'success.main' : 'info.main'
                            }}
                        />
                    )
                }
                <Box sx={{
                    position: 'relative',
                    height: '100%',
                }}>
                    <Box sx={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        "& img": {
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }
                    }}>
                        <img
                            src={currentChat?.picture || NoAvatar}
                            alt={currentChat?.chatName}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'normal',
                        gap: 2,
                        justifyContent: 'space-between',
                        width: '100%'
                    }}>
                        <TruncateSingleText
                            styles={{
                                width: 'calc(100% - 35px)',
                                fontWeight: 600
                            }}
                            str={currentChat?.chatName || translate("chats.user.notFound")}
                        />
                        {
                            !chatEditMode && (
                                <Box sx={{
                                    fontSize: '13px'
                                }}>
                                    {currentChat?.lastMessage?.updatedAt && dayjs(currentChat?.lastMessage?.updatedAt)?.format('HH:mm')}
                                </Box>
                            )
                        }
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'end',
                        width: '100%'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            gap: !isSameUser ? 1 : 0,
                            alignItems: 'center'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                {
                                    !isSameUser &&
                                    (
                                        <TruncateSingleText
                                            styles={{
                                                fontSize: {xs: '14px', sm: '16px'},
                                                fontWeight: 600,
                                                color: 'common.white',
                                                maxWidth: '60px',
                                                width: 'fit-content'
                                            }}
                                            str={typeof sender?.user !== 'string' && sender?.user?.name}
                                        />
                                    )
                                }
                            </Box>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                gap: 1,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                "& a": {
                                    color: 'var(--color-accent-fg)',
                                    textDecoration: 'underline'
                                },
                                "& div.wmde-markdown": {
                                    fontSize: {xs: "13px", sm: '15px'},
                                    color: isSelectedChat ? '#f9f9f9' : mode === 'dark' ? '#c1c1c1' : '#626262',
                                },
                                "& svg": {
                                    width: '14px',
                                    height: '14px'
                                }
                            }}>
                                <TruncateSingleText
                                    styles={{
                                        width: 'calc(100% - 50px)'
                                    }}
                                    str={parse(formatText({text: encryptedLastMessage}))}
                                />
                                {
                                    isSameUser && !chatEditMode && (messageStatus[currentChat?.lastMessage?.status || 'sent'])
                                }
                            </Box>
                        </Box>
                    </Box>
                    {/*<TypingIndicator chat={currentChat} userId={user?._id}/>*/}
                </Box>
                {
                    chatEditMode ? (
                        <Box
                            sx={{
                                display: 'flex',
                                width: 'fit-content',
                                cursor: 'grab',
                                touchAction: "none"
                            }}
                            onPointerDown={(event) => controls.start(event, {snapToCursor: device})}
                        >
                            <DragHandle fontSize={'large'}/>
                        </Box>
                    ) : currentChat?._id && (
                        <ChatCardPopover
                            handleDeleteChat={handleDeleteChat}
                            chat={currentChat}
                            isSelectedChat={isSelectedChat}
                        />
                    )
                }
            </Box>
        </Reorder.Item>
    );
};

type TChatCardPopover = {
    chat: IConversation,
    isSelectedChat: boolean,
    handleDeleteChat: (chat: IConversation) => void
}
const ChatCardPopover = ({chat, isSelectedChat, handleDeleteChat}: TChatCardPopover) => {

    const translate = useTranslate();

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleMoreButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAnchorEl(e.currentTarget);
    }
    const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? `listChatCardPopover${chat?._id}` : undefined;
    return (
        <Box>
            <IconButton
                onClick={handleMoreButtonClick}
                sx={{
                    minWidth: 'fit-content',
                    color: isSelectedChat ? '#f9f9f9' : 'common.white',
                    p: 0,
                    mr: '-8px'
                }}
            >
                <MoreVertRounded/>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                sx={{
                    "& div.MuiPaper-root": {
                        backgroundColor: 'common.black',
                        color: 'common.white',
                        py: 1,
                        px: 2,
                        borderRadius: '16px',
                        boxShadow: `0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)`,
                    },
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        "& > button": {
                            py: 0.5,
                            px: 2,
                            borderRadius: '20px',
                            color: 'common.white',
                            bgcolor: 'transparent',
                            transition: '300ms linear',
                            fontSize: '1rem',
                            textTransform: 'inherit',
                            "&:hover": {
                                bgcolor: 'common.white',
                                color: 'common.black',
                                "& svg": {
                                    color: 'common.black',
                                }
                            }
                        }
                    }}
                >
                    {
                        [
                            {
                                text: translate('buttons.delete'),
                                action: (e: MouseEvent<HTMLButtonElement>) => {
                                    e.preventDefault();
                                    setAnchorEl(null);
                                    handleDeleteChat(chat)
                                },
                                icon: <DeleteOutlined/>
                            }
                        ]?.map((value, index) => (
                            <Button
                                key={index}
                                onClick={value?.action}
                                endIcon={value?.icon}
                            >
                                {value?.text}
                            </Button>
                        ))
                    }
                </Box>
            </Popover>
        </Box>
    )
}
export default ListChatCard
